import Container from '@mui/material/Container';
import {paths} from 'src/routes/paths';
import {useParams} from 'src/routes/hook';
import {useSettingsContext} from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {useGetWorkflowTemplate} from 'src/api/workflow-templates';
import WorkflowTemplateViewForm from '../workflow-template-view-form';

export default function WorkflowTemplateView() {
  const settings = useSettingsContext();
  const {id} = useParams();
  const {workflowTemplate: currentWorkflowTemplate} = useGetWorkflowTemplate(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Workflow Template"
        links={[
          {name: 'Dashboard', href: paths.dashboard.root},
          {name: 'Workflow Templates', href: paths.dashboard.workflowTemplates.root},
          {name: currentWorkflowTemplate?.name},
        ]}
        sx={{mb: {xs: 3, md: 5}}}
      />

      <WorkflowTemplateViewForm currentWorkflowTemplate={currentWorkflowTemplate} />
    </Container>
  );
}
