import { Box, Container, IconButton, Typography } from "@mui/material";
import { settings } from "nprogress";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import WorkFlowBoard from "../work-flow-board";

export default function WorkFlowBoardView() {
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Workflow Board"
                links={[]}
            />
            <Box component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton sx={{ paddingLeft: '0px' }}>
                        <Iconify color='#292D32' icon="mdi:keyboard-backspace" width={24} />
                    </IconButton>
                    <Typography sx={{ fontWeight: 'normal' }} variant="h5">Define Work Flow</Typography>
                </Box>
            </Box>
            <WorkFlowBoard />
        </Container>
    )
}