/**
 * Loading Indicator Component
 * Premium minimal loading screen
 */

import { colors, spacing } from '@/src/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  fullScreen = false,
  size = 'large',
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator 
          size={size} 
          color={colors.primary}
          style={styles.indicator}
        />
      </View>
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#F7F2F5',
  },
  loaderContainer: {
    marginBottom: spacing.lg,
  },
  indicator: {
    transform: [{ scale: 1.2 }],
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: '500',
    letterSpacing: 0.3,
  }
});
