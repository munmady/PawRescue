import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/js-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
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
  const reduce = useReducedMotion();
  const [loaded, error] = useFonts({ PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });

  useEffect(() => {
    if (error) throw error;
  }, [error]);
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider value={theme}>
      <StoreProvider>
        <StatusBar style="dark" />
        <View style={styles.outer}>
          <View style={styles.app}>
            {/* JavaScript stack: the same transitions on phones and on the web build.
                Pages slide in from the right (swipe back on phones); tasks (Report, Sign in) rise from the bottom. */}
            <Stack screenOptions={{ headerShown: false, cardStyle: { backgroundColor: color.page }, animation: reduce ? 'fade' : 'slide_from_right', gestureEnabled: true }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" options={{ animation: reduce ? 'fade' : 'slide_from_bottom', gestureDirection: 'vertical' }} />
              <Stack.Screen name="report" options={{ animation: reduce ? 'fade' : 'slide_from_bottom', gestureEnabled: false }} />
            </Stack>
            <ToastHost />
          </View>
        </View>
      </StoreProvider>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#e4e9f1' : color.page, alignItems: 'center' },
  app: { flex: 1, width: '100%', maxWidth: 440, backgroundColor: color.page, overflow: 'hidden' },
});
