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
import Iconify from 'src/components/iconify';
import { Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import FileTypeNewEditForm from '../fileType-new-edit-form';

// ----------------------------------------------------------------------

export default function FileTypeEditView() {
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

      <FileTypeNewEditForm currentFileType={currentFileType} />
    </Container>
  );
}
