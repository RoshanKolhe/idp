// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetProcesses } from 'src/api/processes';

import ProcessesViewForm from '../processes-view-form';

// ----------------------------------------------------------------------

export default function ProcessesView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processes: currentProcesses } = useGetProcesses(id);

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
            name: 'Process Type',
            href: paths.dashboard.processes.root,
          },
          {
            name: currentProcesses?.processes,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessesViewForm currentProcesses={currentProcesses} />
    </Container>
  );
}
