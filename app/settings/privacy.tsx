import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';

export default function PrivacyScreen() {
  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>隐私政策</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.text}>
            Home Bar 当前不会将你的酒柜数据、收藏记录、制作记录或自定义酒谱上传到服务器。
          </Text>
          <Text style={styles.text}>
            所有数据默认保存在设备本地的 AsyncStorage 中。删除 App 可能会导致本地数据被清除。
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
