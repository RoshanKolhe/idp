import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useEffect, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import {MenuItem} from '@mui/material';
import FormProvider, {RHFSelect, RHFTextField} from 'src/components/hook-form';

export default function WorkflowTemplateViewForm({currentWorkflowTemplate}) {
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
    }),
    [currentWorkflowTemplate],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {reset} = methods;

  useEffect(() => {
    if (currentWorkflowTemplate) {
      reset(defaultValues);
    }
  }, [currentWorkflowTemplate, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{p: 3}}>
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
