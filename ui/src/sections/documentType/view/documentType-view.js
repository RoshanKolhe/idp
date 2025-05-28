// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetDocumentType } from 'src/api/documentType';
import DocumentTypeViewForm from '../documentType-view-form';


// ----------------------------------------------------------------------

export default function DocumentTypeView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { documentType: currentDocumentType } = useGetDocumentType(id);

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
            name: 'Document Type',
            href: paths.dashboard.documentType.root,
          },
          {
            name: currentDocumentType?.documentType,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentTypeViewForm currentDocumentType={currentDocumentType} />
    </Container>
  );
}
