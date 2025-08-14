import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Grid,
  Stack,
  Card,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// utils
import { fData } from 'src/utils/format-number';
// components
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import axiosInstance from 'src/utils/axios';
import { reset } from 'numeral';
import { paths } from 'src/routes/paths';


export default function AddLevelNewForm({ open, onClose, currentLevel}) {

  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();

  const AddLevelSchema = Yup.object().shape({
    name: Yup.string().required('Level is required'),
    description: Yup.string(),
  })



const defaultValues = useMemo(
    () => ({
      name: currentLevel?.name || '',
      description: currentLevel?.description || '',

    }),
    [currentLevel]
  );

  const methods = useForm({
    resolver: yupResolver(AddLevelSchema),
    defaultValues,
  });


  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        name: formData.name,
        description: formData.description,
      };

      if (!currentLevel) {
        await axiosInstance.post('/levels', inputData);
      } else {
        await axiosInstance.patch(`/levels/${currentLevel.id}`, inputData);
            console.log("Saved member:", inputData.data);
      }
      reset();
      enqueueSnackbar(currentLevel ? 'Update success!' : 'Create success!', { variant: 'success' });
      router.push(paths.dashboard.notificationSetting.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  return (

    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ color: 'black' }}>
        Add New Level
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
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Level" />
                <RHFTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={3}
                />
              </Stack>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Add Level
                </LoadingButton>
              </Stack>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

AddLevelNewForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentLevel: PropTypes.object,
};
