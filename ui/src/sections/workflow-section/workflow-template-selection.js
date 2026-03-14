import {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import {useGetWorkflowTemplates} from 'src/api/workflow-templates';

export default function WorkflowTemplateSelection({handleSubmitForm, isSubmitting}) {
  const {workflowTemplates} = useGetWorkflowTemplates();
  const {setValue} = useFormContext();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    setValue('isTemplateUsed', true);
    setValue('template', selectedTemplate.id);
    handleSubmitForm();
  };

  const handleSkipTemplate = () => {
    setValue('isTemplateUsed', false);
    setValue('template', null);
    handleSubmitForm();
  };

  return (
    <>
      <Grid container spacing={2}>
        {workflowTemplates.length > 0 ? (
          workflowTemplates.map(template => {
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={template.id} sx={{my: 2}}>
                <Card
                  onClick={() => setSelectedTemplate(template)}
                  sx={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid' : '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      height="140"
                      image={template.image?.fileUrl}
                      alt={template.name}
                    />
                  </Box>

                  <CardContent>
                    <Typography variant="h6">{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {template.description}
                    </Typography>
                    <Typography variant="caption">Version: {template.version}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                py: 10,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.neutral',
              }}
            >
              <Iconify
                icon="fluent:document-error-20-regular"
                width={48}
                sx={{mb: 2, color: 'text.disabled'}}
              />
              <Typography variant="h6" sx={{color: 'text.secondary'}}>
                No Workflow Templates Found
              </Typography>
              <Typography variant="body2" sx={{color: 'text.disabled'}}>
                You can still continue by creating a workflow from scratch.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Box display="flex" gap={2} my={3}>
        <LoadingButton
          variant="contained"
          fullWidth
          disabled={!selectedTemplate}
          loading={isSubmitting}
          onClick={handleUseTemplate}
        >
          Use Selected Template
        </LoadingButton>

        <LoadingButton
          variant="outlined"
          fullWidth
          loading={isSubmitting}
          onClick={handleSkipTemplate}
        >
          Continue Without Template
        </LoadingButton>
      </Box>
    </>
  );
}

WorkflowTemplateSelection.propTypes = {
  handleSubmitForm: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
