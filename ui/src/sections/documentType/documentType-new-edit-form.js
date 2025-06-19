/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
} from 'src/components/hook-form';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function DocumentTypeNewEditForm({ currentDocumentType }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewDocumentTypeSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    sampleDocument: Yup.object().required('Sample Document is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: currentDocumentType?.documentType || '',
      description: currentDocumentType?.description || '',
      sampleDocument: currentDocumentType?.sampleDocument || null,
      isActive: currentDocumentType ? (currentDocumentType?.isActive ? '1' : '0') : '1',
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
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        documentType: formData.documentType,
        description: formData.description,
        sampleDocument: formData.sampleDocument,
        isActive: currentDocumentType ? formData.isActive : true,
      };

      if (!currentDocumentType) {
        await axiosInstance.post('/document-types', inputData);
      } else {
        await axiosInstance.patch(`/document-types/${currentDocumentType.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentDocumentType ? 'Update success!' : 'Create success!', { variant: 'success' });
      router.push(paths.dashboard.documentType.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentDocumentType) {
      reset(defaultValues);
    }
  }, [currentDocumentType, defaultValues, reset]);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
     const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        setValue('sampleDocument', {
          fileUrl: data.files[0].fileUrl,
          fileName: data.files[0].fileName,
          size: data.files[0]?.size
        });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('sampleDocument', null);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentDocumentType && (
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
                <RHFTextField name="documentType" label="Document Type" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label="Description" />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Sample Document</Typography>
                  {!values.sampleDocument  ? <RHFUpload
                    accept={{
                      'application/pdf': [],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                    }}
                    name="sampleDocument"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  /> : (
                      <Box sx={{ px: 2, py: 2, border: '1px dashed #ccc', borderRadius: 2, mb: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Iconify icon="material-symbols:insert-drive-file" width={24} />
                    <Typography variant="body2">
                      {values.sampleDocument.fileName} ({(values.sampleDocument.size / 1024).toFixed(1)} KB)
                    </Typography>
                  </Box>

                  {/* Optional Preview Link */}
                  <Typography variant="body2">
                    <a href={values.sampleDocument.fileUrl} target="_blank" rel="noopener noreferrer">
                      View / Download File
                    </a>
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleRemoveFile()} // reset state to show upload again
                  >
                    Remove File
                  </Button>
                </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentDocumentType ? 'Create Document Type' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DocumentTypeNewEditForm.propTypes = {
  currentDocumentType: PropTypes.object,
};
