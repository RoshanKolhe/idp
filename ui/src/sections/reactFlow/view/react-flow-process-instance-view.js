import { settings } from "nprogress";
import { Box, Container, IconButton, Typography } from "@mui/material";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useParams } from "src/routes/hook";
import Iconify from "src/components/iconify";
import { useGetProcessInstance } from "src/api/process-instance";
import ReactFlowProcessInstanceBoard from "../react-flow-process-instance-board";

export default function ReactFlowProcessInstanceView() {
    const params = useParams();
    const { id } = params;
    const { processInstance: currentProcessInstance } = useGetProcessInstance(id);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Box component='div' sx={{ display: 'flex', alignItems: 'start', gap: '10px', width: '100%' }}>
                <CustomBreadcrumbs
                    heading="Intelligent Document Processing"
                    links={[
                        { name: currentProcessInstance?.processes?.name },
                        { name: currentProcessInstance?.processInstanceName }
                    ]}
                />

                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton sx={{ paddingLeft: '0px' }}>
                        <Iconify color='#292D32' icon="mdi:keyboard-backspace" width={24} />
                    </IconButton>
                </Box>
            </Box>

            <ReactFlowProcessInstanceBoard currentProcessInstance={currentProcessInstance} isUnlock={false} />
        </Container>
    )
}