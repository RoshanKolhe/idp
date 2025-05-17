import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { IconButton, Typography } from '@mui/material';
import { useGetProcessTypes } from 'src/api/processType';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function ProcessesCreateForm({ currentProcess, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [processTypeOptions, setProcessTypeOptions] = useState([]);

  const { processTypes, processTypesLoading, processTypesEmpty, refreshProcessTypes } =
    useGetProcessTypes();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    processType: Yup.object().required('Customer Name is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProcess?.name || '',
      description: currentProcess?.description || '',
      processType: currentProcess?.processType || null,
    }),
    [currentProcess]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log('DATA', formData);
      const inputData = {
        name: formData.name,
        description: formData.description,
        processTypeId: formData.processType.id,
        isActive: true,
      };

      if (!currentProcess) {
        await axiosInstance.post('/processes', inputData);
      } else {
        await axiosInstance.patch(`/processes/${currentProcess.id}`, inputData);
      }
      reset();
      onClose();
      enqueueSnackbar('Process created successfully!');
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (processTypes) {
      setProcessTypeOptions(processTypes);
    }
  }, [processTypes]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle
          sx={{
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2, // horizontal padding
            py: 1.5, // vertical padding
          }}
        >
          Create Process
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Iconify icon="simple-line-icons:close" width={24} height={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
            mt={2}
          >
            <RHFTextField name="name" label="Process Name" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocomplete
              name="processType"
              label="Process Type"
              options={processTypeOptions}
              getOptionLabel={(option) => `${option?.processType}` || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {`${option?.processType}`}
                    </Typography>
                  </div>
                </li>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save & Next
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ProcessesCreateForm.propTypes = {
  currentProcess: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
