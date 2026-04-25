import { Box, Container, IconButton, Typography } from "@mui/material";
import { settings } from "nprogress";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { WorkflowProvider } from "src/sections/workflow/context";
import { paths } from "src/routes/paths";
import { useParams, useRouter } from "src/routes/hook";
import { useGetWorkflowInstance } from "src/api/workflow-instance";
import WorkFlowLogsBoard from "../work-flow-logs-board";

export default function WorkflowInstanceNodesLogs() {
    const router = useRouter();
    const params = useParams();
    const { instanceId } = params;
    const { workflowInstance: currentWorkflowInstance } = useGetWorkflowInstance(instanceId);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Workflow Execution Board"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Workflow Instance', href: paths.dashboard.workflowInstance.list },
                    currentWorkflowInstance?.workflow?.name && { name: currentWorkflowInstance.workflow.name },
                    currentWorkflowInstance?.workflowInstanceName && { name: currentWorkflowInstance.workflowInstanceName },
                ].filter(Boolean)}
            />
            <Box component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton onClick={() => router.back()} sx={{ paddingLeft: '0px' }}>
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
