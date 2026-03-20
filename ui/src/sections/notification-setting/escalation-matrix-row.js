import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

const ACTION_ICON_BUTTON_SX = {
  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  p: 1,
  borderRadius: 1.5,
  color: 'primary.main',
};

export default function EscalationMatrixTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { escalationName, description, levels } = row;

  const popover = usePopover();
  let membersLength = 0;

  if (levels && levels.length > 0) {
    levels.forEach((level) => {
      if (level.members && level.members.length) {
        membersLength += level.members.length;
      }
    });
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{escalationName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{levels?.length || 0}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{membersLength || 0}</TableCell>

        <TableCell sx={{ maxWidth: 300 }}>
          <Tooltip title={description || '-'} placement="top-start" arrow>
            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                cursor: 'pointer',
              }}
            >
              {description || '-'}
            </span>
          </Tooltip>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Tooltip title="View Levels" placement="top" arrow>
            <IconButton sx={ACTION_ICON_BUTTON_SX} onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit" placement="top" arrow>
            <IconButton sx={ACTION_ICON_BUTTON_SX} onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}

EscalationMatrixTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
