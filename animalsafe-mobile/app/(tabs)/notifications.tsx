/**
 * Notifications Screen
 * User notifications and activity updates
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';

// Mock notifications with caseIds
const mockNotifications = [
  {
    id: 1,
    caseId: 1,
    title: 'Nuevo caso cerca de ti',
    message: 'Perro herido a 0.5 km en Plaza de Armas',
    timestamp: 'hace 5 min',
    type: 'new_case',
    urgency: 'high',
    read: false,
  },
  {
    id: 2,
    caseId: 2,
    title: 'Tu reporte actualizado',
    message: 'El caso "Gato en Barrio Lastarria" fue actualizado a "En progreso"',
    timestamp: 'hace 1 hora',
    type: 'case_update',
    urgency: 'medium',
    read: false,
  },
  {
    id: 3,
    caseId: 3,
    title: 'Caso resuelto',
    message: 'El reporte de Ave herida fue marcado como resuelto. ¡Gracias!',
    timestamp: 'hace 3 horas',
    type: 'case_resolved',
    urgency: 'low',
    read: true,
  },
  {
    id: 4,
    caseId: 4,
    title: 'Voluntario se unió',
    message: '2 voluntarios se han unido para ayudar al Conejo perdido',
    timestamp: 'ayer',
    type: 'volunteer_joined',
    urgency: 'medium',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const handlePress = (caseId?: number) => {
    if (caseId) {
      router.push({
        pathname: '/case-detail',
        params: { id: caseId }
      });
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'new_case':
          return 'bell-alert';
        case 'case_update':
          return 'clipboard-list';
        case 'case_resolved':
          return 'check-circle';
        case 'volunteer_joined':
          return 'heart-multiple';
        default:
          return 'bell';
      }
    };

    const isUrgent = item.urgency === 'high';

    return (
      <Pressable
        style={({ pressed }) => [
          styles.notificationCard,
          !item.read && styles.notificationUnread,
          isUrgent && !item.read && styles.urgentCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => handlePress(item.caseId)}
      >
        <View style={styles.notificationContent}>
          <View style={[
            styles.iconContainer,
            isUrgent ? styles.iconUrgent : styles.iconNormal,
            !item.read && styles.iconUnread
          ]}>
            <MaterialCommunityIcons
              name={getIcon(item.type)}
              size={24}
              color={
                isUrgent 
                  ? colors.error 
                  : (item.read ? colors.textTertiary : colors.primary)
              }
            />
          </View>

          <View style={styles.notificationText}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.notificationTitle,
                  !item.read && styles.notificationTitleBold,
                ]}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={styles.footerRow}>
              <Text style={styles.notificationTime}>{item.timestamp}</Text>
              {isUrgent && (
                <View style={styles.urgencyBadge}>
                  <Text style={styles.urgencyText}>PRIORIDAD ALTA</Text>
                </View>
              )}
            </View>
          </View>
          
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color={colors.borderLight} 
            style={styles.chevron}
          />
        </View>
      </Pressable>
    );
  };
const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Notificaciones</Text>
        <Pressable style={styles.markAllRead} hitSlop={10}>
          <Text style={styles.markAllReadText}>Marcar todo</Text>
        </Pressable>
      </View>

      {mockNotifications.length > 0 ? (
        <FlatList
          data={mockNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBg}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={40}
              color={colors.textTertiary}
            />
          </View>
          <Text style={styles.emptyTitle}>Todo al día</Text>
          <Text style={styles.emptyText}>Te avisaremos cuando haya nuevos casos cerca de ti.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgPrimary,
  },

  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  markAllRead: {
    paddingVertical: 4,
  },

  markAllReadText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.primary,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },

  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginRight: spacing.md,
  },

  iconNormal: {
    backgroundColor: '#F8F9FA',
  },

  iconUrgent: {
    backgroundColor: '#FFF5F5',
  },

  iconUnread: {
    backgroundColor: '#F0F7FF',
  },

  notificationText: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  notificationTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },

  notificationTitleBold: {
    color: colors.textPrimary,
  },

  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },

  notificationMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 1,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  notificationTime: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500' as const,
  },

  urgencyBadge: {
    backgroundColor: colors.error + '15',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },

  urgencyText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: colors.error,
  },

  chevron: {
    marginLeft: spacing.xs,
    opacity: 0.3,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});