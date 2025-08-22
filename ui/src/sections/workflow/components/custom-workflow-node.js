import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@mui/material";
import { Handle, Position } from "reactflow";
import Iconify from "src/components/iconify";

export default function CustomWorkflowNode({ data }) {

    console.log('data', data);
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "400px",
                minHeight: "120px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: 2,
                padding: "8px 12px",
                gap: 1.5,
            }}
        >
            {/* Left icon box */}
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "10px",
                    backgroundColor: data.bgColor || "#f50057",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Box
                    component="img"
                    src={data.icon}
                    alt="icon"
                    sx={{ width: 40, height: 40 }}
                />
            </Box>

            {/* Title + subtitle */}
            <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#222" }}>
                    {data.label}
                </Typography>
                <Typography sx={{ fontSize: "16px", color: "gray" }}>
                    {data.description}
                </Typography>
            </Box>


            {/* Right action icons */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small">
                    <Iconify icon="mdi:cog-outline" fontSize={18} />
                </IconButton>
                <IconButton size="small">
                    <Iconify icon="mdi:delete-outline" fontSize={18} />
                </IconButton>
            </Box>

            {/* Source Handle (Top) */}
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    top: -6,            // place above node
                    left: "50%",        // center horizontally
                    transform: "translateX(-50%)",
                    background: "#555",
                }}
                id="source-connector"
                isConnectable
            />

            {/* Target Handle (Bottom) */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{
                    bottom: -6,         // place below node
                    left: "50%",        // center horizontally
                    transform: "translateX(-50%)",
                    background: "#555",
                }}
                id="target-connector"
                isConnectable
            />
        </Box>
    );
}

CustomWorkflowNode.propTypes = {
    data: PropTypes.object,
};
