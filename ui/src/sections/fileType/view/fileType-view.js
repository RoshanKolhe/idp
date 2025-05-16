// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetFileType } from 'src/api/fileType';

import FileTypeViewForm from '../fileType-view-form';

// ----------------------------------------------------------------------

export default function FileTypeView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { fileType: currentFileType } = useGetFileType(id);

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
            name: 'File Type',
            href: paths.dashboard.fileType.root,
          },
          {
            name: currentFileType?.fileType,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FileTypeViewForm currentFileType={currentFileType} />
    </Container>
  );
}
