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

import ProcessTypeViewForm from '../processInstance-view-form';

// ----------------------------------------------------------------------

export default function ProcessInstanceView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processInstance: currentProcessInstance } = useGetProcessInstance(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="View Process Instance"
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

      <ProcessTypeViewForm currentProcessType={currentProcessInstance} />
    </Container>
  );
}
