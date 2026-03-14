import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useEffect, useMemo, useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {RHFTextField} from 'src/components/hook-form';
import { IconButton } from '@mui/material';
import { workflowAxiosInstance } from 'src/utils/axios';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import WorkflowTemplateSelection from './workflow-template-selection';

// ----------------------------------------------------------------------

export default function WorkflowCreateForm({ currentWorkflow, open, onClose }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    isTemplateUsed: Yup.boolean().required(),
    template: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentWorkflow?.name || '',
      description: currentWorkflow?.description || '',
      isTemplateUsed: currentWorkflow?.isTemplateUsed || false,
      template: currentWorkflow?.workflowTemplatesId || null,
    }),
    [currentWorkflow]
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
        isActive: true,
        isTemplateUsed: formData.isTemplateUsed,
      };

      if (formData.isTemplateUsed === true && formData.template) {
        inputData.workflowTemplatesId = formData.template;
      }

      if (!currentWorkflow) {
        const response = await workflowAxiosInstance.post('/workflows', inputData);
        if (response.data) {
          reset();
          router.push(paths.dashboard.workflow.reactFlow(response.data.id));
          onClose();
          enqueueSnackbar('Workflow created successfully!');
        }
      } else {
        await workflowAxiosInstance.patch(`/workflows/${currentWorkflow.id}`, inputData);
        reset();
        onClose();
        enqueueSnackbar('Workflow updated successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleNext = async () => {
    const isValid = await methods.trigger(['name']);

    if (isValid) {
      setStep(2);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

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
          Create Workflow
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Iconify icon="simple-line-icons:close" width={24} height={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {step === 1 && (
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
              <RHFTextField name="name" label="Workflow Name" />
              <RHFTextField name="description" label="Description" />
            </Box>
          )}

          {step === 2 && (
            <WorkflowTemplateSelection handleSubmitForm={onSubmit} isSubmitting={isSubmitting} />
          )}
        </DialogContent>

        {step === 1 && (
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button type="button" variant="contained" onClick={handleNext}>
              Save & Next
            </Button>
          </DialogActions>
        )}
      </FormProvider>
    </Dialog>
  );
}

WorkflowCreateForm.propTypes = {
  currentWorkflow: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
