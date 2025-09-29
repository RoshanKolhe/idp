import { useEffect, useMemo, useState } from "react";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Grid, MenuItem, Stack, Typography } from "@mui/material"
import FormProvider, { RHFSelect } from "src/components/hook-form";
import { useGetFilteredEscalations } from "src/api/escalation";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components"
import { EmailComponent } from "../notification-components";

// notification type options
const notificationTypes = [
    { label: 'Success', value: 'success', isDisabled: false, color: '#4CAF50' },     // Green
    { label: 'Error', value: 'error', isDisabled: false, color: '#F44336' },         // Red
    { label: 'Warning', value: 'warning', isDisabled: false, color: '#FF9800' },     // Orange
    { label: 'Info', value: 'info', isDisabled: false, color: '#2196F3' },           // Blue
    { label: 'Reminder', value: 'reminder', isDisabled: false, color: '#9C27B0' },   // Purple
];

// notification source options
const notificationSource = [
    { label: 'SMS', value: 'sms', isDisabled: true, icon: '/assets/icons/workflow/notification-node/sms.png' },
    { label: 'Email', value: 'email', isDisabled: false, icon: '/assets/icons/workflow/notification-node/gmail.png' },
    { label: 'Whatsapp', value: 'whatsapp', isDisabled: true, icon: '/assets/icons/workflow/notification-node/whatsapp.png' },
]


// const channelSchemas
const NotificationSourceSchemas = {
    email: Yup.object().shape({
        to: Yup.array().of(Yup.string().required('Recepient name is required')).min(1, 'Atleast one email is required'),
        subject: Yup.string().required('Subject is required'),
        body: Yup.mixed().required('Email body is required'),
    }),
    // http: Yup.object().shape({
    //     url: Yup.string().url('Invalid URL').required('URL is required'),
    // }),
};

// getComponent to show
const getComponent = (values = {}) => {
    const { channelType, host, path, url } = values;

    switch (channelType) {
        case 'sms':
            return <Typography variant="body1">{`${host}/${path}`}</Typography>;

        case 'email':
            return <Typography variant="body1">{url}</Typography>;

        case 'whatsapp':
            return <Typography variant="body1">{url}</Typography>;

        default:
            return null;
    }
};

const getValidationSchema = (source) =>
    Yup.object().shape({
        notificationType: Yup.string().required('Notification Type is required'),
        notificationSource: Yup.string().required('Notification Source is required'),
        isEscalationMatrixUsers: Yup.boolean().required('Please select whether we are using escalation matrix'),
        escalationMatrix: Yup.number().when('isEscalationMatrixUsers', {
            is: true,
            then: (schema) => schema.required('Please select escalation matrix'),
            otherwise: (schema) => schema.notRequired(),
        }),
        level: Yup.number().when('isEscalationMatrixUsers', {
            is: true,
            then: (schema) => schema.required('Please select level'),
            otherwise: (schema) => schema.notRequired(),
        }),
        ...(NotificationSourceSchemas[source] ? NotificationSourceSchemas[source].fields : {}),
    });

