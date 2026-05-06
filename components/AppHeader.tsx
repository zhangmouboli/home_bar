import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface AppHeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

export default function AppHeader({
  title = '家庭酒吧',
  onMenuPress,
  onProfilePress,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
        <MaterialIcons name="menu" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.iconBtn} onPress={onProfilePress}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin,
    paddingVertical: spacing.sm,
    height: 56,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMd,
    color: colors.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
  },
});
