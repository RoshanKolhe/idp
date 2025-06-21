import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import { FTPComponent, HTTPComponent } from "../deliver-components";
import CustomProcessDialogue from "./components-dialogue";

// channel options
const channelOptions = [
    { label: 'FTP', value: 'ftp', isDisabled: false },
    { label: 'API', value: 'api', isDisabled: true },
    { label: 'HTTP/HTTPS', value: 'http', isDisabled: false },
    { label: 'CRM Connectors', value: 'crm', isDisabled: false },
    { label: 'Task Manager Connectors', value: 'task-manager', isDisabled: false },
    { label: 'Workflow Connectors', value: 'workflow', isDisabled: false },
]

// const channelSchemas
const channelSchemas = {
    ftp: Yup.object().shape({
        path: Yup.string().required('FTP path is required'),
    }),
    api: Yup.object().shape({
        endpoint: Yup.string().url('Invalid URL').required('Endpoint is required'),
        token: Yup.string().required('Token is required'),
    }),
    http: Yup.object().shape({
        url: Yup.string().url('Invalid URL').required('URL is required'),
    }),
};

const getValidationSchema = (channelType) =>
    Yup.object().shape({
        channelType: Yup.string().required('Channel Type is required'),
        ...(channelSchemas[channelType] ? channelSchemas[channelType].fields : {}),
    });

// switch case functions
function Switch({ opt }) {
    let component;

    switch (opt) {
        case 'ftp':
            component = <FTPComponent />;
            break;

        case 'http':
            component = <HTTPComponent />;
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

// getComponent to show
const getComponent = (values = {}) => {
    const { channelType, path, url } = values;

    switch (channelType) {
        case 'ftp':
            return <Typography variant="body1">{path}</Typography>;

        case 'http':
            return <Typography variant="body1">{url}</Typography>;

        default:
            return null;
    }
};

export default function ReactFlowDeliver({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));

    const defaultValues = useMemo(
        () => ({
            channelType: data.bluePrint?.channelType || '',
            path: data.bluePrint?.path || '',
            url: data.bluePrint?.url || '',
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
        data.functions.handleBluePrintComponent(data.label, { ...formData });
        handleCloseModal();
    })

    useEffect(() => {
        setDynamicSchema(getValidationSchema(values.channelType));
    }, [values.channelType]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);


    // Open modal
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsOpen(false);
    }


    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <ReactFlowCustomNodeStructure data={data} />
            <Typography variant='h5'>5. {data.label}</Typography>
            {values.channelType !== '' && <Typography variant='h6'>{channelOptions.find((channel) => channel.value === values.channelType).label}</Typography>}
            {getComponent(values)}
            <Button sx={{ width: '200px', color: 'royalBlue', borderColor: 'royalBlue' }} variant='outlined' onClick={() => handleOpenModal()}>Add Destination</Button>
            <CustomProcessDialogue
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
                title='Add Channel'
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <RHFSelect name='channelType' label='Channel Type'>
                                {(channelOptions && channelOptions.length) > 0 ? channelOptions.map((channel) => (
                                    <MenuItem key={channel.value} value={channel.value} disabled={channel.isDisabled}>{channel.label}</MenuItem>
                                )) : (
                                    <MenuItem value=''>No channels found</MenuItem>
                                )}
                            </RHFSelect>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Switch opt={values.channelType} onClose={handleCloseModal} />
                        </Grid>
                    </Grid>
                    <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Add
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </CustomProcessDialogue>
        </Stack>
    )
}

ReactFlowDeliver.propTypes = {
    data: PropTypes.object,
}
