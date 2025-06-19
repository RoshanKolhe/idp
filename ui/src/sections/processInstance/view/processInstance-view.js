// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetProcessType } from 'src/api/processType';

import ProcessTypeViewForm from '../processInstance-view-form';

// ----------------------------------------------------------------------

export default function ProcessInstanceView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processType: currentProcessType } = useGetProcessType(id);

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
            href: paths.dashboard.processType.root,
          },
          {
            name: currentProcessType?.processType,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTypeViewForm currentProcessType={currentProcessType} />
    </Container>
  );
}
