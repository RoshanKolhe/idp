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
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------
export default function MemberItemHorizontal({ onEditRow, levelName, levelDescription, member }) {
  const popover = usePopover();



  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Stack component={Card} sx={{ p: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
             src={member.avatarUrl?.fileUrl || ""}
              alt={member.fullName}
              sx={{
                width: 48,
                height: 48,
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={0.5} pr={1} overflow="hidden">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextMaxLine variant="subtitle2" line={2}>
                  {member.fullName}
                </TextMaxLine>

                <IconButton
                  size="small"
                  color={popover.open ? 'inherit' : 'default'}
                  onClick={popover.onOpen}
                  sx={{ ml: 1 }}
                >
                  <Iconify icon="eva:more-horizontal-fill" />
                </IconButton>
              </Box>

              <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                {member.email}
              </TextMaxLine>

              <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                {member.phoneNumber}
              </TextMaxLine>
            </Stack>
          </Grid>

        </Grid>
      </Stack>
      {/*  */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 80 }}
        flexShrink="start"
        right="top"
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
            onEditRow();
            popover.onClose();
            // router.push(paths.dashboard.post.edit(title));
          }}
        >
          <Iconify icon="solar:pen-bold" sx={{ width: 20 }} />
          Edit
        </MenuItem>
        {/* 
        <MenuItem
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
    fullName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarUrl: PropTypes.shape({
      fileUrl: PropTypes.string,
    }),
  }),
  onEditRow: PropTypes.func
};
