import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';

export default function TermsScreen() {
  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>用户协议</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.text}>
            Home Bar 提供家庭调酒记录、推荐和制作辅助功能。酒谱内容仅供参考，请根据自身情况理性饮酒。
          </Text>
          <Text style={styles.text}>
            请勿向未成年人提供酒精饮品。使用本 App 即表示你理解并同意自行承担饮酒相关责任。
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
