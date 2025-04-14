import React from 'react';
import { Portal, Dialog, Text, Button, Icon } from 'react-native-paper';
import { View } from 'react-native';
import { appStyles } from '@/theme/styles.new';
import { COLORS, SPACING } from '@/theme';

interface SuccessAlertProps {
    visible: boolean;
    onDismiss: () => void;
    message: string;
}

const SuccessAlert = ({ visible, onDismiss, message }: SuccessAlertProps) => {
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={{ backgroundColor: COLORS.surface }}
            >
                <View style={[appStyles.center, { padding: SPACING.md }]}>
                    <Icon
                        source="check-circle"
                        size={50}
                        color={COLORS.status.success}
                    />
                    <Text style={[appStyles.modalTitle, { textAlign: 'center', marginTop: SPACING.md }]}>
                        {message}
                    </Text>
                </View>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default SuccessAlert;