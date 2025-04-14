import { COLORS, SPACING } from '@/theme';
import { appStyles } from '@/theme/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Text, HelperText } from 'react-native-paper';

interface RadioOption {
    label: string;
    value: string;
}

interface CustomRadioGroupProps {
    label: string;
    options: RadioOption[];
    value: string;
    onValueChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
    label,
    options,
    value,
    onValueChange,
    error,
    disabled = false
}) => {
    return (
        <View style={appStyles.inputContainer}>
            <Text
                style={[
                    styles.groupLabel,
                    disabled && styles.disabledLabel,
                    error && styles.errorLabel
                ]}
            >
                {label}
            </Text>
            <RadioButton.Group onValueChange={onValueChange} value={value}>
                {options.map((option) => (
                    <View key={option.value} style={styles.optionContainer}>
                        <RadioButton
                            value={option.value}
                            disabled={disabled}
                            color={COLORS.primary}
                        />
                        <Text
                            style={[
                                styles.optionLabel,
                                disabled && styles.disabledLabel
                            ]}
                        >
                            {option.label}
                        </Text>
                    </View>
                ))}
            </RadioButton.Group>
            {error && <HelperText type="error">{error}</HelperText>}
        </View>
    );
};

const styles = StyleSheet.create({
    groupLabel: {
        fontSize: SPACING.md,
        marginBottom: SPACING.sm,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xs,
    },
    optionLabel: {
        marginLeft: SPACING.sm,
    },
    disabledLabel: {
        color: COLORS.text,
    },
    errorLabel: {
        color: COLORS.status.error,
    },
});

export default CustomRadioGroup;