// switch case functions
function Switch({ opt }) {
    let component;

    switch (opt) {
        case 'sms':
            component = <div />;
            break;

        case 'email':
            component = <EmailComponent />;
            break;

        case 'whatsapp':
            component = <div />;
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

export default function WorkFlowNotification({ data }) {
    const [open, setOpen] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));
    const filter = {
        where: {
            and: [
                { isActive: true },
                { isDeleted: false }
            ]
        }
    };
    const filterString = encodeURIComponent(JSON.stringify(filter));
    const { escalations, escalationsEmpty } = useGetFilteredEscalations(filterString);
    const [escalationsData, setEscalationsData] = useState([]);

    useEffect(() => {
        if(escalations && !escalationsEmpty){
            setEscalationsData(escalations);
        }
    }, [escalations, escalationsEmpty])

    const defaultValues = useMemo(
        () => ({
            notificationType: data.bluePrint?.notificationType || '',
            notificationSource: data.bluePrint?.notificationSource || '',
            isEscalationMatrixUsers: data.bluePrint?.isEscalationMatrixUsers || false,
            escalationMatrix: data.bluePrint?.escalationMatrix || undefined,
            level: data.bluePrint?.level || undefined,
            to: data.bluePrint?.to || [],
            body: data.bluePrint?.body || undefined,
            subject: data.bluePrint?.subject || '',
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
        formState: { isSubmitting, errors },
    } = methods;

    console.log('errors', errors);

    const values = watch();

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        const newFormData = formData;
        data.functions.handleBluePrintComponent(data.label, data.id, { ...newFormData });
        handleClose();
    })

    useEffect(() => {
        setDynamicSchema(getValidationSchema(values.notificationSource));
    }, [values.notificationSource]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Escalation configurations...
    useEffect(() => {
        if (values.escalationMatrix && values.level) {
            if (values.notificationSource === 'email') {
                const membersEmails = escalationsData?.find(
                    (escalation) => escalation.id === values.escalationMatrix)?.levels?.find(
                        (level) => level.id === values.level)?.members?.map(
                            (member) => member.email) || [];
                setValue('to', membersEmails);
            } else {
                setValue('to', []);
            }
        }
    }, [values.level, values.escalationMatrix, values.notificationSource, escalationsData, setValue]);

    console.log('escalation', escalations);
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
                <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title="Notification" color={data.bgColor}>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <RHFSelect name='notificationType' label='Notification Type'>
                                    {(notificationTypes?.length > 0)
                                        ? notificationTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value} disabled={type.isDisabled}>
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-block',
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        backgroundColor: type.color,
                                                        marginRight: 1,
                                                    }}
                                                />
                                                {type.label}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value=''>No channels found</MenuItem>
                                    }
                                </RHFSelect>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFSelect name='notificationSource' label='Notification Source'>
                                    {(notificationSource?.length > 0)
                                        ? notificationSource.map((source) => (
                                            <MenuItem key={source.value} value={source.value} disabled={source.isDisabled}>
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        marginRight: 1,
                                                        width: '25px',
                                                    }}
                                                    src={source.icon}
                                                />
                                                {source.label}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value=''>No channels found</MenuItem>
                                    }
                                </RHFSelect>
                            </Grid>

                            {/* Escalation Matrix configurations */}
                            <Grid item xs={12} md={6}>
                                <RHFSelect name='isEscalationMatrixUsers' label='Escalation Matrix Users'>
                                    {([{ label: 'True', value: true }, { label: 'False', value: false }]?.length > 0)
                                        ? [{ label: 'True', value: true }, { label: 'False', value: false }].map((source) => (
                                            <MenuItem key={source.value} value={source.value}>
                                                {source.label}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value=''>No Options</MenuItem>
                                    }
                                </RHFSelect>
                            </Grid>

                            {values.isEscalationMatrixUsers === true && (
                                <Grid item xs={12} md={6}>
                                    <RHFSelect name='escalationMatrix' label='Escalation Matrix'>
                                        {(escalationsData?.length > 0)
                                            ? escalationsData.map((source) => (
                                                <MenuItem key={source.id} value={source.id}>
                                                    {source.escalationName}
                                                </MenuItem>
                                            ))
                                            : <MenuItem value=''>No Escalations found</MenuItem>
                                        }
                                    </RHFSelect>
                                </Grid>
                            )}

                            {(values.isEscalationMatrixUsers === true && values.escalationMatrix) && (
                                <Grid item xs={12} md={6}>
                                    <RHFSelect name='level' label='Level'>
                                        {(escalationsData?.length > 0)
                                            ? escalationsData.find((escalation) => escalation.id === values.escalationMatrix)?.levels?.map((source) => (
                                                <MenuItem key={source?.id} value={source?.id}>
                                                    {source?.name}
                                                </MenuItem>
                                            ))
                                            : <MenuItem value=''>No Levels found</MenuItem>
                                        }
                                    </RHFSelect>
                                </Grid>
                            )}
                        </Grid>

                        <Grid container spacing={1}>
                            <Switch opt={values.notificationSource} onClose={handleClose} />
                        </Grid>
                        {(data?.isProcessInstance !== true) && <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                            <LoadingButton sx={{ backgroundColor: data.bgColor, borderColor: data.borderColor }} type="submit" variant="contained" loading={isSubmitting}>
                                Add
                            </LoadingButton>
                        </Stack>}
                    </FormProvider>
                </CustomWorkflowDialogue>
            </Stack>
        </Box>
    )
}

WorkFlowNotification.propTypes = {
    data: PropTypes.object,
}