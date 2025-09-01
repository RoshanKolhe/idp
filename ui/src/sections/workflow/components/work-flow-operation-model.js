import React, { useEffect, useState } from 'react';
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
    title: 'Ingestion',
    description: 'Document Ingestion.',
    icon: '/assets/icons/workflow/ingestion.svg',
    type: 'ingestion',
    bgColor: '#0AAFFF',
    borderColor: '#0884CC',
    color: '#0AAFFF'
  },
  {
    id: 2,
    title: 'Notification',
    description: 'Notification Sender Node.',
    icon: '/assets/icons/workflow/notification.png',
    type: 'notification',
    bgColor: '#00A76F',
    borderColor: '#2e7d32',
    color: '#00A76F'
  },
  {
    id: 2,
    title: 'Decision',
    description: 'Notification Sender Node.',
    icon: '/assets/icons/workflow/notification.png',
    type: 'notification',
    bgColor: '#00A76F',
    borderColor: '#2e7d32',
    color: '#00A76F'
  },
];

export default function OperationSelectorModal({ onSelect, onClose, open, bluePrintNode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = operations.filter((opt) => !bluePrintNode?.includes(opt.title));
    setData(newData);
  }, [bluePrintNode])
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select a Node</DialogTitle>
      <DialogContent dividers>
        <List>
          {data.map((operation) => (
            <ListItem key={operation.id} disablePadding sx={{ borderBottom: '1px solid lightgray' }}>
              <ListItemButton onClick={() => onSelect(operation)}>
                <ListItemAvatar sx={{width: 40, height: 40, borderRadius: '50%', backgroundColor: operation.color, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Avatar
                    src={operation.icon}
                    alt={operation.title}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={operation.title} secondary={operation.description} />
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
  bluePrintNode: PropTypes.array,
};
