import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, MenuItem, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components";
import { DaysComponent, HoursComponent, MinutesComponent, MonthsComponent, SecondsComponent, WeeksComponent } from "../time-trigger-components";

// channel options
const triggerOptions = [
    { label: 'Seconds', value: 'seconds', isDisabled: false },
    { label: 'Minutes', value: 'minutes', isDisabled: false },
    { label: 'Hours', value: 'hours', isDisabled: false },
    { label: 'Days', value: 'days', isDisabled: false },
    { label: 'Weeks', value: 'weeks', isDisabled: false },
    { label: 'Months', value: 'months', isDisabled: false },
    // { label: 'Custom (cron)', value: 'cron', isDisabled: false },
]

// trigger schemas
const triggerSchemas = {
    seconds: Yup.object().shape({
        seconds: Yup.number().required('Seconds are required'),
    }),
    minutes: Yup.object().shape({
        minutes: Yup.number().required('Minutes are required'),
    }),
    hours: Yup.object().shape({
        hoursBetween: Yup.number().required('Hours between trigger are required'),
        minuteTrigger: Yup.number()
            .required('Trigger at Minutes is required')
            .min(0, 'Minutes must be at least 0')
            .max(59, 'Minutes cannot be more than 59')
    }),
    days: Yup.object().shape({
        daysBetween: Yup.number().required('Days between trigger are required'),
        dayHour: Yup.number().required('Hours between trigger are required'),
        minuteTrigger: Yup.number()
            .required('Trigger at Minutes is required')
            .min(0, 'Minutes must be at least 0')
            .max(59, 'Minutes cannot be more than 59')
    }),
    weeks: Yup.object().shape({
        weeksBetween: Yup.number().required('Weeks between trigger are required'),
        daysOfWeek: Yup.array().of(Yup.number().required('Days between trigger are required')),
        dayHour: Yup.number().required('Hours between trigger are required'),
        minuteTrigger: Yup.number()
            .required('Trigger at Minutes is required')
            .min(0, 'Minutes must be at least 0')
            .max(59, 'Minutes cannot be more than 59')
    }),
    months: Yup.object().shape({
        monthsBetween: Yup.number().required('Weeks between trigger are required'),
        monthDayAt: Yup.number().required('day of the month is required'),
        dayHour: Yup.number().required('Hours between trigger are required'),
        minuteTrigger: Yup.number()
            .required('Trigger at Minutes is required')
            .min(0, 'Minutes must be at least 0')
            .max(59, 'Minutes cannot be more than 59')
    })
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
        case 'seconds':
            component = <SecondsComponent />;
            break;

        case 'minutes':
            component = <MinutesComponent />;
            break;

        case 'hours':
            component = <HoursComponent />;
            break;

        case 'days':
            component = <DaysComponent />;
            break;

        case 'weeks':
            component = <WeeksComponent />;
            break;

        case 'months':
            component = <MonthsComponent />;
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

export default function WorkFlowTimeTrigger({ data }) {
    const [open, setOpen] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));

    const defaultValues = useMemo(
        () => ({
            triggerType: data.bluePrint?.channelType || 'seconds',
            seconds: data.bluePrint?.seconds || 30,
            minutes: data.bluePrint?.minutes || 10,
            hoursBetween: data.bluePrint?.hoursBetween || 1,
            minuteTrigger: data.bluePrint?.minuteTrigger || 0,
            daysBetween: data.bluePrint?.daysBetween || 1,
            dayHour: data.bluePrint?.dayHour || 0,
            weeksBetween: data.bluePrint?.weeksBetween || 1,
            daysOfWeek: data.bluePrint?.dayHour || [7],
            monthsBetween: data.bluePrint?.monthsBetween || 1,
            monthDayAt: data.bluePrint?.monthDayAt || 1,
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
                <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title="Time Trigger" color={data.bgColor}>
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

                        <Grid container spacing={1}>
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

WorkFlowTimeTrigger.propTypes = {
    data: PropTypes.object,
}