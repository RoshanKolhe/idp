// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetProcessTemplate } from 'src/api/process-templates';
import ProcessTemplateNewEditForm from '../process-template-new-edit-form';

// ----------------------------------------------------------------------

export default function ProcessTemplateEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processTemplate: currentProcessTemplate } = useGetProcessTemplate(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Process Template',
            href: paths.dashboard.processesInstance.root,
          },
          {
            name: currentProcessTemplate?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTemplateNewEditForm currentProcessTemplate={currentProcessTemplate} />
    </Container>
  );
}
