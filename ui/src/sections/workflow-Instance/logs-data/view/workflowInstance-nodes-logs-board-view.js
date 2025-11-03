import { Box, Container, IconButton, Typography } from "@mui/material";
import { settings } from "nprogress";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { WorkflowProvider } from "src/sections/workflow/context";
import WorkFlowLogsBoard from "../work-flow-logs-board";

export default function WorkflowInstanceNodesLogs() {
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Workflow Execution Board"
                links={[]}
            />
            <Box component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton sx={{ paddingLeft: '0px' }}>
                        <Iconify color='#292D32' icon="mdi:keyboard-backspace" width={24} />
                    </IconButton>
                    <Typography sx={{ fontWeight: 'normal' }} variant="h5">Work Flow Execution Flow</Typography>
                </Box>
            </Box>
            <WorkflowProvider>
                <WorkFlowLogsBoard />
            </WorkflowProvider>
        </Container>
    )
}