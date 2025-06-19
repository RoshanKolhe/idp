/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export default function ProcessInstanceNewEditForm({ currentProcessInstance }) {
  const router = useRouter();
  const [processesData, setProcessesData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewProcessTypeSchema = Yup.object().shape({
    processInstanceName: Yup.string().required('Process Type is required'),
    processInstanceDescription: Yup.string(),
    processes: Yup.object().required("Please select process"),
  });

  const defaultValues = useMemo(
    () => ({
      processInstanceName: currentProcessInstance?.processInstanceName || '',
      processInstanceDescription: currentProcessInstance?.processInstanceDescription || '',
      processes: null,
    }),
    [currentProcessInstance]
  );

  const methods = useForm({
    resolver: yupResolver(NewProcessTypeSchema),
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
        processInstanceName: formData.processInstanceName,
        processInstanceDescription: formData.processInstanceDescription,
        processesId: formData.processes.id,
        isInstanceRunning: false,
        isActive: currentProcessInstance ? formData.isActive : true,
      };

      if (!currentProcessInstance) {
        await axiosInstance.post('/process-instances', inputData);
      } else {
        await axiosInstance.patch(`/process-instances/${currentProcessInstance.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentProcessInstance ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.processesInstance.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentProcessInstance) {
      reset(defaultValues);
      setValue('processes', currentProcessInstance?.processes ? currentProcessInstance?.processes : null);
      setProcessesData((prev) => [...prev, currentProcessInstance?.processes]);
    }
  }, [currentProcessInstance, defaultValues, reset, setValue]);

  const fetchProcesses = async (searchTerm) => {
    try {
      console.log(searchTerm);
      if (searchTerm.length > 0) {
        const filter = {
          where: {
            name: { like: `%${searchTerm || ''}%` }
          }
        }
        const filterString = encodeURIComponent(JSON.stringify(filter));
        const { data } = await axiosInstance.get(`/processes?filter=${filterString}`);
        setProcessesData(data);
      };
    } catch (error) {
      console.error('error while fetching processes', error);
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="processInstanceName" label="Process Instance Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
                  name="processes"
                  label="Select Process *"
                  options={processesData || []}
                  onInputChange={(event) => fetchProcesses(event?.target?.value)}
                  getOptionLabel={(option) => `${option?.name}` || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value.id}
                  filterOptions={(options, { inputValue }) =>
                    options?.filter((option) => option?.name?.toLowerCase().includes(inputValue?.toLowerCase()))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {`${option?.name}`}
                        </Typography>
                      </div>
                    </li>
                  )}

                />
              </Grid>
              
              <Grid item xs={12} sm={12}>
                <RHFTextField multiline rows={3} name="processInstanceDescription" label="Process Instance Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentProcessInstance ? 'Create Process Instance' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProcessInstanceNewEditForm.propTypes = {
  currentProcessInstance: PropTypes.object,
};
