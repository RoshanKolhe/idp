import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, MenuItem, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";
import { MinutesComponent, SecondsComponent } from "../time-trigger-components";
import { IntervalComponent, TimeComponent } from "../wait-components";

// channel options
const triggerOptions = [
    { label: 'After Time Interval', value: 'interval', isDisabled: false, desc: 'Waits for a certain amount of time' },
    { label: 'At Specified Time', value: 'time', isDisabled: false, desc: 'Waits until a specific date and time to continue' },
]

// trigger schemas
const triggerSchemas = {
    interval: Yup.object().shape({
        intervalType: Yup.number().required('Interval type is required'),
        seconds: Yup.number().when("intervalType", {
            is: 0,
            then: (schema) => schema.required("Seconds are required").min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),

        minutes: Yup.number().when("intervalType", {
            is: 1,
            then: (schema) => schema.required("Minutes are required").min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),

        hours: Yup.number().when("intervalType", {
            is: 2,
            then: (schema) => schema.required("Hours are required").min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),

        days: Yup.number().when("intervalType", {
            is: 3,
            then: (schema) => schema.required("Days are required").min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),
    }),
    time: Yup.object().shape({
        dateAndTime: Yup.string().required('Date is required'),
    }),
};

// get validation schema 
const getValidationSchema = (channelType) =>
    Yup.object().shape({
        triggerType: Yup.string().required('Trigger Type is required'),
        ...(triggerSchemas[channelType] ? triggerSchemas[channelType].fields : {}),
    });

// switch case functions
function Switch({ opt }) {
    let component;

    switch (opt) {
        case 'interval':
            component = <IntervalComponent />;
            break;

        case 'time':
            component = <TimeComponent />;
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
}

export default function WorkFlowWait({ data }) {
    const [open, setOpen] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));

    const defaultValues = useMemo(
        () => ({
            triggerType: data.bluePrint?.channelType || 'interval',
            intervalType: data.bluePrint?.intervalType || 0,
            seconds: data.bluePrint?.seconds || 30,
            minutes: data.bluePrint?.minutes || 10,
            hours: data.bluePrint?.hours || 1,
            days: data.bluePrint?.days || 1,
            dateAndTime: data.bluePrint?.dateAndTime ? new Date(data.bluePrint?.dateAndTime) : new Date(),
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(dynamicSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();
    console.log('values', values);

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        const newFormData = formData;
        data.functions.handleBluePrintComponent(data.label, data.id, { ...newFormData });
        handleClose();
    })

    useEffect(() => {
        setDynamicSchema(getValidationSchema(values.triggerType));
    }, [values.triggerType]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


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
                    onClick={() => handleOpen()}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
                <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title="Wait / Delay" color={data.bgColor}>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={12}>
                                <RHFSelect name='triggerType' label='Trigger Type'>
                                    {(triggerOptions?.length > 0)
                                        ? triggerOptions.map((trigger) => (
                                            <MenuItem key={trigger.value} value={trigger.value} disabled={trigger.isDisabled}>
                                                {trigger.label}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value=''>No triggers found</MenuItem>
                                    }
                                </RHFSelect>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Switch opt={values.triggerType} onClose={handleClose} />
                        </Grid>
                        <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                            <LoadingButton sx={{ backgroundColor: data.bgColor, borderColor: data.borderColor }} type="submit" variant="contained" loading={isSubmitting}>
                                Add
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </CustomWorkflowDialogue>
            </Stack>
        </Box>
    )
}

WorkFlowWait.propTypes = {
    data: PropTypes.object,
}