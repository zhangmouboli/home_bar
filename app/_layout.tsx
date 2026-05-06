import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.outlineLight,
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: '首页',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="cabinet"
            options={{
              title: '酒柜',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="inventory-2" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="recommend"
            options={{
              title: '推荐',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="auto-awesome" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="recipes"
            options={{
              href: null,
              title: '酒谱库',
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: '我的',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="person" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="recipe/[id]"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: 'rgba(19, 19, 19, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    height: 85,
    paddingTop: 8,
    paddingBottom: 28,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
