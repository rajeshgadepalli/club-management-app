import { COLORS, SPACING } from '@/theme';
import { appStyles } from '@/theme/styles.new';
import React from 'react';
import { Text } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

interface MessageDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
  type?: 'success' | 'error' | 'info';
  actions?: {
    label: string;
    onPress: () => void;
  }[];
}

export default function MessageDialog({
  visible,
  title,
  message,
  onDismiss,
  type = 'info',
  actions = [{ label: 'OK', onPress: onDismiss }]
}: MessageDialogProps) {
  return (
    <Portal>
      <Dialog style={{ backgroundColor: COLORS.surface }} visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ScrollArea>
            <Text>{message}</Text>
          </Dialog.ScrollArea>
        </Dialog.Content>
        <Dialog.Actions>
          {actions.map((action, index) => (
            <Button
              key={index}
              onPress={action.onPress}
              mode={index === actions.length - 1 ? 'contained' : 'outlined'}
              contentStyle={{ paddingLeft: SPACING.md, paddingRight: SPACING.md }} // 👈 set min width here
            >
              {action.label}
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}