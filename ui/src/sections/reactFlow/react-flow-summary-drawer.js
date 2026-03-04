import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import Iconify from 'src/components/iconify';

const getNodeComponent = (bluePrint, nodeName) =>
  bluePrint?.find((node) => String(node?.nodeName || '').toLowerCase() === nodeName)?.component;

export default function ReactFlowSummaryDrawer({ bluePrint }) {
  const [isOpen, setIsOpen] = useState(false);

  const summary = useMemo(() => {
    const classifyComponent = getNodeComponent(bluePrint, 'classify');
    const extractComponent = getNodeComponent(bluePrint, 'extract');

    const processedDocuments = Array.isArray(classifyComponent?.categories)
      ? classifyComponent.categories
        .map((item) => item?.documentType)
        .filter(Boolean)
      : [];

    const extractorFields = extractComponent?.extractorFields || {};
    const extractedVariables = Object.values(extractorFields)
      .flatMap((fields) => (Array.isArray(fields) ? fields : []))
      .map((field) => field?.variableName)
      .filter(Boolean);

    const extractors = extractComponent?.extractors || {};
    const isGenAIBotEnabled = Object.values(extractors).some((value) => `${value}`.toLowerCase() === 'genai');

    return {
      processedDocuments,
      extractedVariables,
      isGenAIBotEnabled,
    };
  }, [bluePrint]);

  return (
    <>
      {!isOpen ? (
        <Box
          component='div'
          sx={{
            position: 'absolute',
            right: -70,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10
          }}
        >
          <IconButton
            size="small"
            onClick={() => setIsOpen((prev) => !prev)}
            sx={{
              pointerEvents: 'auto',
              borderRadius: '16px 0 0 16px',
              mr: isOpen ? 0 : 1,
              rotate: '-90deg'
            }}
          >
            <Button
              variant="contained"
              color='primary'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1
              }}
            >
              Summary Card
              <Iconify icon="eva:arrow-ios-upward-fill" width={18} />
            </Button>
          </IconButton>
        </Box>
      ) :
        (<Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 12,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {isOpen && (
            <Paper
              elevation={4}
              sx={{
                pointerEvents: 'auto',
                width: 320,
                maxHeight: '75vh',
                overflowY: 'auto',
                borderRadius: '16px 0 0 16px',
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setIsOpen((prev) => !prev)}
                  sx={{
                    pointerEvents: 'auto',
                    borderRadius: '50%',
                    
                  }}
                >
                  <Iconify icon="eva:close-outline" width={18} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Enable GEN AI bot</Typography>
                <Checkbox checked={summary.isGenAIBotEnabled} disabled />
              </Box>

              <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}>
                  <Typography variant="subtitle1">Extracted Variables</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {summary.extractedVariables.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No extracted fields configured</Typography>
                  ) : (
                    <List dense disablePadding>
                      {summary.extractedVariables.map((item) => (
                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Iconify icon="lucide:file-type" width={16} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 1 }} />

              <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}>
                  <Typography variant="subtitle1">Processed Document</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {summary.processedDocuments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No documents selected</Typography>
                  ) : (
                    <List dense disablePadding>
                      {summary.processedDocuments.map((item) => (
                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Iconify icon="solar:document-bold" width={16} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
        </Box>)}
    </>
  );
}

ReactFlowSummaryDrawer.propTypes = {
  bluePrint: PropTypes.array,
};
