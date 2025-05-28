import PropTypes from "prop-types"
import { Button, Stack, Typography } from "@mui/material"
import ReactFlowCustomNodeStructure from "../react-flow-custom-node"

export default function ReactFlowExtract({data}){
    return(
        <Stack sx={{marginTop: 3}} spacing={1}>
            <ReactFlowCustomNodeStructure data={data}/>
            <Typography variant='h5'>3. {data.label}</Typography>
            <Button
                sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                variant="outlined"
            >
                Add Extractor
            </Button>
        </Stack>
    )
}

ReactFlowExtract.propTypes = {
    data : PropTypes.object
}