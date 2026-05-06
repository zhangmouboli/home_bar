import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { CocktailMatch } from '../types';
import TagChip from './TagChip';

interface CocktailImageCardProps {
  match: CocktailMatch;
  variant?: 'full' | 'compact' | 'horizontal';
  onPress?: () => void;
}

const CARD_WIDTH = (Dimensions.get('window').width - spacing.pageMargin * 2 - spacing.sm) / 2;

export default function CocktailImageCard({ match, variant = 'full', onPress }: CocktailImageCardProps) {
  const { cocktail, matchPercent, status, missingIngredients } = match;

  const statusColor =
    status === 'canMake' ? colors.success : status === 'missingOne' ? colors.primary : colors.outlineLight;

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: cocktail.image }} style={styles.horizontalImage} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.horizontalName}>{cocktail.nameZh}</Text>
          <Text style={styles.horizontalSub}>{cocktail.nameEn}</Text>
          <View style={styles.horizontalTags}>
            {cocktail.tags.slice(0, 2).map((t) => (
              <Text key={t} style={styles.miniTag}>{t}</Text>
            ))}
          </View>
          {status === 'canMake' && (
            <View style={styles.matchBadge}>
              <MaterialIcons name="check-circle" size={14} color={colors.success} />
              <Text style={[styles.matchText, { color: colors.success }]}>配料齐全</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, variant === 'compact' && styles.compactCard]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: cocktail.image }} style={[styles.image, variant === 'compact' && styles.compactImage]} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
      >
        <View style={styles.matchRow}>
          <View style={[styles.matchBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.matchText, { color: statusColor }]}>{matchPercent}%</Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={1}>{cocktail.nameZh}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{cocktail.nameEn}</Text>
        {status !== 'canMake' && missingIngredients.length > 0 && (
          <View style={styles.missingRow}>
            <MaterialIcons name="info-outline" size={12} color={colors.primary} />
            <Text style={styles.missingText}>
              缺少 {missingIngredients.map((i) => i.name).join('、')}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 260,
    borderRadius: spacing.borderRadius.xl,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  compactCard: {
    width: CARD_WIDTH,
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactImage: {
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.cardPadding,
  },
  matchRow: {
    marginBottom: spacing.xs,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.pill,
  },
  matchText: {
    ...typography.labelSm,
    marginLeft: 4,
  },
  name: {
    ...typography.headlineMd,
    color: colors.text,
  },
  subtitle: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
  },
  missingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  missingText: {
    ...typography.labelSm,
    color: colors.primary,
    marginLeft: 4,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 31, 31, 0.85)',
    borderRadius: spacing.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md,
  },
  horizontalImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  horizontalInfo: {
    flex: 1,
    padding: spacing.cardPadding,
    justifyContent: 'center',
  },
  horizontalName: {
    ...typography.headlineMd,
    color: colors.text,
  },
  horizontalSub: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
  },
  horizontalTags: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  miniTag: {
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
