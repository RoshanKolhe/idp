/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import { workflowAxiosInstance } from 'src/utils/axios';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function WorkflowNewEditForm({ currentWorkflow, refreshWorkFlow }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProcessesSchema = Yup.object().shape({
    name: Yup.string()
      .required('Workflow name is required')
      .max(50, 'Maximum 50 characters allowed')
      .matches(/^[A-Za-z0-9_ ]+$/, 'Only letters, numbers and underscore (_) are allowed'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentWorkflow?.name || '',
      description: currentWorkflow?.description || '',
      isActive: currentWorkflow ? (currentWorkflow?.isActive ? '1' : '0') : '1',
    }),
    [currentWorkflow]
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
        isActive: currentWorkflow ? formData.isActive : true,
      };

      if (!currentWorkflow) {
        await workflowAxiosInstance.post('/workflows', inputData);
      } else {
        await workflowAxiosInstance.patch(`/workflows/${currentWorkflow.id}`, inputData);
      }
      refreshWorkFlow();
      reset();
      enqueueSnackbar(currentWorkflow ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.workflow.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentWorkflow) {
      reset(defaultValues);
    }
  }, [currentWorkflow, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentWorkflow && (
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
                <RHFTextField name="name" label="Workflow Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton color="primary" type="submit" variant="contained" loading={isSubmitting}>
                {!currentWorkflow ? 'Create Process Type' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

WorkflowNewEditForm.propTypes = {
  currentWorkflow: PropTypes.object,
  refreshWorkFlow: PropTypes.func,
};
