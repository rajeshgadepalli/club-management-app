import { MD3LightTheme, MD3Theme } from "react-native-paper";
import { COLORS } from "./colors";
import TYPOGRAPHY from "./typography.new";

export * from "./colors";
export * from "./spacing";
export * from "./shadows";
export * from "./types";

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    surface: COLORS.surface,
    surfaceVariant: COLORS.surface,
    error: COLORS.status.error,
    background: COLORS.background,
  }
};
