import { Box, Grid, MenuItem, Stack } from "@mui/material"
import PropTypes from "prop-types"
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import { CustomWorkflowDialogue, CustomWorkflowNode } from "../components"
import { HubSpotScreen } from "../crm-components/screens";

// CRM options
const crmOptions = [
    { label: 'HubSpot', value: 'hubspot', isDisabled: false },
];

// Hubspot task schemas
const hubSpotTaskSchemas = {
    1: Yup.object().shape({
        contactTask: Yup.number().required("Please select contact task"),
        contactDetails: Yup.object().when("contactTask", {
            is: 3,
            then: (shape) => shape.shape({
                firstname: Yup.string().required("First name is required"),
                lastname: Yup.string().required("Last name is required"),
                email: Yup.string()
                    .required("Email is required")
                    .test(
                        "email-or-variable",
                        "Please enter a valid email or variable ({{variable}})",
                        (value) => {
                            if (!value) return false;

                            const variablePattern = /^\{\{.*\}\}$/;
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                            return variablePattern.test(value) || emailPattern.test(value);
                        }
                    ),
                phone: Yup.string().required("Phone number is required"),
            }),
            otherwise: (shape) => shape.notRequired(),
        }),
    }),
};

// CRM schemas
const getCRMSchemas = (values) => {
    const { crmType } = values;

    switch (crmType) {
        case "hubspot":
            return {
                hubspot: Yup.object().shape({
                    connectionDetails: Yup.array()
                        .of(
                            Yup.object().shape({
                                connectionId: Yup.string().required("Connection ID is required"),
                                isConnectionEstablished: Yup.boolean()
                                    .oneOf([true, false], "Field is required")
                                    .required("Connection status is required"),
                                connectionName: Yup.string()
                                    .trim()
                                    .required("Connection Name is required"),
                                connectionType: Yup.string()
                                    .trim()
                                    .required("Connection Type is required"),
                            })
                        )
                        .min(1, "At least one connection detail is required")
                        .required("Connection details are required"),

                    selectedConnection: Yup.string().required("Please select connection"),
                    hubspotTask: Yup.number().required("Please select task"),

                    ...(hubSpotTaskSchemas[values.hubspotTask]?.fields || {}),
                }),
            };

        default:
            return {};
    }
};

// switch case functions
function Switch({ opt, variables }) {
    let component;

    switch (opt) {
        case 'hubspot':
            component = <HubSpotScreen variables={variables} />;
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
    variables: PropTypes.array,
}

// get validation schema
const getValidationSchema = (values) => {
    const { crmType } = values;
    const crmSchemas = getCRMSchemas(values);
    return Yup.object().shape({
        crmType: Yup.string().required("CRM Type is required"),
        ...(crmSchemas[crmType] ? crmSchemas[crmType].fields : {}),
    });
};

export default function WorkFlowCRM({ data }) {
    const [open, setOpen] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(getValidationSchema(''));
    const [variables, setVariables] = useState([]);

    const defaultValues = useMemo(
        () => ({
            crmType: data.bluePrint?.crmType || '',
            connectionDetails: data.bluePrint?.connectionDetails || [],
            selectedConnection: data.bluePrint?.selectedConnection || '',
            hubspotTask: data.bluePrint?.hubspotTask || 1,
            contactTask: data.bluePrint?.contactTask || 1,
            contactDetails: data.bluePrint?.contactDetails || 1,
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

    const onSubmit = handleSubmit(async (formData) => {
        try {
            console.log("CRM Form Data:", formData);
            data.functions.handleBluePrintComponent(data.label, data.id, { ...formData });
            handleClose();
        } catch (error) {
            console.error('Error while submitting data for CRM node', error);
        }
    })

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setDynamicSchema(getValidationSchema(values));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.crmType, values.hubspotTask]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

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
                    onClick={() => { handleOpen() }}
                    sx={{ cursor: 'pointer' }}
                >
                    <CustomWorkflowNode data={data} />
                </Box>
                <CustomWorkflowDialogue isOpen={open} handleCloseModal={handleClose} title={values.crmType ? `CRM ${crmOptions.find((crm) => crm.value === values.crmType)?.label || ''}` : 'CRM'} color={data.bgColor}>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={12}>
                                <RHFSelect name='crmType' label='CRM Type'>
                                    {(crmOptions?.length > 0)
                                        ? crmOptions.map((crm) => (
                                            <MenuItem key={crm.value} value={crm.value} disabled={crm.isDisabled}>
                                                {crm.label}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value=''>No CRM found</MenuItem>
                                    }
                                </RHFSelect>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            <Switch opt={values.crmType} variables={variables} />
                        </Grid>
                    </FormProvider>
                </CustomWorkflowDialogue>
            </Stack>
        </Box>
    )
}

WorkFlowCRM.propTypes = {
    data: PropTypes.object,
}