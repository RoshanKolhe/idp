/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {MenuItem} from '@mui/material';
import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hook';
import {useSnackbar} from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import axiosInstance, {workflowAxiosInstance} from 'src/utils/axios';

export default function WorkflowTemplateNewEditForm({currentWorkflowTemplate}) {
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const [workflowsData, setWorkflowsData] = useState([]);

  const statusOptions = [
    {label: 'Draft', value: 'draft'},
    {label: 'Published', value: 'published'},
    {label: 'Unpublished', value: 'unpublished'},
  ];

  const schema = Yup.object().shape({
    name: Yup.string().required('Template name is required'),
    description: Yup.string(),
    requirements: Yup.string(),
    image: Yup.mixed().required('Please upload image'),
    version: Yup.string().required('Version is required'),
    status: Yup.string().required('Status is required'),
    workflow: Yup.object().required('Please select workflow'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentWorkflowTemplate?.name || '',
      description: currentWorkflowTemplate?.description || '',
      requirements: currentWorkflowTemplate?.requirements || '',
      image: currentWorkflowTemplate?.image
        ? {
            ...currentWorkflowTemplate.image,
            preview: currentWorkflowTemplate?.image?.fileUrl,
          }
        : null,
      version: currentWorkflowTemplate?.version || '',
      status: currentWorkflowTemplate?.status || 'draft',
      workflow: null,
    }),
    [currentWorkflowTemplate],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const onSubmit = handleSubmit(async formData => {
    try {
      const inputData = {
        name: formData.name,
        version: formData.version,
        workflowId: formData.workflow.id,
        status: formData.status,
        image: formData.image,
        isActive: true,
      };

      if (formData.description) inputData.description = formData.description;
      if (formData.requirements) inputData.requirements = formData.requirements;

      if (!currentWorkflowTemplate) {
        await workflowAxiosInstance.post('/workflow-templates', inputData);
      } else {
        await workflowAxiosInstance.patch(`/workflow-templates/${currentWorkflowTemplate.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentWorkflowTemplate ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.workflowTemplates.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error?.message || error.message, {
        variant: 'error',
      });
    }
  });

  const fetchWorkflows = async searchTerm => {
    try {
      if (!searchTerm) return;

      const filter = {
        where: {
          and: [{name: {regexp: `${searchTerm}`, options: "i"}}, {isActive: true}],
        },
      };

      const filterString = encodeURIComponent(JSON.stringify(filter));
      const {data} = await workflowAxiosInstance.get(`/workflows?filter=${filterString}`);
      setWorkflowsData(data);
    } catch (error) {
      console.error('error while fetching workflows', error);
    }
  };

  const handleDrop = useCallback(
    async acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/files', formData);
      const {data} = response;
      setValue('image', {
        fileUrl: data.files[0].fileUrl,
        fileName: data.files[0].fileName,
        size: data.files[0]?.size,
        preview: data.files[0].fileUrl,
      });
    },
    [setValue],
  );

  const handleRemoveFile = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

  useEffect(() => {
    if (currentWorkflowTemplate) {
      reset(defaultValues);
      setValue('workflow', currentWorkflowTemplate?.workflow || null);
      setWorkflowsData(prev =>
        currentWorkflowTemplate?.workflow && !prev.find(item => item.id === currentWorkflowTemplate.workflow.id)
          ? [...prev, currentWorkflowTemplate.workflow]
          : prev,
      );
    }
  }, [currentWorkflowTemplate, defaultValues, reset, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{p: 3}}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <RHFTextField name="name" label="Template Name" />
              </Grid>

              <Grid xs={12} sm={6}>
                <RHFTextField name="version" label="Template Version" />
              </Grid>

              <Grid xs={12} sm={6}>
                <RHFAutocomplete
                  name="workflow"
                  label="Select Workflow *"
                  options={workflowsData || []}
                  onInputChange={(event, value) => fetchWorkflows(value)}
                  getOptionLabel={option => `${option?.name || ''}`}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  filterOptions={(options, {inputValue}) =>
                    options?.filter(option =>
                      option?.name?.toLowerCase().includes(inputValue?.toLowerCase()),
                    )
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {option?.name}
                        </Typography>
                        {option?.description ? (
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        ) : null}
                      </div>
                    </li>
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <RHFSelect name="status" label="Status">
                  {statusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="description" label="Description" multiline rows={3} />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="requirements" label="Requirements" multiline rows={3} />
              </Grid>

              <Grid xs={12}>
                <Typography variant="subtitle2" sx={{mb: 1.5}}>
                  Template Image
                </Typography>
                <RHFUpload
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{mt: 3}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentWorkflowTemplate ? 'Save Changes' : 'Create Workflow Template'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

WorkflowTemplateNewEditForm.propTypes = {
  currentWorkflowTemplate: PropTypes.object,
};
