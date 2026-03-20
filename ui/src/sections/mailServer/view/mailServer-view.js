import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import MailServerForm from '../mailServer-form';

export default function MailServerCreateForm() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Mail Server"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Mail Server', href: paths.dashboard.mailServer.root },
          { name: 'Configuration' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MailServerForm />
    </Container>
  );
}
