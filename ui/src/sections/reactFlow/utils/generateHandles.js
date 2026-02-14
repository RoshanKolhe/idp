import { Handle } from "reactflow";

export const generateHandles = ({
    type,
    position,
    count,
    startOffset = -40,
    gap = 30,
}) => Array.from({ length: count }).map((_, index) => (
    <Handle
        key={`${type}-${index}`}
        id={`${type}-${index}`}
        type={type}
        position={position}
        style={{
            top: `calc(50% + ${startOffset + index * gap}px)`,
            background: '#555',
        }}
    />
));
