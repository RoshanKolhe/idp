import PropTypes from 'prop-types';
import { Card, Box, Typography, Stack, Divider, Tooltip, IconButton, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

const ICON_WRAPPER_SX = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function FileTypeTableGrid({ row, onViewRow, onEditRow, onDeleteRow, onQueryRow }) {
  const { fileType, description, createdAt, isActive } = row;
  const confirm = useBoolean();

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows?.z8 || theme.shadows[8],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={ICON_WRAPPER_SX}>
              <Iconify icon="mdi:file-document-outline" width={20} />
            </Box>
            <Box sx={{ maxWidth: '200px' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                File Type
              </Typography>
              <Tooltip title={fileType} placement="top" arrow>
                <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="subtitle1" fontWeight={600}>
                  {fileType}
                </Typography>
              </Tooltip>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 1,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            backgroundColor: (theme) =>
              alpha(
                isActive ? theme.palette.success.main : theme.palette.error.main,
                0.08
              ),
            fontSize: 14,
            color: isActive ? 'success.dark' : 'error.dark',
            minWidth: 90,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {isActive ? 'Active' : 'In-active'}
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={ICON_WRAPPER_SX}>
            <Iconify icon="mdi:calendar-month-outline" width={20} />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Date and Time
            </Typography>
            <Typography variant="body2">
              {format(new Date(createdAt), 'dd MMM, yyyy, hh:mm a')}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={ICON_WRAPPER_SX}>
            <Iconify icon="mdi:file-document-outline" width={20} />
          </Box>

          <Box sx={{ maxWidth: 250 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              File Description
            </Typography>
            <Tooltip title={description || '-'} placement="top" arrow>
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
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        {onEditRow && (
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        )}
        {onViewRow && (
          <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>
        )}
        {onDeleteRow && (
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton color="error" onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}
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
              onDeleteRow?.();
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

FileTypeTableGrid.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onQueryRow: PropTypes.func,
  row: PropTypes.shape({
    fileType: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    isActive: PropTypes.bool,
  }),
};
