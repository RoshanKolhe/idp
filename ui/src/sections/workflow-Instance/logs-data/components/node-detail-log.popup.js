/* eslint-disable no-nested-ternary */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";

const renderData = (data) => {
  if (Array.isArray(data)) {
    if (data.length === 0) return <Typography>No data</Typography>;

    const keys = Object.keys(data[0]);
    return (
      <Table size="small" sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
            {keys.map((key) => (
              <TableCell key={key} sx={{ fontWeight: 600 }}>
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keys.map((key) => (
                <TableCell key={key}>
                  {typeof row[key] === "object"
                    ? JSON.stringify(row[key], null, 2)
                    : String(row[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (typeof data === "object" && data !== null) {
    return (
      <Table size="small" sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell sx={{ fontWeight: 600, width: "30%" }}>{key}</TableCell>
              <TableCell>
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return (
      <Box sx={{ backgroundColor: "rgba(0,0,0,0.03)", p: 1.5, borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {String(data)}
        </Typography>
      </Box>
    );
  }

  return <Typography variant="body2">No output available</Typography>;
};

const getStatusChip = (status) => {
  switch (status) {
    case 1:
      return <Chip label="Success" color="success" variant="outlined" />;
    case 0:
      return <Chip label="Failed" color="error" variant="outlined" />;
    default:
      return <Chip label="Warning" color="warning" variant="outlined" />;
  }
};

export default function ExecutionLogPopup({ open, onClose, log }) {
  if (!log) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 3, backgroundColor: "#fafafa" },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight={700}>
          Node Execution Details
        </Typography>
        {getStatusChip(log.status)}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Node ID: <b>{log.nodeId}</b>
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Executed At: {new Date(log.createdAt).toLocaleString()}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* OUTPUT SECTION */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Output
        </Typography>
        {renderData(log.output)}

        {/* ERROR SECTION */}
        {log.error && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: "error.main" }}>
              Error
            </Typography>
            {renderData(log.error)}
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body2"
          color={
            log.status === 1
              ? "success.main"
              : log.status === 0
              ? "error.main"
              : "warning.main"
          }
          sx={{ fontWeight: 600, textAlign: "right" }}
        >
          {log.status === 1
            ? "Execution Completed Successfully"
            : log.status === 0
            ? "Execution Failed"
            : "Execution Warning"}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

ExecutionLogPopup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    log: PropTypes.object
}
