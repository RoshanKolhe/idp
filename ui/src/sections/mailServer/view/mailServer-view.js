// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Typography } from '@mui/material';
import MailServerForm from '../mailServer-form';
//

// ----------------------------------------------------------------------

export default function MailServerCreateForm() {
  const settings = useSettingsContext();

  return (
   <Container maxWidth={settings.themeStretch ? false : 'lg'}>
         <Typography variant="h4"
         sx={{
          ml:"23px"
         }} gutterBottom>
          Intelligent Document Processing
         </Typography>
   
         <MailServerForm />
       </Container>
  );
}
