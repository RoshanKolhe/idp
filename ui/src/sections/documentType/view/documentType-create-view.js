// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DocumentTypeNewEditForm from '../documentType-new-edit-form';
//

// ----------------------------------------------------------------------

export default function DocumentTypeCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Document Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Document Type',
            href: paths.dashboard.documentType.root,
          },
          { name: 'New Document Type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentTypeNewEditForm />
    </Container>
  );
}
