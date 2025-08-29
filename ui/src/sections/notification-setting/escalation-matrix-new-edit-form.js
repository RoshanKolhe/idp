/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';

export default function EscalationMatrixNewEditForm({ currentMatrix, open, onClose, refreshEscalations }) {
  const { enqueueSnackbar } = useSnackbar();

  const MemberSchema = Yup.object().shape({
    escalationName: Yup.string().required('Full name is required'),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      escalationName: currentMatrix?.escalationName || '',
      description: currentMatrix?.description || '',
    }),
    [currentMatrix]
  );

  const methods = useForm({
    resolver: yupResolver(MemberSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        escalationName: formData.escalationName,
        description: formData.description,
      };

      if (!currentMatrix) {
        await axiosInstance.post('/escalations', inputData);
      } else {
        await axiosInstance.patch(`/escalations/${currentMatrix.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentMatrix ? 'Update success!' : 'Create success!', { variant: 'success' });
      refreshEscalations();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error?.message || 'Error', {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [currentMatrix, defaultValues, reset]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        {currentMatrix ? 'Edit Escalation Matrix' : 'Add New Escalation Matrix'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="mdi:close" color="black" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <RHFTextField name="escalationName" label="Escalation Name" />
                <RHFTextField name="description" label="Description" multiline minRows={3} />
              </Stack>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {currentMatrix ? 'Update Matrix' : 'Add Matrix'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

EscalationMatrixNewEditForm.propTypes = {
  currentMatrix: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refreshEscalations: PropTypes.func,
};
