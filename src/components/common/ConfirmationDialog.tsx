import React from 'react';
import MessageDialog from './MessageDialog';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'success' | 'error' | 'info';
}

export default function ConfirmationDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  type = 'info'
}: ConfirmationDialogProps) {
  return (
    <MessageDialog
      visible={visible}
      title={title}
      message={message}
      type={type}
      onDismiss={onCancel}
      actions={[
        {
          label: cancelLabel,
          onPress: onCancel,
        },
        {
          label: confirmLabel,
          onPress: onConfirm,
        },
      ]}
    />
  );
}
