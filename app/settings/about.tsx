import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { APP_VERSION, APP_VERSION_NAME } from '../../constants/version';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';

const features = [
  '酒柜材料管理',
  '鸡尾酒推荐',
  '酒谱详情',
  '制作流程',
  '补货清单',
  '收藏与制作记录',
  '自定义材料',
  '自定义酒谱',
];

export default function AboutScreen() {
  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>关于 Home Bar</Text>

        <GlassCard style={styles.card}>
          <View style={styles.logoRow}>
            <MaterialIcons name="local-bar" size={36} color={colors.primary} />
            <View style={styles.logoText}>
              <Text style={styles.appName}>HOME BAR</Text>
              <Text style={styles.tagline}>家庭酒柜型调酒助手</Text>
            </View>
          </View>
          <Text style={styles.versionText}>{APP_VERSION} · {APP_VERSION_NAME}</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>核心功能</Text>
        <GlassCard style={styles.card}>
          {features.map((f, i) => (
            <View key={f} style={styles.featureRow}>
              <MaterialIcons name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  title: {
    ...typography.headlineXl,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: { marginHorizontal: spacing.pageMargin, marginBottom: spacing.md },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: { marginLeft: spacing.md },
  appName: {
    ...typography.headlineLg,
    color: colors.primary,
    letterSpacing: 3,
    fontWeight: '900',
  },
  tagline: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginTop: 2,
  },
  versionText: {
    ...typography.labelMd,
    color: colors.outlineLight,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  featureText: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
});
