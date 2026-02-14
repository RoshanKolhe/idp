import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import Card from '@mui/material/Card';

import Grid from '@mui/material/Unstable_Grid2';

// utils

// routes

// assets

// components

import FormProvider, { RHFTextField, RHFSelect, RHFUpload, RHFAutocomplete } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';

// ----------------------------------------------------------------------

export default function ProcessTemplateViewForm({ currentProcessTemplate }) {
  const [processesData, setProcessesData] = useState([]);
  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Unpublished', value: 'unpublished' },
  ];
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
    formState: { isSubmitting },
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit((formData) => {
    console.log('formData');
  })

  useEffect(() => {
    if (currentProcessTemplate) {
      reset(defaultValues);
    }
  }, [currentProcessTemplate, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField disabled name="name" label="Template Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField disabled name="version" label="Template Version" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
                  disabled
                  name="process"
                  label="Select Process *"
                  options={processesData || []}
                  onInputChange={(event) => console.log(event?.target?.value)}
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
                <RHFSelect disabled name='status' label='Status'>
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={12}>
                <RHFUpload
                  disabled
                  accept={{
                    'image/*': [],
                  }}
                  name="image"
                  maxSize={3145728}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <RHFTextField disabled multiline rows={3} name="description" label="Description" />
              </Grid>

              <Grid item xs={12} sm={12}>
                <RHFTextField disabled multiline rows={3} name="requirements" label="Requirements" />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProcessTemplateViewForm.propTypes = {
  currentProcessTemplate: PropTypes.object,
};
