import { TextStyle, ViewStyle } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    border: string;
    inputBorder: string;
    status: {
      success: string,
      warning: string,
      error: string,
      info: string,
  },

  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    caption: number;
    bodySmall: number;
    bodyMedium: number;
    bodyLarge: number;
    titleSmall: number;
    titleMedium: number;
    titleLarge: number;
    headlineSmall: number;
    headlineMedium: number;
    headlineLarge: number;
  };
  fonts: {
    regular: TextStyle;
    medium: TextStyle;
    bold: TextStyle;
    semiBold: TextStyle;
    light: TextStyle;
  };
  shadows: {
    small: ViewStyle;
    medium: ViewStyle;
  };
  textVariants: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    h5: TextStyle;
    h6: TextStyle;
    body: TextStyle;
    label: TextStyle;
    caption: TextStyle;
  };
}