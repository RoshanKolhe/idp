import { useState } from "react"
import PropTypes from "prop-types"
import { Button, MenuItem, Select, Stack, Typography } from "@mui/material"
import ReactFlowCustomNodeStructure from "../react-flow-custom-node"

// Model options
const modelOptions = [
    {label: 'ML', value: 'ml', isDisabled: true},
    {label: 'Gen AI', value: 'genai', isDisabled: false},
    {label: 'Computer Vision', value: 'computervision', isDisabled: true},
    {label: 'NLP', value: 'nlp', isDisabled: true},
]

export default function ReactFlowClassify({data}){
    const [selectedModel, setSelectedModel] = useState('');
    return(
        <Stack sx={{marginTop: 3}} spacing={1}>
            <ReactFlowCustomNodeStructure data={data}/>
            <Typography variant='h5'>2. {data.label}</Typography>
            <Stack direction="column" spacing={1}>
                <Typography variant="h6">Model</Typography>
                <Select
                    variant="standard"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    displayEmpty
                >
                    {/* ✅ Add placeholder as an actual option */}
                    <MenuItem value="">
                        <em>Select a model</em>
                    </MenuItem>

                    {modelOptions.map((model) => (
                        <MenuItem
                            key={model.value}
                            value={model.value}
                            disabled={model.isDisabled}
                        >
                            {model.label}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Typography variant="h6">Target Classification</Typography>
            <Button sx={{width: '200px', color: 'royalBlue', borderColor: 'royalBlue'}} variant='outlined' >Add Category</Button>
        </Stack>
    )
}

ReactFlowClassify.propTypes = {
    data : PropTypes.object
}