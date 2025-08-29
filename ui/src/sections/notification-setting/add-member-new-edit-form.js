/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Unstable_Grid2';
// routes
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
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
import { useGetFilteredLevels } from 'src/api/levels';
// components


export default function AddMemberNewEditForm({ currentMember, open, onClose, refreshLevels }) {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const filter = {
    where: {
      escalationId: Number(id)
    }
  };
  const filterString = encodeURIComponent(JSON.stringify(filter));
  const { levels, levelsEmpty } = useGetFilteredLevels(filterString);

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
    avatarUrl: Yup.mixed().nullable(),
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
    formState: { isSubmitting, errors },
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
        avatarUrl: formData.avatarUrl
          ? { fileUrl: formData.avatarUrl }
          : null,
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
      refreshLevels();
      onClose();

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

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        console.log(data);
        setValue('avatarUrl', data?.files[0].fileUrl, {
          shouldValidate: true,
        });
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
        {currentMember ? 'Edit Member' : 'Add New Member'}
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
                  <Controller
                    name="phoneNumber"
                    control={methods.control}
                    render={({ field }) => (
                      <>
                        <PhoneInput
                          country="in"
                          value={field.value}
                          onChange={(phoneNumber) => field.onChange(phoneNumber)}
                          inputProps={{
                            autoComplete: 'on',
                            autoFocus: true,
                          }}
                          inputStyle={{
                            width: '100%',
                            height: '40px',
                          }}
                        />
                        {errors.phoneNumber && (
                          <Box sx={{ color: '#FF5630', fontSize: '0.75rem' }}>
                            {errors.phoneNumber.message}
                          </Box>
                        )}
                      </>
                    )}
                  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {currentMember ? 'Save Changes' : 'Add Member'}
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
  refreshLevels: PropTypes.func
};
