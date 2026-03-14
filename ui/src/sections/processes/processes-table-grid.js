import PropTypes from 'prop-types';
import {Card, Box, Typography, Stack, IconButton, alpha, useTheme} from '@mui/material';
import Iconify from 'src/components/iconify';
import {useNavigate} from 'react-router';
import {paths} from 'src/routes/paths';

export default function ProcessesTableGrid({row, onViewRow, onQueryRow, onEdit, onDelete}) {
  const theme = useTheme();
  const {name, description} = row;
  const navigate = useNavigate();

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
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Process Name
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {name}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={onEdit}>
            <Iconify icon="mdi:pencil-outline" color="primary.dark" />
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
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Process Description
          </Typography>
          <Typography variant="body2" mt={0.5}>
            {description || '-'}
          </Typography>
        </Box>
      </Stack>
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
