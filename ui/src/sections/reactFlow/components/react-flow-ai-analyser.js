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

const ANALYSIS_TYPE_OPTIONS = [
  { label: "News Extraction", value: "newsExtraction" },
  { label: "Risk Assessment", value: "riskAssessment" },
];

const NEWS_SOURCE_OPTIONS = [
  { label: "News API", value: "newsapi" },
  { label: "Times of India", value: "timesofindia" },
  { label: "Google News", value: "google" },
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

const validationSchema = Yup.object().shape({
  analysisType: Yup.string().required("Analysis type is required"),
  usePreviousNodeData: Yup.string().required("Please choose input mode"),

  newsQuery: Yup.string().when(["analysisType", "usePreviousNodeData"], {
    is: (analysisType, usePreviousNodeData) =>
      analysisType === "newsExtraction" && usePreviousNodeData === "false",
    then: (schema) => schema.required("Query is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newsSubjectCompany: Yup.string().when(["analysisType", "usePreviousNodeData"], {
    is: (analysisType, usePreviousNodeData) =>
      analysisType === "newsExtraction" && usePreviousNodeData === "false",
    then: (schema) => schema.required("Subject company is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newsLookbackDays: Yup.number().when("analysisType", {
    is: "newsExtraction",
    then: (schema) =>
      schema
        .typeError("Lookback days must be a number")
        .min(30, "Minimum lookback is 30 days")
        .max(730, "Maximum lookback is 730 days")
        .required("Lookback days are required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  newsNumResults: Yup.number().when("analysisType", {
    is: "newsExtraction",
    then: (schema) =>
      schema
        .typeError("Result count must be a number")
        .min(1, "Minimum is 1 article")
        .max(50, "Maximum is 50 articles")
        .required("Result count is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  newsSource: Yup.string().when("analysisType", {
    is: "newsExtraction",
    then: (schema) => schema.required("News source is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  riskCompanyId: Yup.string().when(["analysisType", "usePreviousNodeData"], {
    is: (analysisType, usePreviousNodeData) =>
      analysisType === "riskAssessment" && usePreviousNodeData === "false",
    then: (schema) => schema.required("Company ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  riskCompanyName: Yup.string().when(["analysisType", "usePreviousNodeData"], {
    is: (analysisType, usePreviousNodeData) =>
      analysisType === "riskAssessment" && usePreviousNodeData === "false",
    then: (schema) => schema.required("Company name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  checkDirectorsLitigation: Yup.string().when("analysisType", {
    is: "riskAssessment",
    then: (schema) => schema.required("Please choose litigation check behavior"),
    otherwise: (schema) => schema.notRequired(),
  }),
  checkDirectorsSanctions: Yup.string().when("analysisType", {
    is: "riskAssessment",
    then: (schema) => schema.required("Please choose sanctions check behavior"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function ReactFlowAiAnalyser({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      analysisType: data?.bluePrint?.analysisType || "newsExtraction",
      usePreviousNodeData:
        data?.bluePrint?.usePreviousNodeData !== undefined
          ? String(data.bluePrint.usePreviousNodeData)
          : "true",

      newsQuery: data?.bluePrint?.newsQuery || "",
      newsSubjectCompany: data?.bluePrint?.newsSubjectCompany || "",
      newsSubjectPersons: Array.isArray(data?.bluePrint?.newsSubjectPersons)
        ? data.bluePrint.newsSubjectPersons.join("\n")
        : data?.bluePrint?.newsSubjectPersons || "",
      newsLookbackDays: data?.bluePrint?.newsLookbackDays || 365,
      newsNumResults: data?.bluePrint?.newsNumResults || 10,
      newsSource: data?.bluePrint?.newsSource || "newsapi",

      riskCompanyId: data?.bluePrint?.riskCompanyId || "",
      riskCompanyName: data?.bluePrint?.riskCompanyName || "",
      riskCin: data?.bluePrint?.riskCin || "",
      riskDirectorNames: Array.isArray(data?.bluePrint?.riskDirectorNames)
        ? data.bluePrint.riskDirectorNames.join("\n")
        : data?.bluePrint?.riskDirectorNames || "",
      checkDirectorsLitigation:
        data?.bluePrint?.checkDirectorsLitigation !== undefined
          ? String(data.bluePrint.checkDirectorsLitigation)
          : "true",
      checkDirectorsSanctions:
        data?.bluePrint?.checkDirectorsSanctions !== undefined
          ? String(data.bluePrint.checkDirectorsSanctions)
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
      usePreviousNodeData: formData.usePreviousNodeData === "true",
      newsSubjectPersons: formData.newsSubjectPersons
        ? formData.newsSubjectPersons.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      riskDirectorNames: formData.riskDirectorNames
        ? formData.riskDirectorNames.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      newsLookbackDays: Number(formData.newsLookbackDays || 365),
      newsNumResults: Number(formData.newsNumResults || 10),
      checkDirectorsLitigation: formData.checkDirectorsLitigation === "true",
      checkDirectorsSanctions: formData.checkDirectorsSanctions === "true",
    });
    setIsOpen(false);
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.stepNumber || 1}. {data?.label}</Typography>
      <Divider />
      <Typography variant="body1">
        <b>Mode:</b>{" "}
        {ANALYSIS_TYPE_OPTIONS.find((option) => option.value === values.analysisType)?.label || "-"}
      </Typography>
      <Typography variant="body1">
        <b>Input Source:</b> {values.usePreviousNodeData === "true" ? "Previous Node Data" : "Manual"}
      </Typography>
      {values.analysisType === "newsExtraction" && (
        <>
          <Typography variant="body1"><b>Source:</b> {values.newsSource || "-"}</Typography>
          <Typography variant="body1"><b>Window:</b> {values.newsLookbackDays || 365} days</Typography>
          <Typography variant="body1"><b>Articles:</b> {values.newsNumResults || 10}</Typography>
        </>
      )}
      {values.analysisType === "riskAssessment" && (
        <>
          <Typography variant="body1"><b>Company ID:</b> {values.riskCompanyId || "Upstream / runtime"}</Typography>
          <Typography variant="body1">
            <b>Director Litigation:</b> {values.checkDirectorsLitigation === "true" ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1">
            <b>Director Sanctions:</b> {values.checkDirectorsSanctions === "true" ? "Yes" : "No"}
          </Typography>
        </>
      )}

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "210px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure AI Analyser
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
        title="Configure AI Analyser"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="analysisType"
                label="Analysis Type"
                InputProps={getInfoAdornment("Choose whether this node should run news extraction or MCP-based risk assessment.")}
              >
                {ANALYSIS_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="usePreviousNodeData"
                label="Use Previous Node Data"
                InputProps={getInfoAdornment("Use extracted values from upstream nodes when available, or enter values manually here.")}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </RHFSelect>
            </Grid>

            {values.analysisType === "newsExtraction" && (
              <>
                <Grid item xs={12}>
                  <RHFTextField
                    name="newsQuery"
                    label="Query"
                    InputProps={getInfoAdornment("Primary search query for the news pipeline. Usually the company legal name.")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="newsSubjectCompany"
                    label="Subject Company"
                    InputProps={getInfoAdornment("Company name used for adversity classification in the full news analysis MCP tool.")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="newsSubjectPersons"
                    label="Subject Persons"
                    multiline
                    minRows={3}
                    InputProps={getInfoAdornment("Optional director/owner names. Enter one name per line.")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField
                    name="newsLookbackDays"
                    label="Lookback Days"
                    type="number"
                    InputProps={getInfoAdornment("Allowed MCP range is 30 to 730 days.")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField
                    name="newsNumResults"
                    label="Article Limit"
                    type="number"
                    InputProps={getInfoAdornment("Allowed MCP range is 1 to 50 articles.")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFSelect
                    name="newsSource"
                    label="News Source"
                    InputProps={getInfoAdornment("MCP supports newsapi, timesofindia, and google for full news analysis.")}
                  >
                    {NEWS_SOURCE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
              </>
            )}

            {values.analysisType === "riskAssessment" && (
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="riskCompanyId"
                    label="Company ID"
                    InputProps={getInfoAdornment("Required by MCP run_full_background_check. Use upstream/runtime mapping if not entered manually.")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="riskCompanyName"
                    label="Company Name"
                    InputProps={getInfoAdornment("Legal company name passed to the MCP background-check orchestration tool.")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="riskCin"
                    label="CIN (Optional)"
                    InputProps={getInfoAdornment("Optional CIN. If omitted, MCP will fall back to name-based MCA search.")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="riskDirectorNames"
                    label="Director Names"
                    multiline
                    minRows={3}
                    InputProps={getInfoAdornment("Optional explicit director names. Enter one name per line.")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="checkDirectorsLitigation"
                    label="Check Directors Litigation"
                    InputProps={getInfoAdornment("Runs eCourts litigation checks for directors in the MCP background-check flow.")}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="checkDirectorsSanctions"
                    label="Check Directors Sanctions"
                    InputProps={getInfoAdornment("Runs NSE/BSE/SEBI screening for directors in the MCP background-check flow.")}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </RHFSelect>
                </Grid>
              </>
            )}
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
        processInstanceTransactionId={data?.processInstanceTransactionId}
        processInstanceId={data?.processInstanceId}
        nodeName={data?.label}
      />
    </Stack>
  );
}

ReactFlowAiAnalyser.propTypes = {
  data: PropTypes.object,
};
