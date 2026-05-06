import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Tab {
  key: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const tabs: Tab[] = [
  { key: 'index', label: '首页', icon: 'home-outlined', activeIcon: 'home' },
  { key: 'cabinet', label: '酒柜', icon: 'inventory-2-outlined', activeIcon: 'inventory-2' },
  { key: 'recommend', label: '推荐', icon: 'auto-awesome-outlined', activeIcon: 'auto-awesome' },
  { key: 'profile', label: '我的', icon: 'person-outline', activeIcon: 'person' },
];

interface BottomTabsProps {
  activeKey: string;
  onTabPress: (key: string) => void;
}

export default function BottomTabs({ activeKey, onTabPress }: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
              <MaterialIcons
                name={(isActive ? tab.activeIcon : tab.icon) as any}
                size={24}
                color={isActive ? colors.primary : colors.outlineLight}
              />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(19, 19, 19, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
  },
  label: {
    ...typography.labelSm,
    color: colors.outlineLight,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.primary,
  },
});
