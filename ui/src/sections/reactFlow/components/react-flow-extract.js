import { useState } from "react";
import PropTypes from "prop-types"
import { Button, Dialog, DialogContent, DialogTitle, Grid, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import ReactFlowCustomNodeStructure from "../react-flow-custom-node"

// Model options
const modelOptions = [
  { label: "ML", value: "ml", isDisabled: true },
  { label: "Gen AI", value: "genai", isDisabled: false },
  { label: "Computer Vision", value: "computervision", isDisabled: true },
  { label: "NLP", value: "nlp", isDisabled: true },
];

export default function ReactFlowExtract({data}){
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [fields, setFields] = useState([]);
    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);
    
    return(
        <Stack sx={{marginTop: 3}} spacing={1}>
            <ReactFlowCustomNodeStructure data={data}/>
            <Typography variant='h5'>3. {data.label}</Typography>
            {selectedModel && <Typography variant='H5'>{modelOptions.find((model) => model.value === selectedModel)?.label}</Typography>}
            {selectedModel && <Typography variant="body1"><a href='#' target="_blank" rel="noopener noreferrer">{fields.length} Fields</a> to be extracted</Typography>}
            <Button
                sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                variant="outlined"
                onClick={handleOpenModal}
            >
                Add Extractor
            </Button>
            {/* Dialog */}
            <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Add Extracter</DialogTitle>
                <DialogContent dividers>
                    <Stack direction="column" spacing={2}>
                    {/* Channel Type */}
                    <div>
                        <Typography variant="h6">Extracter Model</Typography>
                        <Select
                        fullWidth
                        value={selectedModel}
                        onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setFields((prev) => [...prev, {prompt : '', variable: ''}]);
                        }}
                        displayEmpty
                        >
                        <MenuItem value="">
                            <em>Select Model</em>
                        </MenuItem>
                        {modelOptions.length > 0 ? (
                            modelOptions.map((model) => (
                            <MenuItem
                                key={model?.value}
                                value={model?.value}
                                disabled={model?.isDisabled}
                            >
                                {model?.label}
                            </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled value="">
                            No models found
                            </MenuItem>
                        )}
                        </Select>
                    </div>

                    <Stack direction='column' spacing={1}>
                        {fields.length > 0 && fields.map((field, index) => (
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
                                <Typography variant="h6">What do you want to extract?</Typography> 
                                <TextField fullWidth defaultValue='Enter the prompt' value={field.prompt} onChange={(e) => {
                                    setFields((prev) => prev.map((oldField, i) => {
                                        if(i === index){
                                            return {
                                                ...oldField,
                                                prompt : e.target.value
                                            }
                                        }
                                        return oldField;
                                    }))
                                }} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                <Typography variant="h6">Which variable?</Typography> 
                                <TextField defaultValue='Enter Variable' fullWidth value={field.variable} onChange={(e) => {
                                    setFields((prev) => prev.map((oldField, i) => {
                                        if(i === index){
                                            return {
                                                ...oldField,
                                                variable : e.target.value
                                            }
                                        }
                                        return oldField;
                                    }))
                                }} />
                                </Grid>
                            </Grid>
                        ))}
                    </Stack>
        
                    {/* Add Button */}
                    {selectedModel !== '' && <Button
                        sx={{backgroundColor: 'black', '&:hover':{backgroundColor : 'black'}}}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setFields((prev) => [...prev, {prompt : '', variable: ''}])
                        }}
                    >
                        Add Field
                    </Button>}
                    <Button
                        sx={{backgroundColor: 'black', '&:hover':{backgroundColor : 'black'}}}
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                    >
                        Submit
                    </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}

ReactFlowExtract.propTypes = {
    data : PropTypes.object
}