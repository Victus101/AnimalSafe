/**
 * Modal Screen (Deprecated)
 * This file is kept for backward compatibility but not used.
 * Use app/report.tsx for the "Reportar Salvita" modal instead.
 */

import { colors } from '@/src/theme';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  container: {
    flex: 1,
  },
});
