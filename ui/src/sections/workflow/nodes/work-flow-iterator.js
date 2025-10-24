import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";

export default function WorkFlowIterator({ data }) {
  const [open, setOpen] = useState(false);
  const [variablesData, setVariablesData] = useState([]);

  const handleClose = () => {
    console.log("Closing modal");
    setOpen(false);
  };

  // ✅ Validation Schema
  const iteratorValidationSchema = Yup.object().shape({
    isMapped: Yup.boolean().required("Mode selection is required"),

    variable: Yup.mixed().when("isMapped", {
      is: true,
      then: () =>
        Yup.object().shape({
          variableName: Yup.string().required("Variable name is required"),
          variableValue: Yup.string().required("Variable value is required"),
        }),
      otherwise: () => Yup.mixed().notRequired(),
    }),

    array: Yup.mixed().when("isMapped", {
      is: false,
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              item: Yup.string().required("Item name is required"),
              value: Yup.string().required("Item value is required"),
            })
          )
          .min(1, "At least one item is required"),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  });

  // ✅ Default values based on existing blueprint
  const defaultValues = useMemo(
    () => ({
      isMapped: data?.bluePrint?.isMapped || false,
      array: data?.bluePrint?.array || [],
      variable: data?.bluePrint?.variable || null,
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(iteratorValidationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    name: "array",
    control,
  });

  // ✅ Form Submit Handler
  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("Iterator Form Data:", formData);
      data.functions.handleBluePrintComponent(data.label, data.id, {
        ...formData,
      });
      handleClose();
    } catch (error) {
      console.error("Error while submitting data for Iterator node", error);
    }
  });

  useEffect(() => {
    if (data) {
      reset(defaultValues);
      if (data.variables && data.variables.length > 0) {
        setVariablesData(data.variables);
      }
    }
  }, [data, reset, defaultValues]);

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">
        {/* ✅ Clickable Node Box */}
        <Box component="div" onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
          <CustomWorkflowNode data={data} />
        </Box>

        {/* ✅ Main Modal / Dialog */}
        <CustomWorkflowDialogue
          isOpen={open}
          handleCloseModal={handleClose}
          title="Iterator Configuration"
          color={data.bgColor}
        >
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* ✅ Mode Switch */}
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Controller
                  name="isMapped"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={
                        field.value
                          ? "Variable Mode (Use Existing Variable)"
                          : "Array Mode (Define Custom List)"
                      }
                    />
                  )}
                />
              </Grid>

              {/* ✅ Variable Mode */}
              {values.isMapped === true && (
                <Grid item xs={12}>
                  <RHFAutocomplete
                    name="variable"
                    label="Select Variable"
                    options={variablesData || []}
                    getOptionLabel={(option) => option?.variableName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.variableValue === value.variableValue
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment sx={{ mr: 3 }} position="end">
                          <Tooltip title="Select a variable to dynamically map iteration values.">
                            <IconButton edge="end">
                              <Iconify icon="mdi:information-outline" fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {option.variableName}
                        </Typography>
                      </li>
                    )}
                  />
                </Grid>
              )}

              {/* ✅ Array Mode */}
              {!values.isMapped && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold">
                      Create Custom Array
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Define a list of items and their corresponding values for iteration.
                    </Typography>
                  </Grid>

                  {fields.map((field, index) => (
                    <Grid container item xs={12} spacing={2} key={field.id}>
                      <Grid item xs={12} md={5}>
                        <RHFTextField
                          name={`array[${index}].item`}
                          label="Item Name"
                          placeholder="e.g. Product ID"
                        />
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <RHFTextField
                          name={`array[${index}].value`}
                          label="Item Value"
                          placeholder="e.g. 12345"
                        />
                      </Grid>

                      <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip title="Remove this item">
                          <IconButton color="error" onClick={() => remove(index)}>
                            <Iconify icon="mdi:minus-circle-outline" width={22} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}

                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="Add new item to array">
                      <IconButton
                        color="primary"
                        onClick={() => append({ item: "", value: "" })}
                      >
                        <Iconify icon="mdi:plus-circle-outline" width={24} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </>
              )}
            </Grid>

            {/* ✅ Save Button */}
            {!data?.isProcessInstance && (
              <Stack alignItems="flex-end" sx={{ mt: 3, gap: 1 }}>
                <LoadingButton
                  sx={{
                    backgroundColor: data.bgColor,
                    borderColor: data.borderColor,
                    "&:hover": { opacity: 0.9 },
                  }}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save Iterator Configuration
                </LoadingButton>
              </Stack>
            )}
          </FormProvider>
        </CustomWorkflowDialogue>
      </Stack>
    </Box>
  );
}

WorkFlowIterator.propTypes = {
  data: PropTypes.object,
};
