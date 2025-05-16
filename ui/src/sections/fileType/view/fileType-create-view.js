// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FileTypeNewEditForm from '../fileType-new-edit-form';
//

// ----------------------------------------------------------------------

export default function FileTypeCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new File Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'File Type',
            href: paths.dashboard.fileType.root,
          },
          { name: 'New File Type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FileTypeNewEditForm />
    </Container>
  );
}
