import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';

export default function AccountScreen() {
  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>账号与安全</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.text}>
            当前版本采用本地模式，无需登录账号即可使用。你的酒柜、收藏、制作记录、自定义材料和自定义酒谱会保存在本机。
          </Text>
          <Text style={styles.text}>
            云同步、账号登录和多设备同步将在后续版本开放。
          </Text>
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
  text: {
    ...typography.bodyMd,
    color: colors.textMuted,
    lineHeight: 26,
    marginBottom: spacing.md,
  },
});
