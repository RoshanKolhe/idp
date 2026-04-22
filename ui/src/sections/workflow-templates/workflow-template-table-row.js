import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { alpha } from '@mui/material/styles';

const ACTION_ICON_BUTTON_SX = {
  backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
  border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  p: 1,
  borderRadius: 1.5,
  color: 'primary.main',
};

export default function WorkflowTemplateTableRow({ row, onEditRow, onViewRow }) {
  const { name, version, workflow, createdAt, status } = row;
  let statusColor = 'default';

  if (status === 'published') {
    statusColor = 'success';
  } else if (status === 'draft') {
    statusColor = 'info';
  } else if (status === 'unpublished') {
    statusColor = 'warning';
  }

  return (
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
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
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
      </TableCell>
    </TableRow>
  );
}

WorkflowTemplateTableRow.propTypes = {
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
};
