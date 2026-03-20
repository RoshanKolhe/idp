/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import {alpha} from '@mui/material/styles';

// ----------------------------------------------------------------------
const ACTION_ICON_BUTTON_SX = {
  backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
  border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  p: 1,
  borderRadius: 1.5,
  color: 'primary.main',
};

export default function ProcessTemplateTableRow({
  row,
  selected,
  onEditRow,
  onDeleteRow,
}) {
  const navigate = useNavigate();
  const { name, version, processes, status } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <Tooltip title={name} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</TableCell>
        </Tooltip>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{version}</TableCell>

        <Tooltip title={processes?.name || '-'} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{processes?.name || '-'}</TableCell>
        </Tooltip>


        <TableCell sx={{ whiteSpace: 'nowrap', }}>
          <Label variant="soft" color={(status === 'published' ? 'success' : status === 'unpublished' ? 'error' : 'info') || 'default'}>
            {status === 'published' ? 'Published' : status === 'unpublished' ? 'Unpublished' : 'Draft'}
          </Label>
        </TableCell>

        <TableCell sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => navigate(paths.dashboard.processTemplates.edit(row.id))}
            >
              <Iconify icon="solar:pen-bold" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="View" placement="top" arrow>
            <IconButton
              sx={ACTION_ICON_BUTTON_SX}
              onClick={() => navigate(paths.dashboard.processTemplates.view(row.id))}
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

ProcessTemplateTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
