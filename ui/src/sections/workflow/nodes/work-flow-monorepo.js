import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import { getAgentById } from '@repo/idp-agents';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { AuthenticatorField } from 'src/sections/authenticator';
import { CustomWorkflowDialogue, CustomWorkflowNode } from '../components';

function buildValidationSchema(configFields = [], authenticator) {
  const configShape = configFields.reduce((accumulator, field) => {
    let validator = Yup.string();

    if (field.required) {
      validator = validator.required(`${field.label || field.name} is required`);
    }

    accumulator[field.name] = validator;
    return accumulator;
  }, {});

  const tokenField = authenticator?.output?.tokenField;
  const authShape = authenticator?.required && tokenField
    ? {
        [tokenField]: Yup.string().required('Google authentication is required'),
      }
    : {};

  return Yup.object().shape({
    config: Yup.object().shape(configShape),
    auth: Yup.object().shape(authShape),
  });
}

export default function WorkFlowMonorepo({ data }) {
  const [open, setOpen] = useState(false);

  const agentId = data?.agentId || data?.bluePrint?.agentId || null;
  const agentData = agentId ? getAgentById(agentId) : null;
  const authenticator = agentData?.authenticator;

  const validationSchema = useMemo(
    () => buildValidationSchema(agentData?.configFields || [], authenticator),
    [agentData?.configFields, authenticator]
  );

  const defaultValues = useMemo(
    () => ({
      config: (agentData?.configFields || []).reduce((accumulator, field) => {
        accumulator[field.name] =
          data?.bluePrint?.config?.[field.name] ??
          agentData?.defaultValues?.[field.name] ??
          '';
        return accumulator;
      }, {}),
      auth: data?.bluePrint?.auth || {},
    }),
    [agentData?.configFields, agentData?.defaultValues, data?.bluePrint]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const authValue = watch('auth');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAuthenticatorChange = (nextAuthValue) => {
    setValue('auth', nextAuthValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit(async (formData) => {
    data.functions.handleBluePrintComponent(data.label, data.id, {
      agentId,
      config: formData.config,
      auth: formData.auth,
      execution: agentData.execution,
    });

    handleClose();
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  if (!agentData) {
    return (
      <Box component="div">
        <Typography color="error">Agent Not Found</Typography>
      </Box>
    );
  }

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">
        <Box component="div" onClick={handleOpen} sx={{ cursor: 'pointer' }}>
          <CustomWorkflowNode data={{ ...data, label: agentData.name }} />
        </Box>

        <CustomWorkflowDialogue
          isOpen={open}
          handleCloseModal={handleClose}
          title={agentData.title || agentData.name || 'Agent'}
          color={data.bgColor}
        >
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2}>
              {agentData.description ? (
                <Typography variant="body2" color="text.secondary">
                  {agentData.description}
                </Typography>
              ) : null}

              {agentData.configFields?.map((field) => (
                <RHFTextField
                  key={field.name}
                  name={`config.${field.name}`}
                  label={field.label}
                  placeholder={field.placeholder || ''}
                  required={field.required}
                  fullWidth
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 4 : 1}
                  type={field.type === 'password' ? 'password' : 'text'}
                />
              ))}

              <AuthenticatorField
                authenticator={authenticator}
                value={authValue}
                onChange={handleAuthenticatorChange}
                agentName={agentData.name}
              />
            </Stack>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                mt: 2,
              }}
            >
              <LoadingButton
                sx={{ backgroundColor: data.bgColor, borderColor: data.borderColor }}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </Box>
          </FormProvider>
        </CustomWorkflowDialogue>
      </Stack>
    </Box>
  );
}

WorkFlowMonorepo.propTypes = {
  data: PropTypes.object.isRequired,
};
