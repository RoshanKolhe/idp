// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetProcessTemplate } from 'src/api/process-templates';

import ProcessTemplateViewForm from '../process-template-view-form';

// ----------------------------------------------------------------------

export default function ProcessTemplateView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { processTemplate: currentProcessTemplate } = useGetProcessTemplate(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="View"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Process Template',
            href: paths.dashboard.processTemplates.root,
          },
          {
            name: currentProcessTemplate?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessTemplateViewForm currentProcessTemplate={currentProcessTemplate} />
    </Container>
  );
}
