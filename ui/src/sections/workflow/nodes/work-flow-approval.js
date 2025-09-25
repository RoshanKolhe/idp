import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { CustomWorkflowNode } from "../components";

export default function WorkflowApproval({ data }){
    console.log('data', data);
    return(
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
                    onClick={() => {console.log('approval node')}}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
            </Stack>
        </Box>
    )
}

WorkflowApproval.propTypes = {
    data: PropTypes.object,
}
