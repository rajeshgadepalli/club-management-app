import { TextStyle } from 'react-native';
import { MD3TypescaleKey } from 'react-native-paper/lib/typescript/types';

// Font families
const FONT_FAMILY = {
  regular: 'Lato-Regular',
  medium: 'Lato-Regular', // Medium weight of regular
  bold: 'Lato-Bold',
} as const;

// Base font definitions
export const BASE_FONTS = {
  regular: {
    fontFamily: FONT_FAMILY.regular,
  },
  medium: {
    fontFamily: FONT_FAMILY.medium,
  },
  light: {
    fontFamily: FONT_FAMILY.regular,
  },
  thin: {
    fontFamily: FONT_FAMILY.regular,
  },
  headingBold: {
    fontFamily: FONT_FAMILY.bold,
  },
  headingRegular: {
    fontFamily: FONT_FAMILY.regular,
  },
};

// MD3 Typography Scale
export const TYPOGRAPHY: Record<MD3TypescaleKey, TextStyle> = {
  ...BASE_FONTS,
  displayLarge: {
    ...BASE_FONTS.regular,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displayMedium: {
    ...BASE_FONTS.regular,
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displaySmall: {
    ...BASE_FONTS.regular,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineLarge: {
    ...BASE_FONTS.regular,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineMedium: {
    ...BASE_FONTS.regular,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineSmall: {
    ...BASE_FONTS.regular,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: '400',
  },
  titleLarge: {
    ...BASE_FONTS.medium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '500',
  },
  titleMedium: {
    ...BASE_FONTS.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '500',
  },
  titleSmall: {
    ...BASE_FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  bodyLarge: {
    ...BASE_FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '400',
  },
  bodyMedium: {
    ...BASE_FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400',
  },
  bodySmall: {
    ...BASE_FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '400',
  },
  labelLarge: {
    ...BASE_FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  labelMedium: {
    ...BASE_FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  labelSmall: {
    ...BASE_FONTS.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
};

export type TypographyKey = keyof typeof TYPOGRAPHY;

export default TYPOGRAPHY;
