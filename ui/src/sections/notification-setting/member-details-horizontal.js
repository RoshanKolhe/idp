import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
export default function MemberItemHorizontal({ levelName, levelDescription, member }) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Stack component={Card} direction="row">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
        
        <Stack
          sx={{
            p: (theme) => theme.spacing(3,3,2,2),
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Label variant="soft" >
              {levelName}
            </Label>
          </Stack>
         
          <Stack spacing={1} flexGrow={1}>
            <Link color="inherit" >
              <TextMaxLine variant="subtitle2" line={2}>
                {member.name}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {levelDescription}
            </TextMaxLine>
          </Stack>
        </Stack>
          <Stack direction="row" alignItems="right">
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen} sx={{
      position: 'absolute',
      top: 8,
      right: 8,
    }}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
            </Stack>
      </Stack>
        

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 40 }}
      >
        {/* <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(title));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            popover.onClose();
            // router.push(paths.dashboard.post.edit(title));
          }}
        >
          <Iconify icon="solar:pen-bold" />
     
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>  */}
      </CustomPopover> 
    </>
  );
}

 MemberItemHorizontal.propTypes = {
  levelName: PropTypes.string,
  levelDescription: PropTypes.string,
  member: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
};
