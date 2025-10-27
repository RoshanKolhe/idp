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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/iconify";

const customOperations = [
  // 🔹 TRIGGER NODES
  {
    category: "Triggers",
    items: [
      {
        id: 4,
        title: "Time Trigger",
        description:
          "Triggers the workflow based on a scheduled time, interval, or cron expression.",
        icon: "/assets/icons/workflow/time.svg",
        type: "timeTrigger",
        bgColor: "#1565C0",
        borderColor: "#1976D2",
        color: "#64B5F6",
      },
      // {
      //   id: 7,
      //   title: "Event Trigger",
      //   description:
      //     "Waits for an external event (API callback, socket message, or webhook) before continuing the workflow.",
      //   icon: "/assets/icons/workflow/event.svg",
      //   type: "event",
      //   bgColor: "#2E7D32",
      //   borderColor: "#388E3C",
      //   color: "#81C784",
      // },
      {
        id: 8,
        title: "Webhook",
        description:
          "Triggers or waits for an external event from another system (such as an API callback or webhook) to continue the workflow automatically.",
        icon: "/assets/icons/workflow/webhook.svg",
        type: "webhook",
        bgColor: "#1565C0",
        borderColor: "#1976D2",
        color: "#90CAF9",
      },
    ],
  },

  // 🔹 ACTION NODES
  {
    category: "Actions",
    items: [
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
        title: "Notification",
        description: "Notification Sender Node.",
        icon: "/assets/icons/workflow/notification.png",
        type: "notification",
        bgColor: "#00A76F",
        borderColor: "#2e7d32",
        color: "#00A76F",
      },
      // {
      //   id: 6,
      //   title: "Approval",
      //   description:
      //     "Stops workflow execution until a user manually approves or rejects the request.",
      //   icon: "/assets/icons/workflow/approval.svg",
      //   type: "approval",
      //   bgColor: "#1565C0",
      //   borderColor: "#1976D2",
      //   color: "#64B5F6",
      // },
      {
        id: 10,
        title: "API",
        description:
          "Connects your workflow with external systems or internal endpoints. You can send requests, receive data, and use dynamic variables from previous steps in real time.",
        icon: "/assets/icons/workflow/api.svg",
        type: "api",
        bgColor: "#0D47A1",
        borderColor: "#1976D2",
        color: "#BBDEFB",
      },
    ],
  },

  // 🔹 LOGIC NODES
  {
    category: "Logic",
    items: [
      {
        id: 3,
        title: "Decision",
        description:
          "Used to evaluate conditions and trigger the next step in the workflow.",
        icon: "/assets/icons/workflow/decision.svg",
        type: "decision",
        bgColor: "#6A1B9A",
        borderColor: "#8E24AA",
        color: "#BA68C8",
      },
      {
        id: 5,
        title: "Wait / Delay",
        description:
          "Pauses the workflow execution for a specific duration or until a defined condition is met.",
        icon: "/assets/icons/workflow/wait.svg",
        type: "waitTrigger",
        bgColor: "#EF6C00",
        borderColor: "#F57C00",
        color: "#FFB74D",
      },
      {
        id: 9,
        title: "Set Variables",
        description:
          "Defines or updates variables used within the workflow to store dynamic values for later steps or conditions.",
        icon: "/assets/icons/workflow/variable.svg",
        type: "variable",
        bgColor: "#6A1B9A",
        borderColor: "#8E24AA",
        color: "#CE93D8",
      },
      {
        id: 11,
        title: "Code",
        description:
          "Execute custom JavaScript logic within your workflow. You can transform data, perform calculations, or create conditional logic using dynamic variables.",
        icon: "/assets/icons/workflow/code.svg",
        type: "code",
        bgColor: "#263238",
        borderColor: "#37474F",
        color: "#80CBC4",
      },
      {
        id: 12,
        title: "Iterator",
        description:
          "The Iterator node loops through a list of items and executes the connected actions for each one. It’s ideal for repeating tasks, processing arrays, or applying logic to multiple inputs dynamically.",
        icon: "/assets/icons/workflow/iterator.svg",
        type: "iterator",
        bgColor: "#1E3A8A",       // Deep indigo – stable and logical
        borderColor: "#3B82F6",   // Bright blue accent for visibility
        color: "#BFDBFE",         // Soft sky-blue text for readability
      },
      {
        id: 13,
        title: "Iterator End",
        description:
          "Executes actions for each item in a list or array. Ideal for repeating tasks, processing multiple inputs, or applying logic dynamically. Use this node to mark the completion of iterations and optionally continue the workflow from a single point.",
        icon: "/assets/icons/workflow/iterator.svg",
        type: "iteratorEnd",
        bgColor: "#1E3A8A",       // Deep indigo – stable and logical
        borderColor: "#2563EB",   // Vivid blue accent for focus and clarity
        color: "#E0F2FE",         // Soft light-blue text for readability
      }
    ],
  },
];

export default function CustomWorkflowNodesPanel({
  onSelect,
  onClose,
  open,
  bluePrintNode,
}) {
  const [filteredCategories, setFilteredCategories] = useState(customOperations);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filtered = customOperations.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (opt) =>
          (!bluePrintNode?.includes(opt.title)) &&
          (opt.title.toLowerCase().includes(search.toLowerCase()) ||
            opt.description.toLowerCase().includes(search.toLowerCase()))
      ),
    }));
    setFilteredCategories(filtered);
  }, [bluePrintNode, search]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', md: '400px' }, padding: 2 },
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Add Workflow Node</Typography>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="mdi:close" width={20} height={20} />
        </IconButton>
      </Box>

      {/* Search */}
      <TextField
        size="small"
        fullWidth
        placeholder="Search nodes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Category Accordions */}
      {filteredCategories.map(
        (cat) =>
          cat.items.length > 0 && (
            <Accordion key={cat.category} defaultExpanded>
              <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
                <Typography fontWeight={600}>{cat.category}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List>
                  {cat.items.map((operation) => (
                    <ListItem
                      key={operation.id}
                      disablePadding
                      sx={{ borderBottom: "1px solid #eee" }}
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
                </List>
              </AccordionDetails>
            </Accordion>
          )
      )}

      {/* Empty State */}
      {filteredCategories.every((cat) => cat.items.length === 0) && (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
          No results found
        </Typography>
      )}
    </Drawer>
  );
}

CustomWorkflowNodesPanel.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  bluePrintNode: PropTypes.array,
};
