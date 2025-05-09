import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const MiniLogo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img src="/logo/idp-mini-logo.png" alt="Custom Logo" style={{ cursor: 'pointer' }} />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

MiniLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default MiniLogo;
