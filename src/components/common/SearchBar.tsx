import { SPACING } from '@/theme';
import { appStyles } from '@/theme/styles.new';
import React from 'react';
import { ViewStyle } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

const SearchBar = ({ value, onChangeText, placeholder, style }: SearchBarProps) => {
  const theme = useTheme();

  return (
    <Searchbar
      placeholder={placeholder || 'Search...'}
      onChangeText={onChangeText}
      value={value}
      style={[appStyles.inputContainer, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: '#E0E0E0', margin: SPACING.md }, style]}
      iconColor={theme.colors.primary}
      inputStyle={[
        { color: theme.colors.onSurface }
      ]}
      placeholderTextColor={theme.colors.onSurfaceVariant}
      elevation={0}
    />
  );
};

export default SearchBar;