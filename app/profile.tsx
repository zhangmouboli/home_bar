import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useApp } from '../hooks/useApp';
import AppHeader from '../components/AppHeader';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';

export default function ProfileScreen() {
  const { state } = useApp();
  const [hideNonAlc, setHideNonAlc] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(true);

  return (
    <View style={styles.root}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.username}>Mixologist Alex</Text>
          <Text style={styles.level}>5级调酒师</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard icon="inventory-2" value={state.ownedIngredientIds.length} label="我的酒柜" />
          <StatCard icon="favorite" value={state.favoriteCocktailIds.length} label="我的收藏" />
          <StatCard icon="visibility" value={state.recentViewedCocktailIds.length} label="最近浏览" />
          <StatCard icon="local-bar" value={state.madeCocktailIds.length} label="已制作" />
        </View>

        <Text style={styles.sectionTitle}>偏好设置</Text>
        <GlassCard style={styles.settingCard}>
          <TouchableOpacity style={styles.settingRow}>
            <MaterialIcons name="tune" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>喜欢的口味</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <MaterialIcons name="local-bar" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>酒精度偏好</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <MaterialIcons name="block" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>隐藏无酒精</Text>
            <Switch
              value={hideNonAlc}
              onValueChange={setHideNonAlc}
              trackColor={{ false: colors.surfaceHigh, true: colors.primaryDark }}
              thumbColor={hideNonAlc ? colors.primary : colors.outlineLight}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <MaterialIcons name="school" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>新手模式</Text>
            <Switch
              value={beginnerMode}
              onValueChange={setBeginnerMode}
              trackColor={{ false: colors.surfaceHigh, true: colors.primaryDark }}
              thumbColor={beginnerMode ? colors.primary : colors.outlineLight}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>系统设置</Text>
        <GlassCard style={styles.settingCard}>
          {[
            { icon: 'security', label: '账号与安全' },
            { icon: 'privacy-tip', label: '隐私政策' },
            { icon: 'description', label: '用户协议' },
            { icon: 'info', label: '关于 Home Bar' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={styles.divider} />}
              <TouchableOpacity style={styles.settingRow}>
                <MaterialIcons name={item.icon as any} size={22} color={colors.textMuted} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </GlassCard>

        <Text style={styles.version}>v2.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  username: {
    ...typography.headlineLg,
    color: colors.text,
  },
  level: {
    ...typography.labelMd,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.pageMargin,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  settingCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
  },
  settingLabel: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  version: {
    ...typography.labelMd,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
