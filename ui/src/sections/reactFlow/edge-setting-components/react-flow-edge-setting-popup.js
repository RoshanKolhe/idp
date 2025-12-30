import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, MenuItem, Stack, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import CustomProcessDialogue from "../components/components-dialogue";
import WaitSettingParentView from "./wait-settings-component/wait-settings-parent";

const settingOptions = [
    { label: 'Wait Settings', value: 'waitSetting', isDisabled: false, icon: 'solar:hourglass-line-duotone' },
];

// wait type schemas
const waitTypeSchemas = {
    delay: Yup.object().shape({
        intervalType: Yup.number().required('Interval type is required'),

        seconds: Yup.number().when('intervalType', {
            is: 0,
            then: (schema) =>
                schema.required('Seconds are required').min(1, 'Must be greater than 0'),
            otherwise: (schema) => schema.notRequired(),
        }),

        minutes: Yup.number().when('intervalType', {
            is: 1,
            then: (schema) =>
                schema.required('Minutes are required').min(1, 'Must be greater than 0'),
            otherwise: (schema) => schema.notRequired(),
        }),

        hours: Yup.number().when('intervalType', {
            is: 2,
            then: (schema) =>
                schema.required('Hours are required').min(1, 'Must be greater than 0'),
            otherwise: (schema) => schema.notRequired(),
        }),

        days: Yup.number().when('intervalType', {
            is: 3,
            then: (schema) =>
                schema.required('Days are required').min(1, 'Must be greater than 0'),
            otherwise: (schema) => schema.notRequired(),
        }),
    }),
};

const getTypeSchema = (values) => {
    const { type, waitType } = values || {};

    switch (type) {
        case 'waitSetting':
            return Yup.object().shape({
                type: Yup.string().required('Setting type is required'),
                waitType: Yup.string().required('Please select wait type'),

                ...(waitTypeSchemas[waitType]
                    ? waitTypeSchemas[waitType].fields
                    : {}),
            });

        default:
            return Yup.object().shape({
                type: Yup.string().required('Setting type is required'),
            });
    }
};

function Switch({ opt }) {
    let component;

    switch (opt) {
        case 'waitSetting':
            component = <WaitSettingParentView />;
            break;

        default:
            component = <div />
    }

    return (
        <>{component}</>
    )
}
Switch.propTypes = {
    opt: PropTypes.string
}

const getValidationSchema = (values) => {
    const { type } = values;
    const typeSchemas = getTypeSchema(values);

    return Yup.object().shape({
        type: Yup.string().required('Setting Type is required'),
        ...((typeSchemas[type] && values.valueRef === 0) ? typeSchemas[type].fields : {}),
    });
}

export default function ReactFlowEdgeSettingPopup({ data, isOpen, handleCloseModal }) {
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));

    console.log('data?.bluePrint', data?.bluePrint);
    const defaultValues = useMemo(() => ({
        type: data?.bluePrint ? data?.bluePrint?.settings?.types[0] : 'waitSetting',
        waitType: data?.bluePrint ? data?.bluePrint?.settings?.waitSetting?.waitType : 'delay',
        intervalType: data?.bluePrint?.settings?.waitSetting?.intervalType || 0,
        seconds: data?.bluePrint?.settings?.waitSetting?.seconds || 30,
        minutes: data?.bluePrint?.settings?.waitSetting?.minutes || 10,
        hours: data?.bluePrint?.settings?.waitSetting?.hours || 1,
        days: data?.bluePrint?.settings?.waitSetting?.days || 1
    }), [data]);

    const methods = useForm({
        resolver: yupResolver(dynamicSchema),
        defaultValues
    });

    const {
        watch,
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit((formData) => {
        try {
            let payload = null;

            if (formData?.type === 'waitSetting') {
                payload = {
                    types: [
                        ...data?.bluePrint?.types ?? [],
                        'waitSetting'
                    ],
                    sourceNode: data.sourceNode,
                    targetNode: data.targetNode,
                    ...data.bluePrint,
                    waitSetting: formData
                }
            }

            data?.configureSettings?.(data.sourceNode, data.targetNode, payload);
            handleCloseModal();
        } catch (error) {
            console.error('Error while submitting data :', error);
        }
    });

    useEffect(() => {
        if (data?.bluePrint) {
            reset(defaultValues);
        }
    }, [data?.bluePrint, reset, defaultValues]);

    useEffect(() => {
        setDynamicSchema(getValidationSchema(values));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.type, values.waitType]);

    return (
        <CustomProcessDialogue
            isOpen={isOpen}
            handleCloseModal={handleCloseModal}
            title='Settings'
        >
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={12}>
                        <RHFSelect name='type' label='Setting'>
                            {(settingOptions?.length > 0)
                                ? settingOptions.map((type) => (
                                    <MenuItem key={type.value} value={type.value} disabled={type.isDisabled}>
                                        <Stack direction='row' spacing={1}>
                                            <Iconify icon={type.icon} width={18} />
                                            <Typography variant='body2'>{type.label}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))
                                : <MenuItem value=''>No settings found</MenuItem>
                            }
                        </RHFSelect>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Switch opt={values.type} onClose={handleCloseModal} />
                </Grid>
                {(data?.isProcessInstance !== true) && <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Add
                    </LoadingButton>
                </Stack>}
            </FormProvider>
        </CustomProcessDialogue>
    )
}

ReactFlowEdgeSettingPopup.propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    handleCloseModal: PropTypes.func
}