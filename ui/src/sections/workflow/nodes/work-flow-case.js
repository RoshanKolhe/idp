/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Box, Grid, Stack, TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import { CustomWorkflowDialogue, CustomWorkflowNode, CustomWorkflowNodesPanel, outputRegistry } from "../components";

export default function WorkflowCase({ data }) {
    console.log('case node data', data);
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [outputSchema, setOutputSchema] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [availableConditions, setAvailableConditions] = useState([]);

    // Condition options based on data type
    const conditionOptions = {
        string: ['equals', 'not equals', 'contains', 'starts with', 'ends with'],
        number: ['equals', 'not equals', 'greater than', 'less than', 'between'],
        boolean: ['is true', 'is false'],
        array: ['contains', 'not contains', 'length equals', 'length greater then', 'length less then'],
    };

    const flattenSchema = (schema, prefix = '') => {
        const result = [];

        Object.entries(schema || {}).forEach(([key, value]) => {
            const path = prefix ? `${prefix}.${key}` : key;

            // Add array itself as a field for conditions
            if (value.type === 'array') {
                result.push({ field: path, type: 'array' });

                if (value.items) {
                    Object.entries(value.items).forEach(([subKey, subValue]) => {
                        result.push({ field: `${path}.${subKey}`, type: subValue.type }); // item-level conditions
                    });
                }
            }
            else if (value.type === 'object' && value.properties) {
                result.push(...flattenSchema(value.properties, path));
            }
            else {
                result.push({ field: path, type: value.type });
            }
        });

        return result;
    };

    const parentFields = useMemo(() => {
        if (!outputSchema) return [];
        return flattenSchema(outputSchema);
    }, [outputSchema]);

    useEffect(() => {
        if (data.parentNode) {
            setOutputSchema(outputRegistry?.[data.parentNode.type]);
        }
    }, [data]);

    useEffect(() => {
        if (selectedField) {
            const fieldType = parentFields.find(f => f.field === selectedField)?.type;
            setAvailableConditions(conditionOptions[fieldType] || []);
        } else {
            setAvailableConditions([]);
        }
    }, [selectedField, parentFields]);

    const defaultValues = useMemo(() => ({
        field: data?.bluePrint?.field || '',
        condition: data?.bluePrint?.condition || '',
        value: data?.bluePrint?.value || '',
    }), []);

    const methods = useForm({
        resolver: yupResolver(
            Yup.object().shape({
                field: Yup.string().required('Field is required'),
                condition: Yup.string().required('Condition is required'),
                value: Yup.mixed(),
            })
        ),
        defaultValues,
    });

    const { reset, watch, control, handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit((formData) => {
        console.log('Submitted form data:', formData);
        data.functions.handleBluePrintComponent(data.label, data.id, { ...formData });
        handleClose();
        if(!data.bluePrint){
            setShowModal(true);
        }
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const addNewNode = (newOperationNode) => {
        try {
            data.functions.handleCaseNode(data.id, newOperationNode);
            setShowModal(false);
        } catch (error) {
            console.error('Error while adding new case node', error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const values = watch();

    useEffect(() => {
        if (values.field) {
            setSelectedField(values.field);
        }
    }, [values.field])

    return (
        <Box>
            <Stack spacing={1} direction='column' alignItems='center'>
                <Box component='div' onClick={() => handleOpen()} sx={{ cursor: 'pointer' }}>
                    <CustomWorkflowNode data={data} />
                </Box>
            </Stack>

            <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title="Case Node" color={data.bgColor || '#f50057'}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {/* Field Selector */}
                        <Grid item xs={12} md={6}>
                            <RHFSelect
                                name="field"
                                label="Field"
                            >
                                {parentFields?.length > 0 && parentFields.map((field) => (
                                    <MenuItem key={field.field} value={field.field}>
                                        {field.field}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        {/* Condition Selector */}
                        <Grid item xs={12} md={6}>
                            <RHFSelect
                                name="condition"
                                label="Condition"
                            >
                                {availableConditions?.length > 0 && availableConditions.map((cond) => (
                                    <MenuItem key={cond} value={cond}>
                                        {cond}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        {/* Value Input */}
                        <Grid item xs={12} md={12}>
                            <Controller
                                name="value"
                                control={control}
                                render={({ field }) => {
                                    const selectedType = parentFields.find(f => f.field === selectedField)?.type;

                                    if (selectedType === 'boolean') {
                                        return <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value || false} />}
                                            label="Value"
                                        />;
                                    }

                                    return <TextField
                                        fullWidth
                                        label="Value"
                                        {...field}
                                        type={selectedType === 'number' ? 'number' : 'text'}
                                    />;
                                }}
                            />
                        </Grid>
                    </Grid>

                    {data?.isProcessInstance !== true && (
                        <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                            <LoadingButton
                                sx={{ backgroundColor: '#f50057', borderColor: data.borderColor }}
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                Add
                            </LoadingButton>
                        </Stack>
                    )}
                </FormProvider>
            </CustomWorkflowDialogue>

            {/* Node selection panel */}
            {showModal && <CustomWorkflowNodesPanel open={showModal} onSelect={addNewNode} onClose={() => setShowModal(false)} bluePrintNode={[]} />}
        </Box>
    );
}

WorkflowCase.propTypes = {
    data: PropTypes.object,
};
