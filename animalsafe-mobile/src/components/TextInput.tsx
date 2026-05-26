/**
 * Custom TextInput Component
 * Styled input field with icon support
 */

import { colors, spacing } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface StyledTextInputProps extends TextInputProps {
  icon?: string & {};
  error?: string;
  showPasswordToggle?: boolean;
  onPasswordToggle?: (show: boolean) => void;
  isPasswordVisible?: boolean;
}

export const StyledTextInput = React.forwardRef<TextInput, StyledTextInputProps>(
  (
    {
      icon,
      error,
      showPasswordToggle = false,
      onPasswordToggle,
      isPasswordVisible = false,
      style,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    return (
      <View>
        <View
          style={[
            styles.container,
            error && styles.containerError,
          ]}
        >
          {icon && (
            <MaterialCommunityIcons
              name={icon as any}
              size={20}
              color={error ? colors.error : colors.primary}
              style={styles.icon}
            />
          )}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.textTertiary}
            secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => onPasswordToggle?.(!isPasswordVisible)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialCommunityIcons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={14}
              color={colors.error}
              style={{ marginRight: spacing.xs }}
            />
          </View>
        )}
      </View>
    );
  }
);

StyledTextInput.displayName = 'StyledTextInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.bgSecondary,
  },
  containerError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'System',
  },
  eyeIcon: {
    marginLeft: spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
});
