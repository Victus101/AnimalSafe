/**
 * Reusable Button Component
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { colors, spacing } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        isButtonDisabled && styles.buttonDisabled,
        fullWidth && styles.buttonFullWidth,
        style,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.textInverse : colors.primary}
          />
        ) : (
          <>
            {icon && <View style={styles.buttonIcon}>{icon}</View>}
            <Text
              style={[
                styles.buttonText,
                styles[`buttonText_${variant}`],
                styles[`buttonText_${size}`],
                textStyle,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  // Sizes
  button_small: {
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  button_medium: {
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  button_large: {
    paddingVertical: spacing.lg,
    minHeight: 52,
  },

  // Variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.accent,
  },
  button_outline: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  // States
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonFullWidth: {
    width: '100%',
  },

  // Content
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },

  // Text
  buttonText: {
    fontWeight: '600' as const,
  },
  buttonText_primary: {
    color: colors.textInverse,
  },
  buttonText_secondary: {
    color: colors.textInverse,
  },
  buttonText_outline: {
    color: colors.primary,
  },
  buttonText_small: {
    fontSize: 12,
  },
  buttonText_medium: {
    fontSize: 14,
  },
  buttonText_large: {
    fontSize: 16,
  },
});
