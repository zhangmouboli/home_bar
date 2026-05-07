import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useApp } from '../../hooks/useApp';
import { APP_VERSION, APP_VERSION_NAME } from '../../constants/version';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';
import StatCard from '../../components/StatCard';

const STAT_CARD_WIDTH = (Dimensions.get('window').width - spacing.pageMargin * 2 - spacing.sm) / 2;

export default function ProfileScreen() {
  const router = useRouter();
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
          <StatCard icon="inventory-2" value={state.ownedIngredientIds.length} label="我的酒柜" onPress={() => router.push('/cabinet')} cardWidth={STAT_CARD_WIDTH} />
          <StatCard icon="favorite" value={state.favoriteCocktailIds.length} label="我的收藏" onPress={() => router.push('/favorites')} cardWidth={STAT_CARD_WIDTH} />
          <StatCard icon="visibility" value={state.recentViewedCocktailIds.length} label="最近浏览" onPress={() => router.push('/recent')} cardWidth={STAT_CARD_WIDTH} />
          <StatCard icon="local-bar" value={state.madeCocktailIds.length} label="已制作" onPress={() => router.push('/made')} cardWidth={STAT_CARD_WIDTH} />
        </View>

        <Text style={styles.sectionTitle}>快捷入口</Text>
        <GlassCard style={styles.settingCard}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/shopping-list')} activeOpacity={0.7}>
            <MaterialIcons name="shopping-cart" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>补货清单</Text>
            <View style={styles.badgeRow}>
              {state.shoppingListIngredientIds.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{state.shoppingListIngredientIds.length}</Text>
                </View>
              )}
              <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
            </View>
          </TouchableOpacity>
        </GlassCard>

        <Text style={styles.sectionTitle}>偏好设置</Text>
        <GlassCard style={styles.settingCard}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/preferences/flavors')} activeOpacity={0.7}>
            <MaterialIcons name="tune" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>喜欢的口味</Text>
            <View style={styles.badgeRow}>
              {state.preferredFlavorTags.length > 0 && (
                <Text style={styles.preferenceHint}>{state.preferredFlavorTags.length} 项</Text>
              )}
              <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/preferences/alcohol')} activeOpacity={0.7}>
            <MaterialIcons name="local-bar" size={22} color={colors.textMuted} />
            <Text style={styles.settingLabel}>酒精度偏好</Text>
            <View style={styles.badgeRow}>
              {state.preferredAlcoholLevel !== 'any' && (
                <Text style={styles.preferenceHint}>
                  {state.preferredAlcoholLevel === 'low' ? '低酒精' : state.preferredAlcoholLevel === 'medium' ? '中等' : '偏高'}
                </Text>
              )}
              <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
            </View>
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
            { icon: 'security', label: '账号与安全', route: '/settings/account' },
            { icon: 'privacy-tip', label: '隐私政策', route: '/settings/privacy' },
            { icon: 'description', label: '用户协议', route: '/settings/terms' },
            { icon: 'info', label: '关于 Home Bar', route: '/settings/about' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={styles.divider} />}
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push(item.route)}>
                <MaterialIcons name={item.icon as any} size={22} color={colors.textMuted} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.outlineLight} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </GlassCard>

        <Text style={styles.version}>{APP_VERSION} · {APP_VERSION_NAME}</Text>
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
    paddingBottom: 150,
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
    justifyContent: 'space-between',
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: spacing.xs,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.background,
    fontWeight: '700',
  },
  preferenceHint: {
    ...typography.labelMd,
    color: colors.primary,
    marginRight: spacing.xs,
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
