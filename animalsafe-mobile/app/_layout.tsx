import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useAuthStore } from '@/src/store/authStore';
import { colors } from '@/src/theme';

SplashScreen.preventAutoHideAsync();

const DEV_FORCE_LOGIN = false;

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  const hydrate = useAuthStore((s) => s.hydrate);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setReady(true);
      await SplashScreen.hideAsync();
    };

    init();
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
  }

  const showLogin = DEV_FORCE_LOGIN || !isAuthenticated;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {showLogin && <Stack.Screen name="login" />}

        {!showLogin && <Stack.Screen name="(tabs)" />}

        {!showLogin && <Stack.Screen name="report" />}
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}