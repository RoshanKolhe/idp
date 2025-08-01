/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { IconButton, InputAdornment, MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function ProcessesNewEditForm({ currentProcesses }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProcessesSchema = Yup.object().shape({
    processes: Yup.string().required('Process Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      processes: currentProcesses?.processes || '',
      description: currentProcesses?.description || '',
      isActive: currentProcesses ? (currentProcesses?.isActive ? '1' : '0') : '1',
    }),
    [currentProcesses]
  );

  const methods = useForm({
    resolver: yupResolver(NewProcessesSchema),
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
      console.info('DATA', formData);

      const inputData = {
        processes: formData.processes,
        description: formData.description,
        isActive: currentProcesses ? formData.isActive : true,
      };

      if (!currentProcesses) {
        await axiosInstance.post('/process-types', inputData);
      } else {
        await axiosInstance.patch(`/process-types/${currentProcesses.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentProcesses ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.processes.reactFlow);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentProcesses) {
      reset(defaultValues);
    }
  }, [currentProcesses, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentProcesses && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status">
                      {COMMON_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              <Grid item xs={12} sm={6}>
                <RHFTextField name="processes" label="Process Type" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentProcesses ? 'Create Process Type' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProcessesNewEditForm.propTypes = {
  currentProcesses: PropTypes.object,
};
