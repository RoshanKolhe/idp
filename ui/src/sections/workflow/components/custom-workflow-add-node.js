import { Box, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";

export default function CustomWorkflowAddNode() {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",    // ✅ center everything
                width: "220px",
                minHeight: "100px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: 2,
                padding: "12px",
                gap: 1.5,
                flexDirection: "column",     // ✅ stack icon & text vertically
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 4,
                },
            }}
        >
            {/* Icon Box */}
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    backgroundColor: "#8E24AA",   // purple like "Start Flow"
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="img"
                    src="/assets/icons/workflow/start.svg"
                    alt="icon"
                    sx={{ width: 32, height: 32 }}
                />
            </Box>

            {/* Title */}
            <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#222", mt: 1 }}
            >
                Add Node
            </Typography>

            {/* Target Handle (Top) */}
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    top: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#555",
                }}
                id="source-connector"
                isConnectable
            />

            {/* Source Handle (Bottom) */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#555",
                }}
                id="target-connector"
                isConnectable
            />
        </Box>
    );
}
