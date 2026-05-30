import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
const ACTION_ICON_BUTTON_SX = {
  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  p: 1,
  borderRadius: 1.5,
  color: 'primary.main',
};

export default function ProcessTypeTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onStatusChange
}) {
  const navigate = useNavigate();
  const { id, processInstanceName, processes, isInstanceRunning } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        {/* <Tooltip title={id} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{id}</TableCell>
        </Tooltip> */}

        <Tooltip title={processInstanceName} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{processInstanceName}</TableCell>
        </Tooltip>

        <Tooltip title={processes?.name || '-'} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{processes?.name || '-'}</TableCell>
        </Tooltip>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.proccessInstanceTransactions?.length || 0}</TableCell> */}

        <TableCell sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <Tooltip title={isInstanceRunning ? 'Pause' : 'Start'} placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => {
                onStatusChange();
              }}
            >
              <Iconify
                icon={isInstanceRunning ? 'ic:round-pause-circle' : 'ic:round-play-circle'}
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Documents" placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => console.log('documents clicked')}
            >
              <Iconify icon="ic:baseline-insert-drive-file" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => onEditRow()}
            >
              <Iconify icon="solar:pen-bold" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="View transactions" placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => navigate(paths.dashboard.processesInstance.logsList(row.id))}
            >
              <Iconify icon="carbon:view-filled" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="top" arrow>
            <IconButton sx={ACTION_ICON_BUTTON_SX} color="error" onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" width={20} height={20} />
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
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ProcessTypeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onStatusChange: PropTypes.func,
};
