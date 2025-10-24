/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    Box, Grid, Stack, TextField, MenuItem, FormControlLabel, Checkbox, IconButton, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Autocomplete from "@mui/material/Autocomplete";
import Iconify from "src/components/iconify";
import FormProvider, { RHFSelect } from "src/components/hook-form";

// Date pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CustomWorkflowDialogue, CustomWorkflowNode, CustomWorkflowNodesPanel, outputRegistry } from "../components";

export default function WorkflowCase({ data }) {
    console.log('data for case node', data);
    const [open, setOpen] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [parentFields, setParentFields] = useState([]);
    const [fieldOptions, setFieldOptions] = useState([]);

    // condition options
    const baseConditionOptions = useMemo(() => ({
        string: ['equals', 'not equals', 'contains', 'starts with', 'ends with'],
        number: ['equals', 'not equals', 'greater than', 'less than', 'between'],
        boolean: ['is true', 'is false'],
        array: ['contains', 'not contains', 'length equals', 'length greater than', 'length less than'],
        object: ['exists', 'not exists', 'has key', 'has keys', 'is empty', 'is not empty'],
        date: ['valid date', 'invalid date', 'equals', 'not equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between'],
    }), []);

    // flatten helper (same logic as you had)
    const flattenSchema = useCallback((schema, prefix = '') => {
        const result = [];
        Object.entries(schema || {}).forEach(([key, value]) => {
            const path = prefix ? `${prefix}.${key}` : key;
            if (value?.type === 'array') {
                result.push({ field: path, type: 'array' });
                if (value.items) {
                    if (value.items.type === 'object' && value.items.properties) {
                        result.push(...flattenSchema(value.items.properties, path));
                    } else if (value.items && typeof value.items === 'object') {
                        Object.entries(value.items).forEach(([subKey, subValue]) => {
                            result.push({ field: `${path}.${subKey}`, type: subValue.type });
                        });
                    }
                }
            } else if (value?.type === 'object') {
                if (value.properties) {
                    result.push(...flattenSchema(value.properties, path));
                } else {
                    result.push({ field: path, type: 'object' });
                }
            } else {
                let t = value?.type || 'string';
                if (value?.format === 'date' || value?.format === 'date-time') t = 'date';
                result.push({ field: path, type: t });
            }
        });
        return result;
    }, []);

    // load schema / parentFields once when component mounts or when data.parentNode changes
    useEffect(() => {
        if (data?.parentNode) {
            const schema = outputRegistry?.[data.parentNode.type] || null;
            if (schema) {
                const pf = flattenSchema(schema);
                setParentFields(pf);
            } else {
                setParentFields([]);
            }
        } else {
            setParentFields([]);
        }
    }, [data?.parentNode, flattenSchema]);

    // variables from blueprint (converted into selectable fieldOptions)
    const blueprintVariables = useMemo(() => (data?.variables || []).map(v => ({
        field: `${v.variableName}`,
        label: `${v.variableName} (variable)`,
        type: v.variableType || 'string', // optional variableType if you add it later
        variableName: v.variableName,
        variableValue: v.variableValue,
    })), [data]);

    // combine parentFields + variables into fieldOptions
    useEffect(() => {
        const pfOptions = parentFields.map(f => ({ field: f.field, label: f.field, type: f.type }));
        setFieldOptions([...pfOptions, ...blueprintVariables]);
    }, [parentFields, blueprintVariables]);

    // validation schema
    const schema = Yup.object().shape({
        logicalOperator: Yup.string().oneOf(['AND', 'OR']).required(),
        conditions: Yup.array().of(
            Yup.object().shape({
                field: Yup.string().required('Field is required'),
                fieldType: Yup.string().required(),
                condition: Yup.string().required('Condition is required'),
                value: Yup.mixed().nullable(),
                valueTo: Yup.mixed().nullable(),
            })
        ).min(1, 'At least one condition is required'),
    });

    const defaultValues = useMemo(() => ({
        logicalOperator: data?.bluePrint?.logicalOperator || 'AND',
        conditions: (data?.bluePrint?.conditions && Array.isArray(data.bluePrint.conditions))
            ? data.bluePrint.conditions.map(c => ({ ...c })) // clone
            : [{ field: '', fieldType: '', condition: '', value: '', valueTo: '' }]
    }), [data]);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const { control, handleSubmit, reset, watch } = methods;
    const { fields, append, remove, replace } = useFieldArray({ control, name: 'conditions' });
    const watchedConditions = watch('conditions') || [];

    // reset only when defaultValues object changes (not on every render)
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    // helper: get field type from options (memoized)
    const getFieldType = useCallback((fieldName) => {
        if (!fieldName) return null;
        const found = fieldOptions.find(f => f.field === fieldName);
        return found?.type || 'string';
    }, [fieldOptions]);

    // carefully update fieldType for conditions only when it actually differs to avoid loops
    useEffect(() => {
        if (!Array.isArray(watchedConditions)) return;
        let changed = false;
        const updated = watchedConditions.map((cond) => {
            const detected = getFieldType(cond.field) || 'string';
            if (cond.fieldType !== detected) {
                changed = true;
                return { ...cond, fieldType: detected };
            }
            return cond;
        });
        if (changed) {
            // replace only when type changed (preserves user-entered condition/value)
            replace(updated);
        }
        // track field names only for triggering
    }, [JSON.stringify((watchedConditions || []).map(c => c.field)), getFieldType, replace]);

    // submit handler
    const onSubmit = (formData) => {
        // ensure we save only minimal shape
        const payload = {
            logicalOperator: formData.logicalOperator,
            conditions: formData.conditions.map(c => ({
                field: c.field,
                fieldType: c.fieldType,
                condition: c.condition,
                value: c.value,
                valueTo: c.valueTo
            }))
        };
        data.functions.handleBluePrintComponent(data.label, data.id, payload);
        setOpen(false);
        if (!data.bluePrint) {
            setShowPanel(true);
        }
    };

    // render input for value depending on type/condition
    const renderValueInput = (idx, cond) => {
        const type = cond.fieldType || getFieldType(cond.field) || 'string';
        const isBetween = cond.condition === 'between';
        const isDate = type === 'date';
        const isNumber = type === 'number';
        const isBoolean = type === 'boolean';

        if (isBoolean) {
            return (
                <Controller
                    name={`conditions.${idx}.value`}
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox {...field} checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />}
                            label="Value"
                        />
                    )}
                />
            );
        }

        if (isDate) {
            if (isBetween) {
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack direction="row" spacing={1}>
                            <Controller
                                name={`conditions.${idx}.value`}
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="From"
                                        value={field.value ?? null}
                                        onChange={(val) => field.onChange(val)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                )}
                            />
                            <Controller
                                name={`conditions.${idx}.valueTo`}
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="To"
                                        value={
                                            field.valueTo && !Number.isNaN(new Date(field.valueTo))
                                                ? new Date(field.valueTo)
                                                : null
                                        } onChange={(val) => field.onChange(val)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                )}
                            />
                        </Stack>
                    </LocalizationProvider>
                );
            }
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                        name={`conditions.${idx}.value`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="Date"
                                value={
                                    field.value && !Number.isNaN(new Date(field.value))
                                        ? new Date(field.value)
                                        : null
                                }
                                onChange={(val) => field.onChange(val ? val.toISOString() : '')}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        )}
                    />
                </LocalizationProvider>

            );
        }

        if (isNumber) {
            if (isBetween) {
                return (
                    <Stack direction="row" spacing={1}>
                        <Controller name={`conditions.${idx}.value`} control={control} render={({ field }) => (
                            <TextField {...field} fullWidth type="number" label="From" />
                        )} />
                        <Controller name={`conditions.${idx}.valueTo`} control={control} render={({ field }) => (
                            <TextField {...field} fullWidth type="number" label="To" />
                        )} />
                    </Stack>
                );
            }
            return <Controller name={`conditions.${idx}.value`} control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="number" label="Value" />
            )} />;
        }

        // default string / object / array handling
        if (isBetween) {
            return (
                <Stack direction="row" spacing={1}>
                    <Controller name={`conditions.${idx}.value`} control={control} render={({ field }) => <TextField {...field} fullWidth label="From" />} />
                    <Controller name={`conditions.${idx}.valueTo`} control={control} render={({ field }) => <TextField {...field} fullWidth label="To" />} />
                </Stack>
            );
        }

        return <Controller name={`conditions.${idx}.value`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Value" />} />;
    };

    // used only for debugging while developing
    useEffect(() => {
        // console.debug("watchedConditions", watchedConditions);
    }, [watchedConditions]);

    return (
        <Box>
            <Stack spacing={1} direction='column' alignItems='center'>
                <Box component='div' onClick={() => setOpen(true)} sx={{ cursor: 'pointer' }}>
                    <CustomWorkflowNode data={data} />
                </Box>
            </Stack>

            <CustomWorkflowDialogue isOpen={open} handleCloseModal={() => setOpen(false)} title="Case Node" color={data.bgColor || '#f50057'}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <Controller name="logicalOperator" control={control} render={({ field }) => (
                                <RHFSelect {...field} name="logicalOperator" label="Logical Operator">
                                    <MenuItem value="AND">AND</MenuItem>
                                    <MenuItem value="OR">OR</MenuItem>
                                </RHFSelect>
                            )} />
                        </Grid>

                        {fields.map((cond, idx) => (
                            <Grid key={cond.id} item xs={12}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>

                                    {/* Type Selector */}
                                    <Box sx={{ flex: 1 }}>
                                        <Controller
                                            name={`conditions.${idx}.fieldType`}
                                            control={control}
                                            render={({ field }) => (
                                                <RHFSelect {...field} label="Type" fullWidth>
                                                    {['string', 'number', 'boolean', 'array', 'object', 'date'].map(type => (
                                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            )}
                                        />
                                    </Box>

                                    {/* Field / Variable */}
                                    <Box sx={{ flex: 1 }}>
                                        <Controller
                                            name={`conditions.${idx}.field`}
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={fieldOptions.filter(opt => opt.type === watchedConditions[idx]?.fieldType || opt.type === 'string')}
                                                    getOptionLabel={(opt) => opt.label || opt.field}
                                                    onChange={(e, val) => field.onChange(val?.field || '')}
                                                    value={fieldOptions.find(o => o.field === field.value) || null}
                                                    renderInput={(params) => <TextField {...params} label="Field / Variable" fullWidth />}
                                                    isOptionEqualToValue={(option, value) => option?.field === value?.field}
                                                />
                                            )}
                                        />
                                    </Box>

                                    {/* Condition Selector */}
                                    <Box sx={{ flex: 1 }}>
                                        <Controller
                                            name={`conditions.${idx}.condition`}
                                            control={control}
                                            render={({ field }) => {
                                                const type = watchedConditions[idx]?.fieldType || 'string';
                                                const condOptions = baseConditionOptions[type] || baseConditionOptions.string;
                                                return (
                                                    <RHFSelect {...field} label="Condition" fullWidth>
                                                        {condOptions.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                                    </RHFSelect>
                                                );
                                            }}
                                        />
                                    </Box>

                                    {/* Value */}
                                    <Box sx={{ flex: 1 }}>
                                        {renderValueInput(idx, watchedConditions[idx] || {})}
                                    </Box>

                                    {/* Delete */}
                                    <IconButton color="error" onClick={() => remove(idx)} size="large">
                                        <Iconify icon="mdi:delete-outline" width={20} height={20} />
                                    </IconButton>
                                </Stack>
                            </Grid>

                        ))}

                        <Grid item xs={12}>
                            <Button startIcon={<Iconify icon="mdi:plus" width={20} height={20} />} variant="outlined" onClick={() => append({ field: '', fieldType: '', condition: '', value: '', valueTo: '' })}>
                                Add Condition
                            </Button>
                        </Grid>
                    </Grid>

                    {data?.isProcessInstance !== true && (
                        <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                            <LoadingButton sx={{ backgroundColor: '#f50057', borderColor: data.borderColor }} type="submit" variant="contained">
                                Save
                            </LoadingButton>
                        </Stack>
                    )}
                </FormProvider>
            </CustomWorkflowDialogue>

            {showPanel && <CustomWorkflowNodesPanel open={showPanel} onSelect={(n) => { data.functions.handleCaseNode(data.id, n); setShowPanel(false); }} onClose={() => setShowPanel(false)} bluePrintNode={[]} />}
        </Box>
    );
}

WorkflowCase.propTypes = {
    data: PropTypes.object,
};
