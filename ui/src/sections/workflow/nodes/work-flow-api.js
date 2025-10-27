import { Box, Grid, IconButton, InputAdornment, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types"
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowDialogue, CustomWorkflowNode, CustomWorkflowVariablePopover } from "../components";
import { APIBodyTypeFormData, APIBodyTypeRaw, APIBodyTypeUrlEncoded, FieldsArrayKeyValueComponent } from "../api-components";

// switch case functions
function Switch({ opt, variables }) {
    let component;

    switch (opt) {
        case 1:
            component = <APIBodyTypeRaw variables={variables} />;
            break;

        case 2:
            component = <APIBodyTypeUrlEncoded variables={variables} />;
            break;

        case 3:
            component = <APIBodyTypeFormData />;
            break;

        default:
            component = <div />
    }

    return (
        <>{component}</>
    )
}
Switch.propTypes = {
    opt: PropTypes.string,
    variables: PropTypes.array
}

export default function WorkFlowAPI({ data }) {
    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentField, setCurrentField] = useState({ name: null, ref: null });
    const [variables, setVariables] = useState([]);

    const methodOptions = [
        { label: "GET", value: 1, description: "Retrieve data from the server (no body required)." },
        { label: "POST", value: 2, description: "Send data to the server to create a new resource." },
        { label: "PUT", value: 3, description: "Update or replace an existing resource on the server." },
        { label: "PATCH", value: 4, description: "Partially update an existing resource on the server." },
        { label: "DELETE", value: 5, description: "Remove a resource from the server." }
    ];

    const bodyTypeOptions = [
        {
            label: "Raw",
            value: 1,
            description:
                "Send data as a raw JSON object. Commonly used for APIs that expect JSON request bodies.",
        },
        {
            label: "x-www-form-urlencoded",
            value: 2,
            description:
                "Send key-value pairs encoded in URL format (like HTML form submissions). Used for simple structured data.",
        },
        {
            label: "Form Data (multipart/form-data)",
            value: 3,
            description:
                "Upload text fields and files together. Commonly used for file uploads or complex form submissions.",
        },
    ];

    const handleClose = () => {
        setOpen(false);
    };

    const apiValidationSchema = Yup.object().shape({
        url: Yup.string()
            .required("URL is required")
            .test(
                "valid-url-or-variable",
                "Invalid URL or variable format",
                (value) => {
                    if (!value) return false;

                    // Allow pure variable like {{apiUrl}}
                    if (/^\s*\{\{[^{}]+\}\}\s*$/.test(value)) return true;

                    // Allow URL containing variables like https://example.com/{{userId}}
                    const variableAllowedUrlRegex =
                        /^(https?:\/\/)?([a-zA-Z0-9.-]+|\{\{[^{}]+\}\})(:\d+)?(\/[^\s]*)?$/;
                    return variableAllowedUrlRegex.test(value);
                }
            ),
        method: Yup.number().required("Method is required"),

        headers: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required("Header key is required"),
                    value: Yup.string().required("Header value is required"),
                })
            )
            .default([]),

        queryStrings: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required("Query key is required"),
                    value: Yup.string().required("Query value is required"),
                })
            )
            .default([]),

        paramsValue: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required("Param key is required"),
                    value: Yup.string().required("Param value is required"),
                })
            )
            .default([]),

        bodyType: Yup.number()
            .oneOf([1, 2, 3], "Invalid body type")
            .required("Body type is required"),

        // ✅ When bodyType = 1 (Raw)
        contentType: Yup.number().when("bodyType", {
            is: 1,
            then: (schema) => schema.required("Content type is required for raw body"),
            otherwise: (schema) => schema.notRequired(),
        }),

        requestContent: Yup.string().when("bodyType", {
            is: 1,
            then: (schema) =>
                schema
                    .required("Raw body content is required")
                    .test("is-json-or-variable", "Invalid JSON or variable format", (value) => {
                        if (!value) return false;

                        // ✅ Allow pure variable
                        if (/^\s*\{\{[^{}]+\}\}\s*$/.test(value)) return true;

                        // ✅ Allow variable enclosed in quotes
                        if (/^"\s*\{\{[^{}]+\}\}\s*"$/.test(value.trim())) return true;

                        // ✅ Try parsing JSON that may contain variables
                        try {
                            const replaced = value.replace(/\{\{[^{}]+\}\}/g, '"tempVar"');
                            JSON.parse(replaced);
                            return true;
                        } catch {
                            return false;
                        }
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        // ✅ When bodyType = 2 (x-www-form-urlencoded)
        urlEncodedFields: Yup.array().when("bodyType", {
            is: 2,
            then: (schema) =>
                schema
                    .of(
                        Yup.object().shape({
                            key: Yup.string().required("Key is required"),
                            value: Yup.string().required("Value is required"),
                        })
                    )
                    .min(1, "At least one URL-encoded field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        // ✅ When bodyType = 3 (form-data)
        formDataFields: Yup.array().when("bodyType", {
            is: 3,
            then: (schema) =>
                schema
                    .of(
                        Yup.object().shape({
                            key: Yup.string().required("Field name is required"),
                            fieldType: Yup.string()
                                .oneOf(["text", "file"], "Invalid field type")
                                .required("Field type is required"),
                            value: Yup.mixed().when("fieldType", {
                                is: "text",
                                then: (s) =>
                                    s
                                        .required("Text value is required")
                                        .test(
                                            "not-empty",
                                            "Value cannot be empty",
                                            (val) => val !== ""
                                        ),
                                otherwise: (s) =>
                                    s
                                        .required("File is required")
                                        .test(
                                            "is-file",
                                            "Invalid file type",
                                            (val) => val instanceof File
                                        ),
                            }),
                        })
                    )
                    .min(1, "At least one form-data field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const defaultValues = useMemo(() => ({
        url: data.bluePrint?.url || '',
        method: data.bluePrint?.method || 1,
        headers: data.bluePrint?.headers || [],
        queryStrings: data.bluePrint?.queryStrings || [],
        paramsValue: data.bluePrint?.paramsValue || [],
        bodyType: data.bluePrint?.bodyType || undefined,
        contentType: data.bluePrint?.contentType || undefined,
        requestContent: data.bluePrint?.requestContent || '',
        urlEncodedFields: data.bluePrint?.urlEncodedFields || [],
        formDataFields: data.bluePrint?.formDataFields || []
    }), [data])

    const methods = useForm({
        resolver: yupResolver(apiValidationSchema),
        defaultValues
    });

    const {
        reset,
        watch,
        formState: { isSubmitting, errors },
        handleSubmit,
        setValue,
        getValues,
        control,
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (formData) => {
        try {
            console.log("API Form Data:", formData);
            data.functions.handleBluePrintComponent(data.label, data.id, { ...formData });
            handleClose();
        } catch (error) {
            console.error('Error while submitting data for API node', error);
        }
    });

    const handleFocus = (e, fieldName) => {
        setCurrentField({ name: fieldName, ref: e.target });
        setAnchorEl(e.target);
        setPopoverOpen(true);
    };

    const handleSelectVariable = (variable) => {
        if (!variable || !currentField.name) {
            setPopoverOpen(false);
            return;
        }

        const fieldName = currentField.name;

        if (fieldName === "body") {
            const currentVal = getValues("body") || "";
            setValue("body", `${currentVal}{{${variable}}}`, { shouldValidate: true, shouldDirty: true });
        } else if (fieldName === "to") {
            const currentArr = getValues("to") || [];
            setValue("to", [...currentArr, `{{${variable}}}`], { shouldValidate: true, shouldDirty: true });
        } else {
            // Normal TextField
            const input = currentField.ref;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newValue = `${before}{{${variable}}}${after}`;
            input.value = newValue;
            // eslint-disable-next-line no-multi-assign
            input.selectionStart = input.selectionEnd = start + variable.length + 4; // 4 for {{}}
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setValue(fieldName, newValue, { shouldValidate: true, shouldDirty: true });
        }

        setPopoverOpen(false);
    };

    useEffect(() => {
        if (data) {
            reset(defaultValues);
        }
    }, [data, reset, defaultValues]);

    // variables
    useEffect(() => {
        if (data && data.variables) {
            setVariables(data.variables);
        }
    }, [data]);

    return (
        <Box
            component='div'
        >
            <Stack
                spacing={1}
                direction='column'
                alignItems='center'
            >
                <Box
                    component='div'
                    onClick={() => { setOpen(true) }}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
                <CustomWorkflowDialogue
                    isOpen={open}
                    handleCloseModal={handleClose}
                    title="API"
                    color={data.bgColor}
                >
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <RHFTextField onFocus={(e) => handleFocus(e, "url")} name="url" label="URL" />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <RHFSelect
                                    name="method"
                                    label="Select Method"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment sx={{ mr: 3 }} position="end">
                                                <Tooltip title={methodOptions.find((value) => value.value === values.method)?.description || "Select the method"}>
                                                    <IconButton edge="end">
                                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {methodOptions.map((method) => (
                                        <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>

                            {/* headers component */}
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1'>Headers</Typography>
                                <FieldsArrayKeyValueComponent fieldName="headers" variables={variables} />
                            </Grid>

                            {/* query strings component */}
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1'>Query strings</Typography>
                                <FieldsArrayKeyValueComponent fieldName="queryStrings" variables={variables} />
                            </Grid>

                            {/* params component */}
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1'>Params Value</Typography>
                                <FieldsArrayKeyValueComponent fieldName="paramsValue" variables={variables} />
                            </Grid>

                            {/* body Type */}
                            <Grid item xs={12} md={12}>
                                <RHFSelect
                                    name="bodyType"
                                    label="Body Type"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment sx={{ mr: 3 }} position="end">
                                                <Tooltip title={bodyTypeOptions.find((value) => value.value === values.bodyType)?.description || "Select the body type"}>
                                                    <IconButton edge="end">
                                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {bodyTypeOptions.map((method) => (
                                        <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>

                            {/* based on body type switch case is implemented */}
                            <Switch opt={values.bodyType} variables={variables} />
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
                    <CustomWorkflowVariablePopover
                        open={popoverOpen}
                        handleClose={handleSelectVariable}
                        anchorEl={anchorEl}
                        variables={variables}
                    />
                </CustomWorkflowDialogue>
            </Stack>
        </Box>
    )
}

WorkFlowAPI.propTypes = {
    data: PropTypes.object,
}