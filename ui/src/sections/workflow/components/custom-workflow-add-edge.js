/* eslint-disable no-bitwise */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getBezierPath } from 'reactflow';

// Convert hex color to RGB
function hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

// Interpolate between two RGB colors
function interpolateColor(startRgb, endRgb, factor) {
    return {
        r: Math.round(startRgb.r + (endRgb.r - startRgb.r) * factor),
        g: Math.round(startRgb.g + (endRgb.g - startRgb.g) * factor),
        b: Math.round(startRgb.b + (endRgb.b - startRgb.b) * factor),
    };
}

// Convert RGB to CSS color string
function rgbToCss({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}

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
                    const localT = t / 0.4; // Scale 0 → 0.4 to 0 → 1
                    color = interpolateColor(startRgb, midRgb, localT);
                } else if (t >= 0.4 && t <= 0.6) {
                    color = midRgb; // Solid mid color
                } else {
                    const localT = (t - 0.6) / 0.4; // Scale 0.6 → 1 to 0 → 1
                    color = interpolateColor(midRgb, endRgb, localT);
                }

                return (
                    <circle
                        key={`${id}-dot-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={10}
                        fill={rgbToCss(color)}
                    />
                );
            })
            }
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

export default CustomDottedEdge;
