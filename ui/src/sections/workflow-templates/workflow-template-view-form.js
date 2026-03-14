import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, MenuItem, Typography } from '@mui/material';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { MultiFilePreview } from 'src/components/upload';

export default function WorkflowTemplateViewForm({ currentWorkflowTemplate }) {
  const schema = Yup.object().shape({
    name: Yup.string().required('Template name is required'),
    description: Yup.string(),
    requirements: Yup.string(),
    version: Yup.string().required('Version is required'),
    status: Yup.string().required('Status is required'),
    workflowName: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentWorkflowTemplate?.name || '',
      description: currentWorkflowTemplate?.description || '',
      requirements: currentWorkflowTemplate?.requirements || '',
      version: currentWorkflowTemplate?.version || '',
      status: currentWorkflowTemplate?.status || 'draft',
      workflowName: currentWorkflowTemplate?.workflow?.name || '',
      image: currentWorkflowTemplate?.image
        ? {
          ...currentWorkflowTemplate.image,
          preview: currentWorkflowTemplate?.image?.fileUrl,
        }
        : null,
    }),
    [currentWorkflowTemplate],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, watch } = methods;

  const values= watch();

  useEffect(() => {
    if (currentWorkflowTemplate) {
      reset(defaultValues);
    }
  }, [currentWorkflowTemplate, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <RHFTextField name="name" label="Template Name" disabled />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFTextField name="version" label="Template Version" disabled />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFTextField name="workflowName" label="Workflow" disabled />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFSelect name="status" label="Status" disabled>
                  {['draft', 'published', 'unpublished'].map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="description" label="Description" multiline rows={3} disabled />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="requirements" label="Requirements" multiline rows={3} disabled />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant='subtitle2' sx={{ color: 'text.disabled' }}>Thumbnail image</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {values.image && <MultiFilePreview thumbnail files={[values.image]} />}
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

WorkflowTemplateViewForm.propTypes = {
  currentWorkflowTemplate: PropTypes.object,
};
