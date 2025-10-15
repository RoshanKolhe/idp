import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
    Box,
    Stack,
    Grid,
    Typography,
    IconButton,
    Divider,
    Alert,
    Chip,
    Autocomplete,
    TextField,
    MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import { useGetProcesses } from "src/api/processes";
import Iconify from "src/components/iconify";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";

/**
 * 🧩 Variable Node with Dynamic Chip Display
 * Allows defining static or dynamic workflow variables.
 */
export default function WorkFlowSetVariable({ data }) {
    const [open, setOpen] = useState(false);
    const [processesData, setProcessesData] = useState([]);
    const { processess, processessEmpty } = useGetProcesses();
    const handleClose = () => setOpen(false);

    // ✅ Validation Schema
    const variableValidationSchema = Yup.object().shape({
        isProcessesConnected: Yup.boolean().required('Please select value'),
        processes: Yup.array()
            .of(Yup.object().required("Process is required"))
            .when("isProcessesConnected", {
                is: true,
                then: (schema) => schema.min(1, "At least one process is required when connected"),
                otherwise: (schema) => schema.notRequired(),
            }),
        variables: Yup.array()
            .of(
                Yup.object().shape({
                    variableName: Yup.string().required("Variable name is required"),
                    variableValue: Yup.string().required("Variable value is required"),
                })
            )
            .min(1, "At least one variable must be defined"),
    });

    // ✅ Default Values
    const defaultValues = useMemo(
        () => ({
            isProcessesConnected: data.bluePrint?.isProcessesConnected || false,
            processess: [],
            variables: data.bluePrint?.variables || [
                { variableName: "", variableValue: "" },
            ],
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(variableValidationSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variables",
    });

    const values = watch();

    // ✅ Detect if a value is dynamic
    const isDynamicValue = (value = "") => {
        const match = value.match(/^{{(.*?)}}$/);
        return match ? match[1] : null; // returns variable name if found
    };

    // ✅ Form Submit Handler
    const onSubmit = handleSubmit(async (formData) => {
        try {
            console.log("Variable Node Data:", formData);
            data.functions.handleBluePrintComponent(data.label, data.id, {
                ...formData,
            });
            handleClose();
        } catch (error) {
            console.error("Error while submitting variable node form", error);
        }
    });

    useEffect(() => {
        if (processess && !processessEmpty) {
            setProcessesData(processess);
        }
    }, [processess, processessEmpty]);

    useEffect(() => {
        if (data) {
            reset(defaultValues);

            if (data.bluePrint?.isProcessesConnected && data.bluePrint?.processes && processesData) {
                const oldProcesses = data.bluePrint?.processes || [];
                const newProcesses = processesData.filter((process) => process.id === oldProcesses?.some((processId) => processId)) || [];
                setValue('processes', newProcesses, { shouldValidate: true });
            }
        }
    }, [data, defaultValues, reset, setValue, processesData]);

    useEffect(() => {
        if (values.isProcessesConnected && values.processes?.length > 0) {
            const sampleVariables = [
                { variableName: "processName", variableValue: "{{processName}}" },
                { variableName: "status", variableValue: "{{status}}" },
                { variableName: "createdBy", variableValue: "{{createdBy}}" },
                { variableName: "lastUpdated", variableValue: "{{lastUpdated}}" },
            ];

            // Only set sample variables if current variables are empty or default
            const hasRealVariables = values.variables?.some(v => v.variableName);
            if (!hasRealVariables) {
                setValue("variables", sampleVariables, { shouldValidate: true, shouldDirty: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.isProcessesConnected, values.processes]);

    return (
        <Box component="div">
            <Stack spacing={1} direction="column" alignItems="center">
                <Box component="div" onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
                    <CustomWorkflowNode data={data} />

                    {/* 🧩 Dialogue */}
                    <CustomWorkflowDialogue
                        isOpen={open}
                        handleCloseModal={handleClose}
                        title="Set Variables"
                        color={data.bgColor}
                    >
                        <FormProvider methods={methods} onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Process Connection</Typography>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                {/* ✅ Process Connection Select */}
                                <Grid item xs={12} md={6}>
                                    <RHFSelect name="isProcessesConnected" label="Connect to Processes">
                                        <MenuItem value="">Select Option</MenuItem>
                                        <MenuItem value="true">Yes</MenuItem>
                                        <MenuItem value="false">No</MenuItem>
                                    </RHFSelect>
                                </Grid>

                                {/* ✅ Processes Autocomplete */}
                                {values.isProcessesConnected && (
                                    <Grid item xs={12}>
                                        <Controller
                                            name="processes"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    options={processesData || []}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    value={field.value || []}
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Processes"
                                                            placeholder="Choose processes"
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Define Workflow Variables</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Use curly braces <code>{"{{variableName}}"}</code> to refer to dynamic values.
                                        Example: <code>{"{{userId}}"}</code>, <code>{"{{email}}"}</code>
                                    </Typography>

                                    <Divider sx={{ my: 1.5 }} />
                                </Grid>

                                {/* 🧾 Variable Key-Value Inputs */}
                                {fields.map((item, index) => {
                                    const value = values.variables?.[index]?.variableValue || "";
                                    const dynamicKey = isDynamicValue(value);

                                    return (
                                        <Grid sx={{ mt: 1 }} container spacing={1.5} key={item.id} alignItems="center">
                                            <Grid item xs={5}>
                                                <RHFTextField
                                                    name={`variables[${index}].variableName`}
                                                    label="Variable Name"
                                                    placeholder="e.g. userId"
                                                />
                                            </Grid>

                                            <Grid item xs={5}>
                                                {dynamicKey ? (
                                                    // ✅ If value is dynamic, show chip
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        sx={{
                                                            border: "1px solid #ccc",
                                                            borderRadius: 1,
                                                            p: 1,
                                                        }}
                                                    >
                                                        <Chip
                                                            color="info"
                                                            label={`Dynamic: ${dynamicKey}`}
                                                            size="small"
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Detected Dynamic
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <RHFTextField name={`variables[${index}].variableValue`} label='Variable Value' placeholder='e.g. 12345 or {{userId}}' />
                                                )}
                                            </Grid>

                                            <Grid item xs={2}>
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <Iconify icon="mdi:minus-circle-outline" width={22} />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    );
                                })}

                                {/* ➕ Add Variable Button */}
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                append({ variableName: "", variableValue: "" })
                                            }
                                        >
                                            <Iconify icon="mdi:plus-circle-outline" width={24} />
                                        </IconButton>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mt: 1 }}>
                                        💡 Tip: Dynamic values are auto-detected when wrapped in
                                        <code> {`{{variable}}`}</code>. They will appear as chips.
                                    </Alert>
                                </Grid>
                            </Grid>

                            {/* ✅ Save Button */}
                            {!data?.isProcessInstance && (
                                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                        sx={{
                                            backgroundColor: data.bgColor,
                                            borderColor: data.borderColor,
                                        }}
                                    >
                                        Save
                                    </LoadingButton>
                                </Stack>
                            )}
                        </FormProvider>
                    </CustomWorkflowDialogue>
                </Box>
            </Stack>
        </Box>
    );
}

WorkFlowSetVariable.propTypes = {
    data: PropTypes.object.isRequired,
};
