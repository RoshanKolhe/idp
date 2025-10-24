import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Stack,
  Typography,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";

function generateId() {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const timePart = Date.now().toString(36);
  return `wh_${timePart}_${randomPart}`;
}

export default function WorkFlowWebhookTrigger({ data }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // ✅ Validation Schema
  const webhookSchema = Yup.object().shape({
    webhookId: Yup.string().required("webhook id required"),
    responseStatus: Yup.number().required("Success status code is required"),
    requestBody: Yup.string().required("Request body is required"),
    isAdvancedOptions: Yup.boolean().required("Advance options field is required"),
    customHeaders: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.string().required("Key is required"),
          value: Yup.string().required("Value is required"),
        })
      )
      .when("isAdvancedOptions", {
        is: true,
        then: (schema) => schema.min(1, "At least one header is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  // ✅ Default Values
  const defaultValues = useMemo(
    () => ({
      webhookId: data?.bluePrint?.webhookId || generateId(),
      responseStatus: data.bluePrint?.responseStatus || "",
      requestBody: data.bluePrint?.requestBody || "",
      isAdvancedOptions: data.bluePrint?.isAdvancedOptions || false,
      customHeaders: data.bluePrint?.customHeaders || [],
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(webhookSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customHeaders",
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("Webhook Form Data:", formData);
      data.functions.handleBluePrintComponent(data.label, data.id, { ...formData });
      handleClose();
    } catch (error) {
      console.error("Error while submitting webhook node form", error);
    }
  });

  useEffect(() => {
    if (data && data.bluePrint) {
      reset(defaultValues);
    }
  }, [data, defaultValues, reset]);

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">
        <Box
          component="div"
          onClick={() => {
            setOpen(true);
          }}
          sx={{ cursor: "pointer" }}
        >
          <CustomWorkflowNode data={data} />
        </Box>
        <CustomWorkflowDialogue
          isOpen={open}
          handleCloseModal={handleClose}
          title="Webhook"
          color={data.bgColor}
        >
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* ✅ Response Status */}
              <Grid item xs={12}>
                <RHFTextField
                  name="responseStatus"
                  label="Response Status Code"
                  placeholder="e.g. 200"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Enter the HTTP status code that indicates a successful webhook response
                  (e.g., <strong>200</strong> for OK, <strong>201</strong> for Created,
                  <strong>202</strong> for Accepted).
                </Typography>
              </Grid>

              {/* ✅ Request Body */}
              <Grid item xs={12}>
                <RHFTextField
                  name="requestBody"
                  label="Request Body"
                  multiline
                  minRows={3}
                  placeholder={`{
  "userId": "12345",
  "action": "create",
  "timestamp": "2025-10-10T12:00:00Z"
}`}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Provide the JSON structure that your webhook should send. Use valid JSON
                  format. You can include dynamic values using placeholders like
                  <code> {"{userId}"} </code> or <code> {"{timestamp}"} </code>.
                </Typography>
              </Grid>

              {/* 🔘 Advanced Options */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1">Advanced Options</Typography>
                  <RHFSwitch name="isAdvancedOptions" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Enable this option to include custom headers (e.g., Authorization tokens or
                  Content-Type) in your webhook requests.
                </Typography>
              </Grid>

              {/* 🧩 Custom Headers Section */}
              {values.isAdvancedOptions && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Custom Headers
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Headers are additional key-value pairs sent with the request.
                    Example: <strong>Key:</strong> Authorization, <strong>Value:</strong> Bearer abc123
                  </Alert>

                  <Stack spacing={2}>
                    {fields.map((item, index) => (
                      <Grid
                        container
                        spacing={1}
                        key={item.id}
                        alignItems="center"
                      >
                        <Grid item xs={5}>
                          <RHFTextField
                            name={`customHeaders[${index}].key`}
                            label="Key"
                            placeholder="e.g. Authorization"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <RHFTextField
                            name={`customHeaders[${index}].value`}
                            label="Value"
                            placeholder="e.g. Bearer token123"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton color="error" onClick={() => remove(index)}>
                            <Iconify icon="mdi:minus-circle-outline" width={22} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}

                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        color="primary"
                        onClick={() => append({ key: "", value: "" })}
                      >
                        <Iconify icon="mdi:plus-circle-outline" width={24} />
                      </IconButton>
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>

            {/* ✅ Save Button */}
            {!data?.isProcessInstance && (
              <Stack
                alignItems="flex-end"
                sx={{ mt: 3, display: "flex", gap: "10px" }}
              >
                <LoadingButton
                  sx={{
                    backgroundColor: data.bgColor,
                    borderColor: data.borderColor,
                  }}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save
                </LoadingButton>
              </Stack>
            )}
          </FormProvider>
        </CustomWorkflowDialogue>
      </Stack>
    </Box>
  );
}

WorkFlowWebhookTrigger.propTypes = {
  data: PropTypes.object,
};
