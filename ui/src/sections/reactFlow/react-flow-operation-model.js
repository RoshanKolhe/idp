import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';
import PropTypes from 'prop-types';

const operations = [
  {
    id: 1,
    title: 'Image Processing',
    description: 'Optimize images for analysis.',
    icon: '/assets/icons/document-process/process.svg',
    type: 'imageProcessing',
    color: '#FF7D51'
  },
  {
    id: 2,
    title: 'Classify',
    description: 'Sort documents by type.',
    icon: '/assets/icons/document-process/classify.svg',
    type: 'classify',
    color: '#0AAFFF'
  },
  {
    id: 3,
    title: 'Extract',
    description: 'Pull key data from documents.',
    icon: '/assets/icons/document-process/extract.svg',
    type: 'extract',
    color: '#FFC113'
  },
  {
    id: 4,
    title: 'External Data Sources',
    description: 'Link to third-party data.',
    icon: '/assets/icons/document-process/external-data-source.svg',
    type: 'default',
  },
  {
    id: 5,
    title: 'Validate',
    description: 'Ensure data accuracy.',
    icon: '/assets/icons/document-process/validate.svg',
    type: 'validate',
    color: '#ED63D2'
  },
  {
    id: 6,
    title: 'Deliver',
    description: 'Send documents or data.',
    icon: '/assets/icons/document-process/deliver.svg',
    type: 'deliver',
    color: '#7551E9'
  },
  {
    id: 7,
    title: 'Index Document',
    description: 'Tag for quick access.',
    icon: '/assets/icons/document-process/index-document.svg',
    type: 'default'
  },
  {
    id: 8,
    title: 'Document Query',
    description: 'Search documents easily.',
    icon: '/assets/icons/document-process/document-query.svg',
    type: 'default'
  },
  {
    id: 9,
    title: 'Integration Step',
    description: 'Connect external systems.',
    icon: '/assets/icons/document-process/integration-steps.svg',
    type: 'default'
  },
  {
    id: 10,
    title: 'AI Analyser',
    description: 'Analyze data with intelligent insights.',
    icon: '/assets/icons/document-process/ai-analyzer.svg',
    type: 'default'
  },
  {
    id: 11,
    title: 'Router',
    description: 'Add multiple route.',
    icon: '/assets/icons/document-process/plan.svg',
    type: 'router',
    color: '#1976D2'
  },
  {
    id: 12,
    title: 'Aggregator',
    description: 'Merge split route.',
    icon: '/assets/icons/document-process/plan.svg',
    type: 'aggregator',
    color: '#7B1FA2'
  },
];

export default function OperationSelectorModal({
  onSelect,
  onClose,
  open,
  bluePrintNode
}) {

  // ✅ DERIVED DATA — NO STATE, NO EFFECT
  const data = useMemo(() => {
    if (!Array.isArray(bluePrintNode)) {
      return operations;
    }

    return operations.filter(
      (opt) => !bluePrintNode.includes(opt.title)
    );
  }, [bluePrintNode]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select a Node</DialogTitle>

      <DialogContent dividers>
        <List>
          {data.map((operation) => (
            <ListItem
              key={operation.id}
              disablePadding
              sx={{ borderBottom: '1px solid lightgray' }}
            >
              <ListItemButton onClick={() => onSelect(operation)}>
                <ListItemAvatar>
                  <Avatar
                    src={operation.icon}
                    alt={operation.title}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={operation.title}
                  secondary={operation.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OperationSelectorModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  bluePrintNode: PropTypes.array,
};
