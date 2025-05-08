// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProcessTypeNewEditForm from '../processType-new-edit-form';
//

// ----------------------------------------------------------------------

export default function ProcessTypeCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Process Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Process Type',
            href: paths.dashboard.processType.root,
          },
          { name: 'New Process Type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTypeNewEditForm />
    </Container>
  );
}
