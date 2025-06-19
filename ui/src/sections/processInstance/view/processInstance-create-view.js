// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProcessInstanceNewEditForm from '../processInstance-new-edit-form';
//

// ----------------------------------------------------------------------

export default function ProcessInstanceCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Process Instance"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Process Instance',
            href: paths.dashboard.processesInstance.root,
          },
          { name: 'New Process Instance' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessInstanceNewEditForm />
    </Container>
  );
}
