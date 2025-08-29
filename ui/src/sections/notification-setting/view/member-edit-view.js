// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AddMemberNewEditForm from '../add-member-new-edit-form';
//

// ----------------------------------------------------------------------

export default function MemberEditView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Process Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Edit Member',
            href: paths.dashboard.notificationSetting.list,
          },
          { name: 'New Member' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AddMemberNewEditForm />
    </Container>
  );
}
