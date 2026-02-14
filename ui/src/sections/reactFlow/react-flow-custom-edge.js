import PropTypes from 'prop-types';
import { getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function CustomEdgeWithSettings(props) {
    const {
        id,
        source,
        target,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style,
        markerEnd,
        data,
    } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleClick = () => {
        const payload = {
            edgeId: id,
            sourceNode: source,
            targetNode: target
        };

        data?.handleEdgePopup?.(payload);
    }

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                style={style}
                markerEnd={markerEnd}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 50}px)`,
                        pointerEvents: 'all',
                        zIndex: 10,
                    }}
                >
                    <IconButton size="medium" onClick={() => handleClick()}>
                        <Iconify icon="solar:clock-circle-bold" width={24} />
                    </IconButton>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

CustomEdgeWithSettings.propTypes = {
    id: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    sourceX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    sourcePosition: PropTypes.string,
    targetPosition: PropTypes.string,
    style: PropTypes.object,
    markerEnd: PropTypes.string,
    data: PropTypes.object
};
