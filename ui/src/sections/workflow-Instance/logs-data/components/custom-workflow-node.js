import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import { useWorkflowContext } from "src/sections/workflow/hooks";

export default function CustomWorkflowNode({ data }) {
  const { workflowDirection } = useWorkflowContext();

  // Define soft, modern color themes for logs
  const colors = {
    success: {
      bg: "linear-gradient(135deg, rgba(72,239,128,0.15), rgba(72,239,128,0.25))",
      border: "1px solid rgba(72,239,128,0.4)",
    },
    error: {
      bg: "linear-gradient(135deg, rgba(255,99,71,0.15), rgba(255,99,71,0.25))",
      border: "1px solid rgba(255,99,71,0.4)",
    },
    warning: {
      bg: "linear-gradient(135deg, rgba(255,193,7,0.15), rgba(255,193,7,0.25))",
      border: "1px solid rgba(255,193,7,0.4)",
    },
  };

  const statusColors =
    // eslint-disable-next-line no-nested-ternary
    data?.logStatus === 1
      ? colors.success
      : data?.logStatus === 0
      ? colors.error
      : colors.warning;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 400,
        minHeight: 120,
        borderRadius: "16px",
        background: statusColors.bg,
        border: statusColors.border,
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.1)",
        padding: "12px 16px",
        gap: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 6px 16px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.1)",
        },
      }}
    >
      {/* Icon Box */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "14px",
          backgroundColor: `${data.bgColor || "rgba(0,0,0,0.05)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          backdropFilter: "blur(4px)",
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          component="img"
          src={data.icon}
          alt="icon"
          sx={{ width: 44, height: 44 }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, textAlign: "left" }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#222",
            textTransform: "capitalize",
          }}
        >
          {data.label}
        </Typography>
        <Typography
          sx={{
            fontSize: "15px",
            color: "#555",
            marginTop: "4px",
            lineHeight: 1.3,
          }}
        >
          {data.description}
        </Typography>
      </Box>

      {/* Handles */}
      {workflowDirection === "TB" ? (
        <>
          <Handle
            type="target"
            position={Position.Top}
            style={{
              top: -8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "transparent",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "16px solid #555",
            }}
            id="source-connector"
            isConnectable
          />
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#555",
            }}
            id="target-connector"
            isConnectable
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{
              top: "50%",
              left: 0,
              transform: "translateX(-50%)",
              background: "transparent",
              width: 0,
              height: 0,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              borderLeft: "16px solid #555",
            }}
            id="source-connector"
            isConnectable
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{
              bottom: "50%",
              right: -10,
              transform: "translateX(-50%)",
              background: "#555",
            }}
            id="target-connector"
            isConnectable
          />
        </>
      )}
    </Box>
  );
}

CustomWorkflowNode.propTypes = {
  data: PropTypes.object,
};
