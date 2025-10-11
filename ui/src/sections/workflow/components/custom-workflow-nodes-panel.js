import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Drawer,
    Typography,
    Box,
    IconButton,
    TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/iconify";

const customOperations = [
    {
        id: 1,
        title: "Ingestion",
        description: "Document Ingestion.",
        icon: "/assets/icons/workflow/ingestion.svg",
        type: "ingestion",
        bgColor: "#0AAFFF",
        borderColor: "#0884CC",
        color: "#0AAFFF",
    },
    {
        id: 2,
        title: 'Notification',
        description: 'Notification Sender Node.',
        icon: '/assets/icons/workflow/notification.png',
        type: 'notification',
        bgColor: '#00A76F',
        borderColor: '#2e7d32',
        color: '#00A76F'
    },
    {
        id: 3,
        title: "Decision",
        description: "Decision Node – Used to evaluate conditions and trigger the next step in the workflow",
        icon: "/assets/icons/workflow/decision.svg",
        type: "decision",
        bgColor: "#6A1B9A",
        borderColor: "#8E24AA",
        color: "#BA68C8",
    },
    {
        id: 4,
        title: "Time Trigger",
        description: "Triggers the workflow based on a scheduled time, interval, or cron expression.",
        icon: "/assets/icons/workflow/time.svg",
        type: "timeTrigger",
        bgColor: "#1565C0",
        borderColor: "#1976D2",
        color: "#64B5F6",
    },
    {
        id: 5,
        title: "Wait / Delay",
        description: "Pauses the workflow execution for a specific duration or until a defined condition is met.",
        icon: "/assets/icons/workflow/wait.svg",
        type: "waitTrigger",
        bgColor: "#EF6C00",
        borderColor: "#F57C00",
        color: "#FFB74D",
    },
    {
        id: 6,
        title: "Approval",
        description: "Stops workflow execution until a user manually approves or rejects the request.",
        icon: "/assets/icons/workflow/approval.svg",
        type: "approval",
        bgColor: "#1565C0",
        borderColor: "#1976D2",
        color: "#64B5F6",
    },
    {
        id: 7,
        title: "Event Trigger",
        description: "Waits for an external event (API callback, socket message, or webhook) before continuing the workflow.",
        icon: "/assets/icons/workflow/event.svg",
        type: "event",
        bgColor: "#2E7D32",
        borderColor: "#388E3C",
        color: "#81C784",
    },
    {
        id: 8,
        title: "Webhook",
        description: "Triggers or waits for an external event from another system (such as an API callback, webhook, or socket message) to continue the workflow automatically.",
        icon: "/assets/icons/workflow/webhook.svg",
        type: "webhook",
        bgColor: "#1565C0",       
        borderColor: "#1976D2",
        color: "#90CAF9",         
    },
    {
        id: 9,
        title: "Set Variables",
        description: "Defines or updates variables used within the workflow to store dynamic values for later steps or conditions.",
        icon: "/assets/icons/workflow/variable.svg",
        type: "variable",
        bgColor: "#6A1B9A",       
        borderColor: "#8E24AA",
        color: "#CE93D8",     
    }
];

export default function CustomWorkflowNodesPanel({
    onSelect,
    onClose,
    open,
    bluePrintNode,
}) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const newData = customOperations.filter(
            (opt) => !bluePrintNode?.includes(opt.title)
        );
        setData(newData);
    }, [bluePrintNode]);

    // Filtered list based on search
    const filteredData = data.filter(
        (operation) =>
            operation.title.toLowerCase().includes(search.toLowerCase()) ||
            operation.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 320, padding: 2 },
            }}
        >
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <Typography variant="h6">Add Workflow Node</Typography>
                <IconButton onClick={onClose} size="small">
                    <Iconify icon="mdi:close" width={20} height={20} />
                </IconButton>
            </Box>

            {/* Search Field */}
            <TextField
                size="small"
                fullWidth
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* List */}
            <List>
                {filteredData.map((operation) => (
                    <ListItem
                        key={operation.id}
                        disablePadding
                        sx={{ borderBottom: "1px solid lightgray" }}
                    >
                        <ListItemButton onClick={() => onSelect(operation)}>
                            <ListItemAvatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    backgroundColor: operation.color,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    src={operation.icon}
                                    alt={operation.title}
                                    sx={{ width: 32, height: 32 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={operation.title}
                                secondary={operation.description}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                {filteredData.length === 0 && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        mt={2}
                    >
                        No results found
                    </Typography>
                )}
            </List>
        </Drawer>
    );
}

CustomWorkflowNodesPanel.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    bluePrintNode: PropTypes.array,
};
