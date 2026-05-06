import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Cocktail, CocktailMatch } from '../types';
import { getCocktailImageSource } from '../utils/images';
import GlassCard from './GlassCard';

interface CocktailListItemProps {
  cocktail: Cocktail;
  match?: CocktailMatch;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onPress?: () => void;
  badge?: string;
}

export default function CocktailListItem({
  cocktail,
  match,
  isFavorite,
  onToggleFavorite,
  onPress,
  badge,
}: CocktailListItemProps) {
  const imageSource = getCocktailImageSource(cocktail.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={styles.card} noPadding>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameZh}>{cocktail.nameZh}</Text>
              <Text style={styles.nameEn}>{cocktail.nameEn}</Text>
            </View>
            {onToggleFavorite && (
              <TouchableOpacity onPress={onToggleFavorite} activeOpacity={0.7} style={styles.favBtn}>
                <MaterialIcons
                  name={isFavorite ? 'favorite' : 'favorite-border'}
                  size={22}
                  color={isFavorite ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
          {match && (
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="check-circle" size={14} color={match.status === 'canMake' ? colors.success : colors.outline} />
                <Text style={styles.metaText}>
                  已拥有 {match.ownedCount}/{match.totalRequired}
                </Text>
              </View>
              {match.missingCount > 0 && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="remove-circle-outline" size={14} color={colors.primary} />
                  <Text style={[styles.metaText, { color: colors.primary }]}>
                    缺少 {match.missingIngredients.map((i) => i.name).join('、')}
                  </Text>
                </View>
              )}
            </View>
          )}
          {badge && (
            <Text style={styles.badge}>{badge}</Text>
          )}
          <View style={styles.tagRow}>
            {cocktail.tags.slice(0, 4).map((t) => (
              <Text key={t} style={styles.tag}>{t}</Text>
            ))}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  info: {
    padding: spacing.cardPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameZh: {
    ...typography.headlineMd,
    color: colors.text,
  },
  nameEn: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
  },
  favBtn: {
    padding: spacing.xs,
  },
  meta: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginLeft: 6,
  },
  badge: {
    ...typography.labelMd,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    ...typography.labelSm,
    color: colors.outlineLight,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.pill,
    marginRight: spacing.xs,
    overflow: 'hidden',
  },
});
