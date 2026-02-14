import { Box, Stack, Typography } from "@mui/material"
import PropTypes from "prop-types"
import ReactFlowCustomRouterNodeStructure from "../react-flow-custom-router-node";

export default function ReactFlowRouter({ data }) {
    const handleClick = () => {
        data?.functions?.handleRouterNode?.(data?.id);
    };

    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <Box
                component='div'
                sx={{
                    cursor: 'pointer'
                }}
                onClick={() => handleClick()}
            >
                <ReactFlowCustomRouterNodeStructure data={data} />
            </Box>
            <Typography variant='h5'>{data.label}</Typography>
        </ Stack>
    )
}

ReactFlowRouter.propTypes = {
    data: PropTypes.object
}