import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
  Input,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Radio,
} from "@mui/material";
import { useGetDocumentTypes } from "src/api/documentType";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";

// Model options
const modelOptions = [
  { label: "ML", value: "ml", isDisabled: true },
  { label: "Gen AI", value: "genai", isDisabled: false },
  { label: "Computer Vision", value: "computervision", isDisabled: true },
  { label: "NLP", value: "nlp", isDisabled: true },
];

export default function ReactFlowClassify({ data }) {
  const [selectedModel, setSelectedModel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [documentTypesData, setDocumentTypesData] = useState([]);
  const [classificationArray, setClassificationArray] = useState([
    {
      id: 1,
      docType: "",
      sampleDoc: null,
    },
  ]);

  const { documentTypes, documentTypesEmpty } = useGetDocumentTypes();

  useEffect(() => {
    if (documentTypes && !documentTypesEmpty) {
      setDocumentTypesData(documentTypes);
    }
  }, [documentTypes, documentTypesEmpty]);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleDocTypeChange = (e) => {
    const updated = [...classificationArray];
    updated[0].docType = e.target.value;
    setClassificationArray(updated);
  };

  const handleSampleDocChange = (e) => {
    const file = e.target.files[0];
    const updated = [...classificationArray];
    updated[0].sampleDoc = file;
    setClassificationArray(updated);
  };

  const handleAddCategory = () => {
    console.log("Final Classification:", classificationArray[0]);
    handleCloseModal();
  };

  return (
    <Stack sx={{ marginTop: 3, zIndex: 100000 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">2. {data.label}</Typography>

      {/* Model Selection */}
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">Model</Typography>
        <Select
          variant="standard"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          displayEmpty
          MenuProps={{
            PaperProps: {
            style: {
                zIndex: 1302000,
            },
            },
            disablePortal: false,
         }}
        >
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
        <FormControl component="fieldset">
            <RadioGroup
                aria-label="model"
                name="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
            >
                {modelOptions.map((model) => (
                <FormControlLabel
                    key={model.value}
                    value={model.value}
                    control={<Radio />}
                    label={model.label}
                    disabled={model.isDisabled}
                />
                ))}
            </RadioGroup>
        </FormControl>
      </Stack>

      {/* Classification Section */}
      <Typography variant="h6">Target Classification</Typography>
      {classificationArray?.length > 0 && classificationArray.map((item) => {
        if(item && item.docType !== '' && item.sampleDoc){
            const fileURL = URL.createObjectURL(item.sampleDoc);
            return(
                <>
                    <Typography sx={{fontWeight: 'bold'}} variant="body1">{item.docType}</Typography>
                    <Typography variant="body1"><a href={fileURL} target="_blank" rel="noopener noreferrer">Click Here</a> for sample doc</Typography>
                </>
            )
        }
        return null;
      })}
      <Button
        sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
        onClick={handleOpenModal}
        variant="outlined"
      >
        Add Category
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent dividers>
          <Stack direction="column" spacing={2}>
            {/* Channel Type */}
            <div>
              <Typography variant="h6">Document Type</Typography>
              <Select
                fullWidth
                value={classificationArray[0].docType}
                onChange={handleDocTypeChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select document type</em>
                </MenuItem>
                {documentTypesData.length > 0 ? (
                  documentTypesData.map((docType) => (
                    <MenuItem
                      key={docType?.id}
                      value={docType?.documentType}
                    >
                      {docType?.documentType}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No document types found
                  </MenuItem>
                )}
              </Select>
            </div>

            {/* Sample Doc Upload */}
            <div>
              <Typography variant="h6">Sample Document</Typography>
              <Input type="file" onChange={handleSampleDocChange} />
            </div>

            {/* Add Button */}
            <Button
              sx={{backgroundColor: 'black', '&:hover':{backgroundColor : 'black'}}}
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
            >
              Add
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

ReactFlowClassify.propTypes = {
  data: PropTypes.object,
};
