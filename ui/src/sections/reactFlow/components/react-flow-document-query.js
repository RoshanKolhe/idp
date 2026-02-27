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

const QUERY_MODE_OPTIONS = [
  { label: "Standard Query", value: "query_documents" },
  { label: "Hybrid Query", value: "query_documents_hybrid" },
  { label: "Graph Query", value: "query_documents_graph" },
  { label: "Query By TOC", value: "query_documents_by_toc" },
  { label: "Query Collection", value: "query_collection" },
];

const getInfoAdornment = (title) => ({
  endAdornment: (
    <InputAdornment sx={{mr:3}} position="end">
      <Tooltip title={title}>
        <IconButton edge="end">
          <Iconify icon="mdi:information-outline" fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  ),
});

export default function ReactFlowDocumentQuery({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    queryMode: Yup.string().required("Query mode is required"),
    queryText: Yup.string().required("Query text is required"),
  });

  const defaultValues = useMemo(
    () => ({
      queryMode: data?.bluePrint?.queryMode || "query_documents",
      queryText: data?.bluePrint?.queryText || "",
      topK: data?.bluePrint?.topK || 5,
      useGraph:
        data?.bluePrint?.useGraph !== undefined
          ? String(data.bluePrint.useGraph)
          : "true",
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
      topK: Number(formData.topK || 5),
      useGraph: formData.useGraph === "true",
    });
    setIsOpen(false);
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.stepNumber || 5}. {data?.label}</Typography>
      <Divider />
      <Typography variant="body1">
        <b>Mode:</b>{" "}
        {QUERY_MODE_OPTIONS.find((opt) => opt.value === values.queryMode)?.label || "-"}
      </Typography>
      {/* <Typography variant="body1"><b>Collection ID:</b> Auto-generated at runtime</Typography> */}
      <Typography variant="body1"><b>Top K:</b> {values.topK || 5}</Typography>
      <Typography variant="body1"><b>Use Graph:</b> {values.useGraph === "true" ? "Yes" : "No"}</Typography>

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure Query
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
        title="Configure Document Query"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RHFSelect
                name="queryMode"
                label="Query Mode"
                InputProps={getInfoAdornment("Select which MCP query strategy this node should use.")}
              >
                {QUERY_MODE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="queryText"
                label="Query"
                multiline
                minRows={3}
                InputProps={getInfoAdornment("The natural-language prompt that will be sent for document retrieval.")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField
                name="topK"
                label="Top K"
                type="number"
                InputProps={getInfoAdornment("Maximum number of retrieved results/sections to return.")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFSelect
                name="useGraph"
                label="Use Graph"
                InputProps={getInfoAdornment("Enable graph relationships when supported by selected query mode.")}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </RHFSelect>
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

ReactFlowDocumentQuery.propTypes = {
  data: PropTypes.object,
};
