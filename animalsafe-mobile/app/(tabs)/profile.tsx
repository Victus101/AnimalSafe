import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing } from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  // Debug log to verify reactive data
  console.log('USER IN PROFILE:', user);

  const getUserTypeLabel = (type?: string) => {
    switch (type) {
      case 'VOLUNTARIO': return '🐶 Voluntario';
      case 'RESCATISTA': return '🚑 Rescatista';
      case 'ACOGIDA': return '🏠 Casa de acogida';
      default: return '🐾 Miembro';
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace('/login');
  };

  // Safe Fallbacks
  const displayName = user?.name || user?.email?.split('@')[0] || 'Usuario';
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{userInitial}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="camera" size={16} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{displayName}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{getUserTypeLabel(user?.userType)}</Text>
          </View>
          <Text style={styles.memberSince}>{user?.email}</Text>
        </View>

        {/* Stats Row - Elevated */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.reportCount || 0}</Text>
            <Text style={styles.statLabel}>Reportes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Ayudadas</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Mi Actividad</Text>
          <TouchableOpacity style={styles.flatMenuItem} activeOpacity={0.6}>
            <View style={[styles.menuIconCircle, { backgroundColor: colors.primary + '10' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Mis reportes</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.borderDark} />
          </TouchableOpacity>
          <View style={styles.flatDivider} />

          <TouchableOpacity style={styles.flatMenuItem} activeOpacity={0.6}>
            <View style={[styles.menuIconCircle, { backgroundColor: colors.accent + '10' }]}>
              <MaterialCommunityIcons name="heart-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Casos guardados</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.borderDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ajustes</Text>
          <TouchableOpacity style={styles.flatMenuItem} activeOpacity={0.6}>
            <View style={[styles.menuIconCircle, { backgroundColor: colors.info + '10' }]}>
              <MaterialCommunityIcons name="bell-outline" size={20} color={colors.info} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Notificaciones</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.borderDark} />
          </TouchableOpacity>
          <View style={styles.flatDivider} />

          <TouchableOpacity style={styles.flatMenuItem} activeOpacity={0.6}>
            <View style={[styles.menuIconCircle, { backgroundColor: colors.success + '10' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.success} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Privacidad</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.borderDark} />
          </TouchableOpacity>
        </View>

        {/* Logout - Subtle */}
        <TouchableOpacity style={styles.subtleLogout} onPress={handleLogout} activeOpacity={0.5}>
          <Text style={styles.subtleLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AnimalSafe v1.0.0 • {user?.email}</Text>
        </View>
      </ScrollView>
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

  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl, // Increased top spacing
    paddingBottom: spacing.xl,
    backgroundColor: colors.bgPrimary,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  avatarInitial: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.bgPrimary,
  },

  profileName: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  roleBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },

  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  memberSince: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500' as const,
  },

  // Stats Row - Elevated White Card
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },

  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600' as const,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl, // More space between sections
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
    marginLeft: 4,
  },

  flatMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: spacing.md,
  },

  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTextContainer: {
    flex: 1,
  },

  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  flatDivider: {
    height: 1,
    backgroundColor: '#F8F9FA',
    marginLeft: 56,
  },

  // Logout
  subtleLogout: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  subtleLogoutText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.error,
    opacity: 0.7,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  footerText: {
    fontSize: 11,
    color: colors.textTertiary,
    opacity: 0.5,
    fontWeight: '600' as const,
  },
  });