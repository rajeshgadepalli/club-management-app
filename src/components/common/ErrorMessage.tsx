import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { appStyles } from '@/theme/styles.new';
import { SPACING } from '@/theme';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
    <View style={[appStyles.center, { padding: SPACING.md }]}>
        <Text style={[appStyles.error]}>{message}</Text>
        {onRetry && (
            <Button mode="contained" onPress={onRetry}>
                Retry
            </Button>
        )}
    </View>
);

export default ErrorMessage;