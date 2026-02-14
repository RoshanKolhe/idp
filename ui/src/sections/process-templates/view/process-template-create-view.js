// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProcessTemplateNewEditForm from '../process-template-new-edit-form';
//

// ----------------------------------------------------------------------

export default function ProcessTemplateCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Process Template"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Process Template',
            href: paths.dashboard.processTemplates.root,
          },
          { name: 'New Process Template' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTemplateNewEditForm />
    </Container>
  );
}
