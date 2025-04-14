import React from 'react';
import { StyleSheet, TextInputProps as RNTextInputProps, KeyboardType, View } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import { COLORS } from '@/theme';

interface TextFieldProps extends Omit<RNTextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
  type?: 'text' | 'number' | 'decimal' | 'phone' | 'pin';
}

export default function TextField({
  label,
  value,
  onChangeText,
  error,
  startIcon,
  endIcon,
  helperText,
  type = 'text',
  maxLength,
  ...props
}: TextFieldProps) {
  // Determine keyboard type based on input type
  const getKeyboardType = (): KeyboardType => {
    switch (type) {
      case 'number':
      case 'pin':
        return 'number-pad';
      case 'decimal':
        return 'decimal-pad';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  // Handle text change based on type
  const handleTextChange = (text: string) => {
    switch (type) {
      case 'number':
      case 'pin':
        // Only allow numbers
        const numericValue = text.replace(/[^0-9]/g, '');
        onChangeText(numericValue);
        break;
      case 'decimal':
        // Allow numbers and one decimal point
        const decimalValue = text.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        if ((decimalValue.match(/\./g) || []).length <= 1) {
          onChangeText(decimalValue);
        }
        break;
      case 'phone':
        // Only allow numbers, limit to 10 digits
        const phoneValue = text.replace(/[^0-9]/g, '');
        onChangeText(phoneValue);
        break;
      default:
        onChangeText(text);
    }
  };

  // Set maxLength based on type if not explicitly provided
  const getMaxLength = () => {
    if (maxLength) return maxLength;
    
    switch (type) {
      case 'phone':
        return 10;
      case 'pin':
        return 6;
      default:
        return undefined;
    }
  };

  return (
    <View>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleTextChange}
        error={!!error}
        left={startIcon ? <TextInput.Icon icon={() => startIcon} /> : undefined}
        right={endIcon ? <TextInput.Icon icon={() => endIcon} /> : undefined}
        style={styles.input}
        keyboardType={getKeyboardType()}
        maxLength={getMaxLength()}
        {...props}
      />
      {(error || helperText) && (
        <HelperText type={error ? "error" : "info"}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
  },
});