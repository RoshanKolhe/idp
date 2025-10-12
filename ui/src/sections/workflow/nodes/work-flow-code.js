import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { CustomWorkflowNode } from "../components";

export default function WorkFlowCode({data}) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <Box
            component='div'
        >
            <Stack
                spacing={1}
                direction='column'
                alignItems='center'
            >
                <Box
                    component='div'
                    onClick={() => { setOpen(true) }}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
            </Stack>
        </Box>
    )
}

WorkFlowCode.propTypes = {
    data: PropTypes.object
}