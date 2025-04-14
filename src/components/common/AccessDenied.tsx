// src/components/common/AccessDenied.tsx
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appStyles } from '@/theme/styles';
import { COLORS, SPACING } from '@/theme';

interface AccessDeniedProps {
    message?: string;
    showBackButton?: boolean;
}

const AccessDenied = ({
    message = "You don't have permission to access this feature.",
    showBackButton = true
}: AccessDeniedProps) => {
    const navigation = useNavigation();

    return (
        <View style={[appStyles.container, appStyles.center]}>
            <Text
                style={[
                    appStyles.title,
                    { color: COLORS.error, marginBottom: 8 }
                ]}
            >
                Access Denied
            </Text>
            <Text style={[appStyles.subheading, { textAlign: 'center' }]}>
                {message}
            </Text>
            {showBackButton && (
                <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: SPACING.md }}
                >
                    Go Back
                </Button>
            )}
        </View>
    );
};

export default AccessDenied;
