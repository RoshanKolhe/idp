import React from 'react';
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
    icon: '/assets/icons/document-process/process.svg',
    type: 'imageProcessing'
  },
  {
    id: 1,
    title: 'Classify',
    icon: '/assets/icons/document-process/classify.svg',
    type: 'classify'
  },
];

export default function OperationSelectorModal({ onSelect, onClose, open }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select an Operation</DialogTitle>
      <DialogContent dividers>
        <List>
          {operations.map((operation) => (
            <ListItem key={operation.id} disablePadding>
              <ListItemButton onClick={() => onSelect(operation)}>
                <ListItemAvatar>
                  <Avatar
                    src={operation.icon}
                    alt={operation.title}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={operation.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

OperationSelectorModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
