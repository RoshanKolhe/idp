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

const defaultValues = {
  level: '',
  search: '',
  name: '',
  email: '',
  phoneNumber: '',
};

const AddMemberSchema = Yup.object().shape({
  level: Yup.string().required('Level is required'),
  description: Yup.string(),
 
});

export default function AddLevelNewForm({ open, onClose, onSubmitForm }) {
  const methods = useForm({
    resolver: yupResolver(AddMemberSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (onSubmitForm) {
        await onSubmitForm(data);
      }
      console.log('Submitted data:', data);
      onClose(); // close dialog after submit
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{color: 'black'}}>
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
          <Iconify icon="mdi:close" color="black"/>
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="level" label="Level" />
                  <RHFTextField name="description" label="Description" />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }} >
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Add Level
                  </LoadingButton>
                </Stack>
          
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

AddLevelNewForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmitForm: PropTypes.func,
};
