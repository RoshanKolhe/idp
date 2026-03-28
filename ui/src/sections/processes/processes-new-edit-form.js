/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { useGetProcessTypes } from 'src/api/processType';

// ----------------------------------------------------------------------

export default function ProcessesNewEditForm({ currentProcesses, refreshProcesses }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { processTypes } = useGetProcessTypes();
  const [processTypeOptions, setProcessTypeOptions] = useState([]);

  const NewProcessesSchema = Yup.object().shape({
    name: Yup.string()
      .required('Process name is required')
      .max(50, 'Maximum 50 characters allowed')
      .matches(/^[A-Za-z0-9_ ]+$/, 'Only letters, numbers and underscore (_) are allowed'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProcesses?.name || '',
      description: currentProcesses?.description || '',
      isActive: currentProcesses ? (currentProcesses?.isActive ? '1' : '0') : '1',
      processType: currentProcesses?.processType || '',
    }),
    [currentProcesses]
  );

  const methods = useForm({
    resolver: yupResolver(NewProcessesSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);

      const inputData = {
        name: formData.name,
        description: formData.description,
        isActive: currentProcesses ? formData.isActive : true,
        processTypeId: formData.processType?.id,
      };

      if (!currentProcesses) {
        await axiosInstance.post('/processes', inputData);
      } else {
        await axiosInstance.patch(`/processes/${currentProcesses.id}`, inputData);
      }
      refreshProcesses();
      reset();
      enqueueSnackbar(currentProcesses ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.processes.list);
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

  useEffect(() => {
    if (processTypes) {
      const activeProcessTypes = processTypes.filter(
        (item) => item.isActive === true
      );
      setProcessTypeOptions(activeProcessTypes);
    }
  }, [processTypes]);

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
                <RHFTextField name="name" label="Process Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
                  name="processType"
                  label="Process Type"
                  options={processTypeOptions}
                  getOptionLabel={(option) => `${option?.processType}` || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {`${option?.processType}`}
                        </Typography>
                      </div>
                    </li>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="primary">
                {!currentProcesses ? 'Create Process' : 'Save Changes'}
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
  refreshProcesses: PropTypes.func,
};
