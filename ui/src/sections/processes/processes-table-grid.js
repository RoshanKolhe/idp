import PropTypes from 'prop-types';
import { Card, Box, Typography, Stack, IconButton, alpha, useTheme, Tooltip, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

export default function ProcessesTableGrid({ row, onViewRow, onQueryRow, onEdit, onDelete }) {
  const theme = useTheme();
  const { name, description } = row;
  const navigate = useNavigate();
  const confirm = useBoolean();

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: theme.shadows[4],
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: 520,
        maxHeight: 250,
        width: '100%',
        height: '100%',
        mx: 'auto',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="mdi:file-document-outline" width={22} color="primary.dark" />
          </Box>
          <Box sx={{ maxWidth: '180px' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Process Name
            </Typography>
            <Tooltip title={name} placement="top" arrow>
              <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="subtitle1" fontWeight={600}>
                {name}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>

	        <Stack direction="row" spacing={1}>
	          <IconButton size="small" color="primary" onClick={onEdit}>
	            <Iconify icon="mdi:pencil-outline" color="primary.dark" />
	          </IconButton>
	          <IconButton size="small" color="error" onClick={confirm.onTrue}>
	            <Iconify icon="solar:trash-bin-trash-bold" color="error.main" />
	          </IconButton>
	          <IconButton
	            color="primary"
	            onClick={() => {
	              navigate(paths.dashboard.processes.reactFlow(row.id));
	            }}
	          >
	            <Iconify icon="carbon:flow-modeler" color="primary.dark" />
	          </IconButton>
	        </Stack>
	      </Stack>

	      <Stack direction="row" spacing={2} mt={3}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'warning.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="mdi:clipboard-text-outline" width={22} color="warning.main" />
        </Box>
        <Box sx={{ maxWidth: '200px' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Process Description
          </Typography>
          <Tooltip title={description} placement="top" arrow>
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {description || '-'}
            </Typography>
          </Tooltip>
        </Box>
	      </Stack>

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
	              onDelete?.();
	              confirm.onFalse();
	            }}
	          >
	            Delete
	          </Button>
	        }
	      />
	    </Card>
	  );
}

ProcessesTableGrid.propTypes = {
  onViewRow: PropTypes.func,
  onQueryRow: PropTypes.func,
  row: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
