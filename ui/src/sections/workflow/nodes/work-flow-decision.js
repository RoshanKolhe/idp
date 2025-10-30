import PropTypes from "prop-types";
import { Box, Button, Stack } from "@mui/material";
import { CustomWorkflowNode } from "../components";

// ----------------------------------------------------------------------------------------------------------
export default function WorkflowDecision({ data }){
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
                    onClick={() => {data.functions.handleAddNewDecisionCase(data.id)}}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>

                <Button onClick={() => {data.functions.handleAddNewDecisionCase(data.id)}} variant="contained">Add case</Button>
            </Stack>
        </Box>
    )
}

WorkflowDecision.propTypes = {
    data: PropTypes.object,
}
