/**
 * Bottom Tab Navigation with Premium "Reportar Salvita" Button
 * Main navigation structure for AnimalSafe
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/src/theme';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          sceneStyle: styles.scene,
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ),
          }}
        />

        {/* Notifications Tab */}
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notificaciones',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" size={24} color={color} />
            ),
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabBar: {
    backgroundColor: colors.bgPrimary,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,

    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 8,
  },

  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
  },

  scene: {
    backgroundColor: colors.bgPrimary,
  },
});