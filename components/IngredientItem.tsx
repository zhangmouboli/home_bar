import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface IngredientItemProps {
  name: string;
  category: string;
  owned?: boolean;
  icon?: string;
  onToggle?: () => void;
  showBuy?: boolean;
  onBuy?: () => void;
  bought?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function IngredientItem({
  name,
  category,
  owned = true,
  icon = 'local-bar',
  onToggle,
  showBuy,
  onBuy,
  bought,
  onDelete,
  onEdit,
}: IngredientItemProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon as any} size={20} color={owned ? colors.primary : colors.outline} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, !owned && styles.nameMuted]}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      {showBuy ? (
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={onBuy}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MaterialIcons
            name={bought ? 'check-circle' : 'add-shopping-cart'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      ) : (
        <MaterialIcons
          name={owned ? 'check-circle' : 'add-circle-outline'}
          size={24}
          color={owned ? colors.success : colors.outline}
        />
      )}
      {onEdit && (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={onEdit}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MaterialIcons name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.pageMargin,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMd,
    color: colors.text,
  },
  nameMuted: {
    color: colors.textMuted,
  },
  category: {
    ...typography.labelSm,
    color: colors.outlineLight,
    marginTop: 2,
  },
  buyBtn: {
    padding: spacing.xs,
  },
  editBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  deleteBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
