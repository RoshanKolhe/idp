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
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DocumentTypeViewForm({ currentDocumentType }) {
  const NewDocumentTypeSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: currentDocumentType?.documentType || '',
      description: currentDocumentType?.description || '',
      isActive: currentDocumentType?.isActive ? '1' : '0' || '1',
      sampleDocument: currentDocumentType?.sampleDocument || null,
    }),
    [currentDocumentType]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDocumentType) {
      reset(defaultValues);
    }
  }, [currentDocumentType, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentDocumentType && (
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
                <RHFTextField name="documentType" label="Document Type" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" disabled />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Sample Document</Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 2,
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      mb: '10px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Iconify icon="material-symbols:insert-drive-file" width={24} />
                      <Typography variant="body2">
                        {values?.sampleDocument?.fileName} ({((values?.sampleDocument?.size || 0) / 1024).toFixed(1)} KB)
                      </Typography>
                    </Box>

                    {/* Optional Preview Link */}
                    <Typography variant="body2">
                      <a href={values.sampleDocument.fileUrl} target="_blank" rel="noopener noreferrer">
                        View / Download File
                      </a>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DocumentTypeViewForm.propTypes = {
  currentDocumentType: PropTypes.object,
};
