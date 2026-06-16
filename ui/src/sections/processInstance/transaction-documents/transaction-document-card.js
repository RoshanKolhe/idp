import PropTypes from 'prop-types';
import { Card, Box, Typography, Stack, Divider, Tooltip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';

const ICON_WRAPPER_SX = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export default function TransactionDocumentCard({ record }) {
  const { processInstanceFile, createdAt } = record;
  const {
    documentName,
    fileUrl,
    classifiedType,
    documentType,
  } = processInstanceFile || {};

  const handleOpenFile = () => {
    if (fileUrl) window.open(fileUrl, '_blank');
  };

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
      {/* Header — document name + classified type badge */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Box sx={ICON_WRAPPER_SX}>
            <Iconify icon="ic:baseline-insert-drive-file" width={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Document
            </Typography>
            <Tooltip title={documentName || '-'} placement="top" arrow>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}
              >
                {documentName || '-'}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>

        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.4)}`,
            backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
            fontSize: 12,
            color: 'info.dark',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {classifiedType || documentType?.documentType || 'Unknown'}
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Body — date and open file action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={ICON_WRAPPER_SX}>
            <Iconify icon="mdi:calendar-month-outline" width={20} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Linked At
            </Typography>
            <Typography variant="body2">
              {createdAt ? format(new Date(createdAt), 'dd MMM, yyyy, hh:mm a') : '-'}
            </Typography>
          </Box>
        </Stack>

        <Tooltip title="Open file" placement="top" arrow>
          <span>
            <IconButton
              color="primary"
              onClick={handleOpenFile}
              disabled={!fileUrl}
            >
              <Iconify icon="material-symbols:open-in-new" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Footer — document type label from relation */}
      {documentType?.documentType && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={ICON_WRAPPER_SX}>
              <Iconify icon="mdi:tag-outline" width={18} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Document Type
              </Typography>
              <Typography variant="body2">{documentType.documentType}</Typography>
            </Box>
          </Stack>
        </>
      )}
    </Card>
  );
}

TransactionDocumentCard.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.number,
    createdAt: PropTypes.string,
    processInstanceFile: PropTypes.shape({
      documentName: PropTypes.string,
      fileUrl: PropTypes.string,
      classifiedType: PropTypes.string,
      documentType: PropTypes.shape({
        documentType: PropTypes.string,
      }),
    }),
  }),
};
