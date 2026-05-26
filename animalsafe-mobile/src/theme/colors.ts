/**
 * AnimalSafe Color System
 * Soft Pink + White Minimal Design
 */

export const colors = {
  // Primary
  primary: '#F48FB1',
  primaryLight: '#F8C8DB',
  primaryDark: '#EC407A',

  // Secondary
  secondary: '#FFFFFF',

  // Accent
  accent: '#FF8A80',
  accentLight: '#FFAB9E',
  accentDark: '#F46D63',

  // Status
  success: '#B9F6CA',
  successDark: '#81C784',
  error: '#FF8A80',
  warning: '#FFD54F',
  info: '#64B5F6',

  // Text
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Background
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  bgTertiary: '#F5F5F5',

  // Borders
  borderLight: '#EEEEEE',
  borderDefault: '#DDDDDD',
  borderDark: '#CCCCCC',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayLighter: 'rgba(0, 0, 0, 0.1)',

  // Special
  transparent: 'transparent',
};

export type ColorKey = keyof typeof colors;
