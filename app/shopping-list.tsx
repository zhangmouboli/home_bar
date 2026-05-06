import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { ingredients, categoryLabels } from '../data/mock';
import { useApp } from '../hooks/useApp';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';

export default function ShoppingListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, removeFromShoppingList, clearShoppingList } = useApp();

  const listItems = state.shoppingListIngredientIds
    .map((id) => ingredients.find((i) => i.id === id))
    .filter((i): i is NonNullable<typeof i> => i !== undefined);

  const handleClear = () => {
    Alert.alert('清空清单', '确定要清空补货清单吗？', [
      { text: '取消', style: 'cancel' },
      { text: '清空', style: 'destructive', onPress: clearShoppingList },
    ]);
  };

  const handleRemove = (id: string) => {
    removeFromShoppingList(id);
  };

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>补货清单</Text>
          {listItems.length > 0 && (
            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
              <Text style={styles.clearText}>清空</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>{listItems.length} 项待购</Text>

        {listItems.length === 0 ? (
          <EmptyState
            icon="shopping-cart"
            message="暂无需要补货的材料"
            actionLabel="去看看推荐"
            onAction={() => router.push('/recommend')}
          />
        ) : (
          listItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <MaterialIcons name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{categoryLabels[item.category] || item.category}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item.id)}
                style={styles.removeBtn}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={20} color={colors.outlineLight} />
              </TouchableOpacity>
            </View>
          ))
        )}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.headlineXl,
    color: colors.text,
  },
  clearText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textMuted,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    paddingVertical: spacing.sm + 2,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.bodyMd,
    color: colors.text,
  },
  itemCategory: {
    ...typography.labelSm,
    color: colors.outlineLight,
    marginTop: 2,
  },
  removeBtn: {
    padding: spacing.xs,
  },
});
