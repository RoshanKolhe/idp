// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetProcessInstance } from 'src/api/process-instance';
import Iconify from 'src/components/iconify';
import { Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import ProcessTypeNewEditForm from '../processInstance-new-edit-form';

// ----------------------------------------------------------------------

export default function ProcessInstanceEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processInstance: currentProcessInstance } = useGetProcessInstance(id);

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
            name: 'Process Instance',
            href: paths.dashboard.processesInstance.root,
          },
          {
            name: currentProcessInstance?.processInstanceName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTypeNewEditForm currentProcessInstance={currentProcessInstance} />
    </Container>
  );
}
