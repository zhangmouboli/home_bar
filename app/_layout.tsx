import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.root}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
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
          </Stack>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
