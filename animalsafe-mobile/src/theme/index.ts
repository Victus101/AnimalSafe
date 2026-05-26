/**
 * Theme Export
 * Central point for design system
 */

export { colors, type ColorKey } from './colors';
export { spacing, type SpacingKey } from './spacing';
export { typography, type TypographyKey } from './typography';

// Default theme object for easy access
export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  typography: require('./typography').typography,
};
