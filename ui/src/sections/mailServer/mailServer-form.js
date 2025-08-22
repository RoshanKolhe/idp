/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import axiosInstance from 'src/utils/axios';

const SECURITY_OPTIONS = [
  { id: 'tls', name: 'TLS' },
  { id: 'ssl', name: 'SSL' },
];

export default function MailServerForm({ currentMailServer }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Validation Schema
  const MailServerSchema = Yup.object().shape({
    smtpServer: Yup.string().required('SMTP server address is required'),
    port: Yup.number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : Number(originalValue)
      )
      .typeError('Port number must be a number')
      .required('Port number is required'),
    securityProtocol: Yup.string().required('Encryption protocol is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    senderEmail: Yup.string().email('Invalid email').required('Sender email is required'),
    testEmailAddress: Yup.string().email('Invalid email').required('Test email is required'),
  });

  // Default form values
  const defaultValues = useMemo(
    () => ({
      id: currentMailServer?.id || '',
      smtpServer: currentMailServer?.smtpServer || '',
      port: currentMailServer?.port?.toString() || '',
      securityProtocol: currentMailServer?.securityProtocol || '',
      username: currentMailServer?.username || '',
      password: currentMailServer?.password || '',
      senderEmail: currentMailServer?.senderEmail || '',
      testEmailAddress: currentMailServer?.testEmailAddress || '',
    }),
    [currentMailServer]
  );

  const methods = useForm({
    resolver: yupResolver(MailServerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Fetch existing mail server config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // If you know the ID already, replace 1 with that ID, or fetch the first record
        const response = await axiosInstance.get('/mail-servers/1');
        if (response.data) {
          reset({
            id: response.data.id || '',
            smtpServer: response.data.smtpServer || '',
            port: response.data.port?.toString() || '',
            securityProtocol: response.data.securityProtocol || '',
            username: response.data.username || '',
            password: '', // keep blank for security
            senderEmail: response.data.senderEmail || '',
            testEmailAddress: response.data.testEmailAddress || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch mail server config:', error);
      }
    };
    fetchConfig();
  }, [reset]);

  // Submit handler
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { id, ...payloadWithoutId } = formData; // Remove id from body
      const payload = {
        smtpServer: payloadWithoutId.smtpServer.trim(),
        port: Number(payloadWithoutId.port),
        securityProtocol: payloadWithoutId.securityProtocol,
        username: payloadWithoutId.username.trim(),
        password: payloadWithoutId.password.trim(),
        senderEmail: payloadWithoutId.senderEmail.trim(),
        testEmailAddress: payloadWithoutId.testEmailAddress.trim(),
      };

      if (id) {
        await axiosInstance.patch(`/mail-servers/${id}`, payload);
        enqueueSnackbar('Mail server updated successfully!');
      } else {
        enqueueSnackbar('No existing mail server ID found to update', { variant: 'warning' });
      }

      router.push(paths.dashboard.mailServer.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Something went wrong', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mail Server Configuration
        </Typography>

        <Grid container spacing={3}>
          {/* Hidden ID field for form state */}
          <RHFTextField name="id" type="hidden" sx={{ display: 'none' }} />

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="smtpServer"
              label="SMTP Server"
              placeholder="Enter the address of the SMTP server"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="port"
              label="Port"
              placeholder="Enter the port number (e.g. 25, 465, 587)"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="securityProtocol"
              label="Security Protocol"
              placeholder="Select encryption protocol for the connection"
              options={SECURITY_OPTIONS}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              value={
                SECURITY_OPTIONS.find(
                  (opt) => opt.id === watch('securityProtocol')
                ) || null
              }
              onChange={(e, newValue) =>
                setValue('securityProtocol', newValue?.id || '')
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="username"
              label="Username"
              placeholder="Enter the username for authenticating the SMTP server"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="password"
              label="Password"
              placeholder="Enter the password for SMTP authentication"
              type="password"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="senderEmail"
              label="Sender Email"
              placeholder="Enter the email address that will appear as the sender"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="testEmailAddress"
              label="Test Email Address"
              placeholder="Provide an email to send a test email for verification"
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: '30px',
              border: '2px solid #4182EB',
              color: '#4182EB',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              height: 40,
              '&:hover': {
                border: '2px solid #3069c6',
                color: '#3069c6',
                backgroundColor: 'transparent',
              },
            }}
          >
            Test Configuration
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              borderRadius: '30px',
              backgroundColor: '#4182EB',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              height: 40,
              '&:hover': {
                backgroundColor: '#3069c6',
              },
            }}
          >
            Save Configuration
          </LoadingButton>
        </Stack>
      </Box>
    </FormProvider>
  );
}

MailServerForm.propTypes = {
  currentMailServer: PropTypes.object,
};
