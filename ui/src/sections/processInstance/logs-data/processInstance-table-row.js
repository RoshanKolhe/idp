/* eslint-disable no-nested-ternary */
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

// ----------------------------------------------------------------------

export default function ProcessInstanceTableRow({
  row,
  index,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onStatusChange
}) {
  const navigate = useNavigate();
  const { id, processInstancesId, createdAt, status } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{id}</TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              status === 0
                ? 'warning' // Running
                : status === 1
                  ? 'success' // Completed
                  : status === 2
                    ? 'error'   // Failed
                    : status === 3  // waiting
                      ? 'info'
                      : 'default'
            }
          >
            {status === 0
              ? 'Running'
              : status === 1
                ? 'Completed'
                : status === 2
                  ? 'Failed'
                  : status === 3  // waiting
                    ? 'Waiting'
                    : 'unknown'}
          </Label>
        </TableCell>
        <TableCell sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <Tooltip title="View logs" placement="top" arrow>
            <IconButton
              sx={{
                backgroundColor: 'rgba(65, 130, 235, 0.1)',
                border: '1px solid rgba(65, 130, 235, 0.3)',
                p: 1,
                borderRadius: '12px',
                color: '#4182EB',
              }}
              onClick={() => navigate(paths.dashboard.processesInstance.reactFlow(processInstancesId))}
            >
              <Iconify icon="carbon:view-filled" width={20} height={20} />
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

ProcessInstanceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onStatusChange: PropTypes.func,
  index: PropTypes.number,
};
