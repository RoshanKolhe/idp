import Container from '@mui/material/Container';
import {paths} from 'src/routes/paths';
import {useSettingsContext} from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import WorkflowTemplateNewEditForm from '../workflow-template-new-edit-form';

export default function WorkflowTemplateCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Workflow Template"
        links={[
          {name: 'Dashboard', href: paths.dashboard.root},
          {name: 'Workflow Templates', href: paths.dashboard.workflowTemplates.root},
          {name: 'New Workflow Template'},
        ]}
        sx={{mb: {xs: 3, md: 5}}}
      />

      <WorkflowTemplateNewEditForm />
    </Container>
  );
}
