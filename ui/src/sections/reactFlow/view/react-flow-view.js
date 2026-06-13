import { useParams } from "react-router";
import { settings } from "nprogress";
import { Box, Container, IconButton } from "@mui/material";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { useRouter } from "src/routes/hook";
import { useGetProcess } from "src/api/processes";
import { paths } from "src/routes/paths";
import ReactFlowBoard from "../react-flow-board";

export default function ReactFlowView() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { processes: currentProcess } = useGetProcess(id);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Box component='div' sx={{ display: 'flex', alignItems: 'start', gap: '10px', width: '100%' }}>
                <IconButton onClick={() => router.back()} sx={{ paddingLeft: '0px' }}>
                    <Iconify color='#292D32' icon="mdi:keyboard-backspace" width={24} />
                </IconButton>
                <CustomBreadcrumbs
                    heading="Intelligent Document Processing"
                    links={[
                        {
                            name: 'Dashboard',
                            href: paths.dashboard.root,
                        },
                        {
                            name: 'Processes',
                            href: paths.dashboard.processes.list,
                        },
                        { name: currentProcess?.name },
                    ]}
                // sx={{
                // mb: { xs: 1, md: 1 },
                // }}
                />
            </Box>

            <ReactFlowBoard />
        </Container>
    )
}