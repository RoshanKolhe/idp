import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
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
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

const METHOD_OPTIONS = [
  { label: "GET", value: 1, description: "Retrieve data from API." },
  { label: "POST", value: 2, description: "Create resource via API." },
  { label: "PUT", value: 3, description: "Replace resource via API." },
  { label: "PATCH", value: 4, description: "Partially update resource via API." },
  { label: "DELETE", value: 5, description: "Delete resource via API." },
];

const BODY_TYPE_OPTIONS = [
  { label: "Raw", value: 1, description: "Send body as raw text or JSON." },
  { label: "x-www-form-urlencoded", value: 2, description: "Send body as key-value form fields." },
];

const CONTENT_TYPE_OPTIONS = [
  { label: "application/json", value: 1 },
  { label: "text/plain", value: 2 },
];

const fieldsSchema = Yup.array().of(
  Yup.object().shape({
    key: Yup.string().required("Key is required"),
    value: Yup.string().required("Value is required"),
  })
);

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .required("URL is required")
    .test("valid-url", "Invalid URL", (value) => /^(https?:\/\/)/i.test(value || "")),
  method: Yup.number().required("Method is required"),
  headers: fieldsSchema.default([]),
  queryStrings: fieldsSchema.default([]),
  paramsValue: fieldsSchema.default([]),
  bodyType: Yup.number().when("method", {
    is: (method) => [2, 3, 4].includes(Number(method)),
    then: (schema) => schema.oneOf([1, 2]).required("Body type is required for this method"),
    otherwise: (schema) => schema.notRequired(),
  }),
  contentType: Yup.number().when("bodyType", {
    is: 1,
    then: (schema) => schema.oneOf([1, 2]).required("Content type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  requestContent: Yup.string().when("bodyType", {
    is: 1,
    then: (schema) => schema.required("Request body is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  urlEncodedFields: fieldsSchema.when("bodyType", {
    is: 2,
    then: (schema) => schema.min(1, "At least one field is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const getInfoAdornment = (title) => ({
  endAdornment: (
    <InputAdornment sx={{mr: 3}} position="end">
      <Tooltip title={title}>
        <IconButton edge="end">
          <Iconify icon="mdi:information-outline" fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  ),
});

function KeyValueEditor({ fieldName }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: fieldName });

  return (
    <Stack spacing={1}>
      {fields.map((field, index) => (
        <Grid container spacing={1} key={field.id} alignItems="center">
          <Grid item xs={5}>
            <RHFTextField name={`${fieldName}.${index}.key`} label="Key" />
          </Grid>
          <Grid item xs={5}>
            <RHFTextField name={`${fieldName}.${index}.value`} label="Value" />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="error" onClick={() => remove(index)}>
              <Iconify icon="mdi:minus-circle-outline" width={22} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Stack alignItems="flex-end">
        <IconButton color="primary" onClick={() => append({ key: "", value: "" })}>
          <Iconify icon="mdi:plus-circle-outline" width={24} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

KeyValueEditor.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default function ReactFlowIntegration({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      url: data?.bluePrint?.url || "",
      method: data?.bluePrint?.method || 1,
      headers: data?.bluePrint?.headers || [],
      queryStrings: data?.bluePrint?.queryStrings || [],
      paramsValue: data?.bluePrint?.paramsValue || [],
      bodyType: data?.bluePrint?.bodyType || undefined,
      contentType: data?.bluePrint?.contentType || undefined,
      requestContent: data?.bluePrint?.requestContent || "",
      urlEncodedFields: data?.bluePrint?.urlEncodedFields || [],
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    data?.functions?.handleBluePrintComponent(data?.label, { ...formData });
    setIsOpen(false);
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.stepNumber || 6}. {data?.label}</Typography>
      <Divider />
      <Typography variant="body1"><b>Method:</b> {METHOD_OPTIONS.find((m) => m.value === Number(values.method))?.label || "-"}</Typography>
      <Typography variant="body1"><b>URL:</b> {values.url || "-"}</Typography>

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "220px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure Integration
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
        title="Configure Integration API"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RHFTextField
                name="url"
                label="URL"
                InputProps={getInfoAdornment("Absolute API URL to call from this node.")}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFSelect
                name="method"
                label="Method"
                InputProps={
                  getInfoAdornment(METHOD_OPTIONS.find((m) => m.value === Number(values.method))?.description || "HTTP method")}
              >
                {METHOD_OPTIONS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">Headers</Typography>
              <KeyValueEditor fieldName="headers" />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">Query Strings</Typography>
              <KeyValueEditor fieldName="queryStrings" />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">Path Params</Typography>
              <KeyValueEditor fieldName="paramsValue" />
            </Grid>

            {[2, 3, 4].includes(Number(values.method)) && (
              <Grid item xs={12}>
                <RHFSelect
                  name="bodyType"
                  label="Body Type"
                  InputProps={getInfoAdornment(BODY_TYPE_OPTIONS.find((b) => b.value === Number(values.bodyType))?.description || "Select request body format")}
                >
                  {BODY_TYPE_OPTIONS.map((bodyType) => (
                    <MenuItem key={bodyType.value} value={bodyType.value}>{bodyType.label}</MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            )}

            {Number(values.bodyType) === 1 && (
              <>
                <Grid item xs={12}>
                  <RHFSelect name="contentType" label="Content Type">
                    {CONTENT_TYPE_OPTIONS.map((contentType) => (
                      <MenuItem key={contentType.value} value={contentType.value}>{contentType.label}</MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="requestContent" label="Request Body" multiline minRows={3} />
                </Grid>
              </>
            )}

            {Number(values.bodyType) === 2 && (
              <Grid item xs={12}>
                <Typography variant="body1">Body Fields</Typography>
                <KeyValueEditor fieldName="urlEncodedFields" />
              </Grid>
            )}
          </Grid>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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

ReactFlowIntegration.propTypes = {
  data: PropTypes.object,
};
