import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFUpload,
  RHFUploadAvatar,
} from 'src/components/hook-form';

import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
// @mui

import {

  Dialog,

  DialogTitle,
  DialogContent,

  IconButton,
  Box, Button, MenuItem, Typography
} from '@mui/material';


// utils
import { fData } from 'src/utils/format-number';
import { useGetLevels } from 'src/api/levels';
// components


export default function AddMemberNewEditForm({ currentMember, open, onClose }) {

  const router = useRouter();
  const { levels, levelsEmpty } = useGetLevels();

  console.log("Levels data:", levels, levelsEmpty);

  const [levelsData, setLevelsData] = useState([]);

  useEffect(() => {
    if (levels && levels.length > 0) {
      setLevelsData(levels);
    } else {
      setLevelsData([]);
    }
  }, [levels]);

  const { enqueueSnackbar } = useSnackbar();

  const MemberSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    levelsId: Yup.string().required('Level is required'),
    avatarUrl: Yup.mixed().nullable().required('Avatar is required'),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentMember?.fullName || '',
      email: currentMember?.email || '',
      phoneNumber: currentMember?.phoneNumber || '',
      levelsId: currentMember?.levelsId || '',
      avatarUrl: currentMember?.avatarUrl || null,

    }),
    [currentMember]
  );

  const methods = useForm({
    resolver: yupResolver(MemberSchema),
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
      // when file uploaded
      // and in onSubmit
      const inputData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        avatarUrl: formData.avatarUrl, 
        levelsId: Number(formData.levelsId),
      };


      if (!currentMember) {
        await axiosInstance.post('/members', inputData);
      } else {
        await axiosInstance.patch(`/members/${currentMember.id}`, inputData);
        console.log("Saved member:", inputData.data);
      }
      reset();
      enqueueSnackbar(currentMember ? 'Update success!' : 'Create success!', { variant: 'success' });
      router.push(paths.dashboard.notificationSetting.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentMember) {
      reset(defaultValues);
    }
  }, [currentMember, defaultValues, reset]);

const handleDrop = useCallback(
  async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/files', formData); 
      const uploadedFileUrl = response.data.files[0].fileUrl;

      setValue('avatarUrl', { fileUrl: uploadedFileUrl }, { shouldValidate: true });
    } catch (error) {
      console.error('File upload failed:', error);
    }
  },
  [setValue]
);


  const handleRemoveFile = useCallback(() => {
    setValue('avatarUrl', null);
  }, [setValue]);


  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        Add New Member
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
          <Grid container spacing={3}>
            {/* Avatar Section */}
            <Grid item xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                <RHFUploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>

            {/* Input Fields Section */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFSelect name="levelsId" label="Level">
                    {levels && levels.length > 0
                      ? levelsData.map((level) => (
                        <MenuItem key={level.id} value={String(level.id)}>
                          {level.name}
                        </MenuItem>
                      ))
                      : <MenuItem disabled>No Levels Available</MenuItem>}
                  </RHFSelect>



                  {/* <RHFTextField name="search" label="Search Name" /> */}
                  <RHFTextField name="fullName" label="Full Name" />
                  <RHFTextField name="email" label="Email Address" />
                  <RHFTextField name="phoneNumber" label="Phone Number" />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Add Member
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

AddMemberNewEditForm.propTypes = {
  currentMember: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
