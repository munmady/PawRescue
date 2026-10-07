import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import 'react-native-reanimated';

import { StoreProvider } from '@/src/store';
import { ToastHost } from '@/src/ui';
import { color } from '@/src/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: color.page, card: color.surface, text: color.ink, primary: color.action, border: color.line },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({ PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });

  useEffect(() => {
    if (error) throw error;
  }, [error]);
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={theme}>
      <StoreProvider>
        <StatusBar style="dark" />
        <View style={styles.outer}>
          <View style={styles.app}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.page }, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="report" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
            <ToastHost />
          </View>
        </View>
      </StoreProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#e4e9f1' : color.page, alignItems: 'center' },
  app: { flex: 1, width: '100%', maxWidth: 440, backgroundColor: color.page, overflow: 'hidden' },
});
