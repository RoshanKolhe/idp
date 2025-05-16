import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import Card from '@mui/material/Card';

import Grid from '@mui/material/Unstable_Grid2';

// utils

// routes

// assets

// components

import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';

// ----------------------------------------------------------------------

export default function FileTypeViewForm({ currentFileType }) {
  const NewFileTypeSchema = Yup.object().shape({
    fileType: Yup.string().required('File Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      fileType: currentFileType?.fileType || '',
      description: currentFileType?.description || '',
      isActive: currentFileType?.isActive ? '1' : '0' || '1',
    }),
    [currentFileType]
  );

  const methods = useForm({
    resolver: yupResolver(NewFileTypeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentFileType) {
      reset(defaultValues);
    }
  }, [currentFileType, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentFileType && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status" disabled>
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
                <RHFTextField name="fileType" label="File Type" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

FileTypeViewForm.propTypes = {
  currentFileType: PropTypes.object,
};
