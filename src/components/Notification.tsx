// Notification.tsx
import React, { useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      message={message}
    />
  );
};

export default Notification;