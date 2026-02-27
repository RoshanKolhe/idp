import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

const INDEX_MODE_OPTIONS = [
  { label: "Process Documents", value: "process_documents" },
  { label: "Index Enriched Data", value: "index_enriched_data" },
];

const getInfoAdornment = (title) => ({
  endAdornment: (
    <InputAdornment sx={{ mr: 3 }} position="end">
      <Tooltip title={title}>
        <IconButton edge="end">
          <Iconify icon="mdi:information-outline" fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  ),
});

export default function ReactFlowDocumentIndex({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    indexMode: Yup.string().required("Index mode is required"),
    documentType: Yup.string().required("Document type is required"),
    isContract: Yup.string().required("Contract flag is required"),
  });

  const defaultValues = useMemo(
    () => ({
      indexMode: data?.bluePrint?.indexMode || "process_documents",
      documentType: data?.bluePrint?.documentType || "digital",
      isContract:
        data?.bluePrint?.isContract !== undefined
          ? String(data.bluePrint.isContract)
          : "false",
      notes: data?.bluePrint?.notes || "",
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    data?.functions?.handleBluePrintComponent(data?.label, {
      ...formData,
      isContract: formData.isContract === "true",
    });
    setIsOpen(false);
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.stepNumber || 4}. {data?.label}</Typography>
      <Divider />
      <Typography variant="body1">
        <b>Mode:</b>{" "}
        {INDEX_MODE_OPTIONS.find((opt) => opt.value === values.indexMode)?.label || "-"}
      </Typography>
      { /* <Typography variant="body1"><b>Collection ID:</b> Auto-generated at runtime</Typography> */}
      <Typography variant="body1"><b>Document Type:</b> {values.documentType || "-"}</Typography>
      <Typography variant="body1">
        <b>Contract:</b> {values.isContract === "true" ? "Yes" : "No"}
      </Typography>

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "210px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure Indexing
        </Button>
      )}

      {data?.isProcessInstance === true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setLogsOpen(true)}
        >
          View Logs
        </Button>
      )}

      <CustomProcessDialogue
        title="Configure Document Index"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="indexMode"
                label="Index Mode"
                InputProps={getInfoAdornment("Choose how this node will index documents in MCP.")}
              >
                {INDEX_MODE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="documentType"
                label="Document Type"
                InputProps={getInfoAdornment("Set to OCR for scanned/image-based documents, otherwise use Digital.")}
              >
                <MenuItem value="digital">Digital</MenuItem>
                <MenuItem value="ocr">OCR</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="isContract"
                label="Is Contract"
                InputProps={getInfoAdornment("Enable this only when documents should use contract-specific processing.")}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="notes"
                label="Notes (Optional)"
                multiline
                minRows={2}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Optional implementation notes for this node configuration.">
                        <IconButton edge="end">
                          <Iconify icon="mdi:information-outline" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained">
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CustomProcessDialogue>

      <LogsProcessDialogue
        isOpen={logsOpen}
        handleCloseModal={() => setLogsOpen(false)}
        processInstanceId={data?.processInstanceId}
        nodeName={data?.label}
      />
    </Stack>
  );
}

ReactFlowDocumentIndex.propTypes = {
  data: PropTypes.object,
};
