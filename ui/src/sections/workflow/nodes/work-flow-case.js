import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { CustomWorkflowNode, CustomWorkflowNodesPanel } from "../components";

export default function WorkflowCase({ data }) {
    const [showModal, setShowModal] = useState(false);

    const addNewNode = (newOperationNode) => {
        try{
            data.functions.handleCaseNode(data.id, newOperationNode);
            setShowModal(false);
        }catch(error){
            console.error('Error while adding new case node', error);
        }
    }
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
                    onClick={() => setShowModal(true)}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
            </Stack>
            {showModal && <CustomWorkflowNodesPanel open={showModal} onSelect={addNewNode} onClose={() => setShowModal(false)} bluePrintNode={[]} />}
        </Box>
    )
}

WorkflowCase.propTypes = {
    data: PropTypes.object,
}
