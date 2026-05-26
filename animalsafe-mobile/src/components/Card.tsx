/**
 * Reusable Card Component
 */

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const Container = onPress ? require('react-native').TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        styles[`card_${variant}`],
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  card_default: {
    backgroundColor: colors.bgPrimary,
  },
  card_elevated: {
    backgroundColor: colors.bgPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_outlined: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
