import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { alpha } from '@mui/material/styles';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

const ACTION_ICON_BUTTON_SX = {
  backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
  border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  p: 1,
  borderRadius: 1.5,
  color: 'primary.main',
};

export default function WorkflowTemplateTableRow({ row, onEditRow, onViewRow, onDeleteRow }) {
  const { name, version, workflow, createdAt, status } = row;
  const confirm = useBoolean();
  let statusColor = 'default';

  if (status === 'published') {
    statusColor = 'success';
  } else if (status === 'draft') {
    statusColor = 'info';
  } else if (status === 'unpublished') {
    statusColor = 'warning';
  }

  return (
    <>
      <TableRow hover>
        <Tooltip title={name} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</TableCell>
        </Tooltip>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{version}</TableCell>
        <Tooltip title={workflow?.name || '-'} placement="top" arrow>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}>{workflow?.name || '-'}</TableCell>
        </Tooltip>
        <TableCell>
          <ListItemText
            primary={createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : '-'}
            secondary={createdAt ? format(new Date(createdAt), 'p') : ''}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>
        <TableCell>
          <Label variant="soft" color={statusColor}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}
          </Label>
        </TableCell>
        <TableCell sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color="default" sx={ACTION_ICON_BUTTON_SX} onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View" placement="top" arrow>
            <IconButton sx={ACTION_ICON_BUTTON_SX} onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton sx={ACTION_ICON_BUTTON_SX} color="error" onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow?.();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

WorkflowTemplateTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
};
