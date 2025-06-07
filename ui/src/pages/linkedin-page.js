import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Typography from '@mui/material/Typography';  // Use MUI Typography component
import { useLocation } from 'react-router-dom'; // React Router hook

export default function LinkedInPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Get email and profile from query params
  const email = params.get('email') || 'No email found';
  const profile = params.get('profile') || 'No profile info';

  return (
    <>
      <Helmet>
        <title>LinkedIn Page</title>
      </Helmet>

      <Box>
        <Typography variant='h4'>Email</Typography>
        <Typography variant='h6'>{email}</Typography>

        <Typography variant='h4' sx={{ mt: 2 }}>Profile</Typography>
        <Typography variant='body1'>{profile}</Typography>
      </Box>
    </>
  );
}
