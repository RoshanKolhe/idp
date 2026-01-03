import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";

export default function ReactFlowAggregator({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const settingOptions = [
        { label: 'Wait for all paths to complete (Strict Merge)', value: 1 },
        { label: 'Proceed when any path completes (Partial Merge)', value: 2 },
    ];


    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);

    const newAggregatorSchema = Yup.object().shape({
        aggregatorSetting: Yup.number().required('Please select setting type')
    });

    const defaultValues = useMemo(() => ({
        aggregatorSetting: data?.bluePrint?.aggregatorSetting || 1
    }), [data]);

    const methods = useForm({
        resolver: yupResolver(newAggregatorSchema),
        defaultValues
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = handleSubmit((formData) => {
        data.functions.handleBluePrintComponent(data.label, formData);
        handleCloseModal();
    });

    useEffect(() => {
        if (data && data?.bluePrint) {
            reset(defaultValues);
        }
    }, [data, reset, defaultValues]);

    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <Box
                component='div'
                sx={{
                    cursor: 'pointer'
                }}
                onClick={() => handleOpenModal()}
            >
                <ReactFlowCustomNodeStructure data={data} />
            </Box>
            <Typography variant='h5'>{data.label}</Typography>
            {(data?.isProcessInstance !== true) && <Button
                sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                onClick={handleOpenModal}
                variant="outlined"
            >
                Aggregator settings
            </Button>}

            {/* Dialog */}
            <CustomProcessDialogue
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
                title='Aggregator settings'
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12}>
                            <RHFSelect name="model" label="Select aggregator setting">
                                {settingOptions.length > 0 ? settingOptions.map((model) => (
                                    <MenuItem key={model.value} value={model.value}>{model.label}</MenuItem>
                                )) : (
                                    <MenuItem value=''>No options found</MenuItem>
                                )}
                            </RHFSelect>
                        </Grid>
                    </Grid>
                    <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Add
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </CustomProcessDialogue>
        </ Stack>
    )
}

ReactFlowAggregator.propTypes = {
    data: PropTypes.object
}
