import PropTypes from "prop-types";
import { Box, Stack, Typography, TextField } from "@mui/material";
import { useState } from "react";
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import { getAgents, getAgentById } from "@repo/idp-agents";
import { LoadingButton } from "@mui/lab";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";

// Import our new agents package

export default function WorkFlowMonorepo({ data, id }) {
  const [open, setOpen] = useState(false);

  // The data prop should ideally contain the agent ID this node represents
  // Fallback to the first agent if not specified for demonstration
  const allAgents = getAgents();
  const agentId = data?.agentId || (allAgents.length > 0 ? allAgents[0].id : null);
  const agentData = agentId ? getAgentById(agentId) : null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!agentData) {
    return (
      <Box component="div">
        <Typography color="error">Agent Not Found</Typography>
      </Box>
    );
  }

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">

        {/* NODE ICON — click to open configuration */}
        <Box
          component="div"
          onClick={handleOpen}
          sx={{ cursor: "pointer" }}
        >
          {/* Passing modified data to CustomWorkflowNode to display the agent's actual name */}
          <CustomWorkflowNode data={{ ...data, label: agentData.name }} />
        </Box>

        {/* CONFIGURATION POPUP */}
        <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title={data?.label || 'Agent'} color={data.bgColor}>
          <Stack spacing={2}>
            {agentData.configFields?.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder || ""}
                required={field.required}
                fullWidth
                defaultValue={agentData.defaultValues?.[field.name] || ""}
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: '10px',
              mt: 2,
            }}
          >
            <LoadingButton sx={{ backgroundColor: data.bgColor, borderColor: data.borderColor }} type="submit" variant="contained">
              Add
            </LoadingButton>
          </Box>
        </CustomWorkflowDialogue>
      </Stack>
    </Box>
  );
}

WorkFlowMonorepo.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
};
