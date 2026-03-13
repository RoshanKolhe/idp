import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    CircularProgress,
    Button
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { getWorkflowGroupedLogs } from "src/api/workflow-instance";
import Iconify from "src/components/iconify";

export default function LogsProcessDialogue({
    isOpen,
    handleCloseModal,
    outputId,
    nodeName = '',
}) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 20;
    const scrollRef = useRef(null);

    const fetchLogs = async (nextPage = 0, reset = false) => {
        setLoading(true);
        try {
            const newLogs = await getWorkflowGroupedLogs(outputId, {
                ...(nodeName ? { nodeName } : {}),
                skip: nextPage * limit,
                limit,
            });
            setLogs(prev => reset ? newLogs : [...newLogs, ...prev]);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && outputId) {
            setLogs([]);
            setPage(0);
            fetchLogs(0, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, outputId, nodeName]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogColor = (type) => {
        switch (type) {
            case 0: return "#00BFFF"; // Info
            case 1: return "#FF3B3B"; // Error
            case 2: return "#00FF00"; // Success
            case 3: return "#FFD700"; // Warning
            default: return "#FFFFFF"; // Default
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => {
            handleCloseModal();
            setPage(0);
        }} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                backgroundColor: 'black',
                color: 'white',
                py: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="subtitle1">Workflow logs</Typography>
                <IconButton 
                    onClick={() => {
                        handleCloseModal();
                        setPage(0);
                    }} 
                    sx={{ border: '1px solid white' }}
                >
                    <Iconify icon="mdi:close" color="white" />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    backgroundColor: 'black',
                    color: '#00FF00',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none', 
                    },
                }}
                ref={scrollRef}
            >
                {!loading && logs.length === 0 && (
                    <Typography
                        sx={{
                            color: "#FFFFFF",
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                        }}
                    >
                        No logs available.
                    </Typography>
                )}
                {logs.slice().reverse().map((log, index) => (
                    <Typography
                        key={log.id || index}
                        sx={{
                            color: getLogColor(log.logType),
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            mb: 1
                        }}
                    >
                        [{new Date(log.createdAt).toLocaleTimeString()}] {log.logsDescription}
                    </Typography>
                ))}
                {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            </DialogContent>

            <Box p={2} display="flex" justifyContent="center" bgcolor="black">
                <Button
                    variant="outlined"
                    onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchLogs(nextPage);
                    }}
                    disabled={loading}
                >
                    Load More
                </Button>
            </Box>
        </Dialog>
    );
}

LogsProcessDialogue.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    outputId: PropTypes.string,
    nodeName: PropTypes.string,
};
