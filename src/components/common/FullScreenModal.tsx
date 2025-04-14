// components/common/FullScreenModal.tsx

import React from 'react';
import { View } from 'react-native';
import { Modal, Portal, IconButton, Text } from 'react-native-paper';
import { appStyles } from '@/theme/styles.new';

interface FullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function FullScreenModal({ visible, onClose, title, children }: FullScreenModalProps) {
  return (
    <Portal>
      <View style={{ flex: 1 }}>
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={appStyles.modalFullscreen}>
          <View style={appStyles.modalContainer}>
            <View style={appStyles.modalHeader}>
              <IconButton icon="arrow-left" onPress={onClose} />
              {title && <Text style={appStyles.modalTitle}>{title}</Text>}
            </View>
            <View style={appStyles.modalContent}>
              {children}
            </View>
          </View>
        </Modal>
      </View>
    </Portal>
  );
}
