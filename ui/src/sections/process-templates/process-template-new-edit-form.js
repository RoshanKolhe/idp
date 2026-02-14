/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFUpload,
  RHFSelect,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProcessTemplateNewEditForm({ currentProcessTemplate }) {
  const router = useRouter();
  const [processesData, setProcessesData] = useState([]);
  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Unpublished', value: 'unpublished' },
  ];
  const { enqueueSnackbar } = useSnackbar();

  const NewProcessTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Process Type is required'),
    description: Yup.string(),
    requirements: Yup.string(),
    image: Yup.mixed().required('Please upload image'),
    version: Yup.string().required('Version is required'),
    status: Yup.string().required('Status is required'),
    process: Yup.object().required("Please select process"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProcessTemplate?.name || '',
      description: currentProcessTemplate?.description || '',
      requirements: currentProcessTemplate?.requirements || '',
      image: currentProcessTemplate?.image ? {
        ...currentProcessTemplate?.image,
        preview: currentProcessTemplate?.image?.fileUrl
      } : null,
      version: currentProcessTemplate?.version || '',
      status: currentProcessTemplate?.status || 'draft',
      process: null,
    }),
    [currentProcessTemplate]
  );

  const methods = useForm({
    resolver: yupResolver(NewProcessTemplateSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        name: formData.name,
        version: formData.version,
        processesId: formData.process.id,
        status: formData.status,
        image: formData.image
      };

      if (formData.description) {
        inputData.description = formData.description
      }

      if (formData.requirements) {
        inputData.requirements = formData.requirements
      }

      if (!currentProcessTemplate) {
        await axiosInstance.post('/process-templates', inputData);
      } else {
        await axiosInstance.patch(`/process-templates/${currentProcessTemplate.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentProcessTemplate ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.processTemplates.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  const fetchProcesses = async (searchTerm) => {
    try {
      console.log(searchTerm);
      if (searchTerm.length > 0) {
        const filter = {
          where: {
            and: [
              { name: { like: `%${searchTerm || ''}%` } },
              { isActive: true }
            ]
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

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        setValue('image', {
          fileUrl: data.files[0].fileUrl,
          fileName: data.files[0].fileName,
          size: data.files[0]?.size,
          preview: data.files[0].fileUrl
        });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

  useEffect(() => {
    if (currentProcessTemplate) {
      reset(defaultValues);
      setValue('process', currentProcessTemplate?.processes ? currentProcessTemplate?.processes : null);
      setProcessesData((prev) => [...prev, currentProcessTemplate?.processes]);
    }
  }, [currentProcessTemplate, defaultValues, reset, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="name" label="Template Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="version" label="Template Version" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
                  name="process"
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

              <Grid item xs={12} sm={6}>
                <RHFSelect name='status' label='Status'>
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={12}>
                <RHFUpload
                  accept={{
                    'image/*': [],
                  }}
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <RHFTextField multiline rows={3} name="description" label="Description" />
              </Grid>

              <Grid item xs={12} sm={12}>
                <RHFTextField multiline rows={3} name="requirements" label="Requirements" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentProcessTemplate ? 'Create Process Template' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProcessTemplateNewEditForm.propTypes = {
  currentProcessTemplate: PropTypes.object,
};
