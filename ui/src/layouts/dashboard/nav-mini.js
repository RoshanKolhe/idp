// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// components
import { NavSectionMini } from 'src/components/nav-section';
//
import { useAuthContext } from 'src/auth/hooks';
import MiniLogo from 'src/components/logo/mini-logo';
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();

  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        backgroundColor: '#000',
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <MiniLogo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.permissions[0],
          }}
        />
      </Stack>
    </Box>
  );
}
