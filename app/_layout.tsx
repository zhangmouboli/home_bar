import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { AppProvider } from '../context/AppContext';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setButtonStyleAsync('light').catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#131313' } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="recipes" />
            <Stack.Screen name="recipe/[id]" />
            <Stack.Screen name="make/[id]" />
            <Stack.Screen name="favorites" />
            <Stack.Screen name="recent" />
            <Stack.Screen name="made" />
            <Stack.Screen name="shopping-list" />
            <Stack.Screen name="preferences/flavors" />
            <Stack.Screen name="preferences/alcohol" />
            <Stack.Screen name="custom-recipe/new" />
            <Stack.Screen name="custom-recipe/[id]/edit" />
            <Stack.Screen name="settings/account" />
            <Stack.Screen name="settings/privacy" />
            <Stack.Screen name="settings/terms" />
            <Stack.Screen name="settings/about" />
          </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
