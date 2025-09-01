import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';

// ----------------- Utility functions -----------------
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: Math.floor(bigint / (256 * 256)) % 256,
    g: Math.floor(bigint / 256) % 256,
    b: bigint % 256,
  };
}

function interpolateColor(startRgb, endRgb, factor) {
  return {
    r: Math.round(startRgb.r + (endRgb.r - startRgb.r) * factor),
    g: Math.round(startRgb.g + (endRgb.g - startRgb.g) * factor),
    b: Math.round(startRgb.b + (endRgb.b - startRgb.b) * factor),
  };
}

function rgbToCss({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

// ----------------- Custom Dotted Edge -----------------
function CustomDottedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}) {
  const [startColor, setStartColor] = useState('#00c6ff');
  const [midColor, setMidColor] = useState('#d3d3d3'); // lightgray
  const [endColor, setEndColor] = useState('#0072ff');

  useEffect(() => {
    if (data.startColor) setStartColor(data.startColor);
    if (data.midColor) setMidColor(data.midColor);
    if (data.endColor) setEndColor(data.endColor);
  }, [data]);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getPointsOnPath = (path, numPoints = 20) => {
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', path);
    const length = tempPath.getTotalLength();
    return Array.from({ length: numPoints }, (_, i) => {
      const point = tempPath.getPointAtLength((i / (numPoints - 1)) * length);
      return { x: point.x, y: point.y };
    });
  };

  const dots = getPointsOnPath(edgePath, 10);
  const startRgb = hexToRgb(startColor);
  const midRgb = hexToRgb(midColor);
  const endRgb = hexToRgb(endColor);

  return (
    <g>
      {dots.map((point, index) => {
        const t = index / (dots.length - 1);
        let color;

        if (t < 0.4) {
          const localT = t / 0.4;
          color = interpolateColor(startRgb, midRgb, localT);
        } else if (t >= 0.4 && t <= 0.6) {
          color = midRgb;
        } else {
          const localT = (t - 0.6) / 0.4;
          color = interpolateColor(midRgb, endRgb, localT);
        }

        return (
          <circle
            key={`${id}-dot-${index}`}
            cx={point.x}
            cy={point.y}
            r={3}
            fill={rgbToCss(color)}
          />
        );
      })}
    </g>
  );
}

CustomDottedEdge.propTypes = {
  id: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
  markerEnd: PropTypes.string,
  data: PropTypes.shape({
    startColor: PropTypes.string,
    midColor: PropTypes.string,
    endColor: PropTypes.string,
  }),
};

// ----------------- Curved Edge -----------------
const CurvedEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) => {
  const offset = data?.offset || 0;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: targetX + offset,
    targetY,
    targetPosition,
  });

  return <BaseEdge id={id} path={edgePath} style={{ stroke: '#555', strokeWidth: 2 }} />;
};

CurvedEdge.propTypes = {
  id: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
  data: PropTypes.object,
};

// ----------------- Export both -----------------
export { CurvedEdge, CustomDottedEdge };
