// src/screens/LevelSelectScreen.js
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { levels } from '../data/quizData';
import { useProgress } from '../hooks/ProgressContext';
import { StatusBar } from 'expo-status-bar';

const LEVEL_COLORS = {
  c1: ['rgba(108,99,255,0.22)', '#6C63FF'],
  c2: ['rgba(34,217,122,0.22)',  '#22D97A'],
  c3: ['rgba(255,190,61,0.22)',  '#FFBE3D'],
  c4: ['rgba(255,90,110,0.22)',  '#FF5A6E'],
  c5: ['rgba(80,200,255,0.22)',  '#50C8FF'],
  c6: ['rgba(255,140,0,0.22)',   '#FF8C00'],
  c7: ['rgba(0,210,200,0.22)',   '#00D2C8'],
  c8: ['rgba(180,100,255,0.22)', '#B464FF'],
};

export default function LevelSelectScreen({ navigation, route }) {
  const { theme, reduceMotion } = useTheme();
  const { progress } = useProgress();
  const username = route.params?.username ?? 'Player';
  const justCompletedLevelId = route.params?.justCompletedLevelId ?? null;
  const s = styles(theme);

  // One animated value per level for the completion pulse
  const pulseAnims = useRef(
    levels.reduce((acc, l) => {
      acc[l.id] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    if (!justCompletedLevelId || reduceMotion) return;
    const anim = pulseAnims[justCompletedLevelId];
    if (!anim) return;
    // Pulse glow: 0 → 1 → 0 three times then settle
    Animated.sequence([
      Animated.delay(200),
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        { iterations: 3 }
      ),
    ]).start();
  }, [justCompletedLevelId]);

  const getRankLabel = (pts) => {
    if (pts >= 1500) return 'Expert';
    if (pts >= 800)  return 'Advanced';
    if (pts >= 300)  return 'Intermediate';
    return 'Beginner';
  };

  const getLevelStatus = (level) => {
    if (progress.completedLevels.includes(level.id)) return 'completed';
    if (progress.unlockedLevels.includes(level.id))  return 'unlocked';
    return 'locked';
  };

  // Bug fix #1: only say "Welcome back" if the user has played before
  const hasPlayedBefore = progress.totalPoints > 0 || progress.completedLevels.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>

      {/* ── Top bar ── */}
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={s.topbar}>
  <Text style={s.topbarTitle} accessibilityRole="header">Levels</Text>
  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
    <TouchableOpacity
      style={s.iconBtn}
      onPress={() => navigation.navigate('Leaderboard', { username })}
      accessibilityRole="button"
      accessibilityLabel="Open leaderboard"
    >
      <Text style={{ fontSize: 20 }}>🏆</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={s.iconBtn}
      onPress={() => navigation.navigate('Settings', { username })}
      accessibilityRole="button"
      accessibilityLabel="Open settings"
    >
      <Text style={{ fontSize: 20 }}>⚙️</Text>
    </TouchableOpacity>
  </View>
  </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Points card ── */}
        <LinearGradient
          colors={['#6C63FF', '#9B8FFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.pointsCard}
          accessibilityLabel={`Total points: ${progress.totalPoints}. Rank: ${getRankLabel(progress.totalPoints)}`}
        >
          <Text style={s.pointsLabel}>Total Points</Text>
          <Text style={s.pointsValue}>{progress.totalPoints.toLocaleString()}</Text>
          {/* Bug fix #1: greet new users differently */}
          <Text style={s.pointsSub}>
            {hasPlayedBefore
              ? `Welcome back, ${username} 👋`
              : `Welcome, ${username} 👋`}
          </Text>
          <Text style={[s.pointsSub, { opacity: 0.75 }]}> 
            {getRankLabel(progress.totalPoints)} · {progress.completedLevels.length}/{levels.length} levels done
          </Text>

          <View style={s.badgeRow}>
            <View style={s.badge}>
              <Text style={s.badgeText}>
                ✅ {progress.completedLevels.length}/{levels.length} complete
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Level list ── */}
        <Text style={s.sectionTitle}>YOUR JOURNEY</Text>

        {levels.map((level) => {
          const status = getLevelStatus(level);
          const isLocked = status === 'locked';
          const isDone   = status === 'completed';
          const lp       = progress.levelProgress[level.id];
          const fillPct  = lp ? (lp.score / lp.total) * 100 : 0;
          const accentColor = LEVEL_COLORS[level.colorKey][1];
          const isPerfect = lp?.perfect === true;

          const isJustCompleted = level.id === justCompletedLevelId;
          const pulseAnim = pulseAnims[level.id];
          const glowColor = pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#FFD700'],
          });

          return (
            <Animated.View
              key={level.id}
              style={[
                s.levelCardWrapper,
                isJustCompleted && { borderColor: glowColor, borderWidth: 2 },
              ]}
            >
            <TouchableOpacity
              style={[
                s.levelCard,
                isDone   && s.levelCardDone,
                status === 'unlocked' && s.levelCardActive,
                isLocked && s.levelCardLocked,
                isJustCompleted && s.levelCardJustDone,
              ]}
              onPress={() => {
                if (!isLocked) {
                  navigation.navigate('Quiz', { levelId: level.id, username });
                }
              }}
              disabled={isLocked}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Level ${level.id}: ${level.title}. Status: ${status}.`}
              accessibilityState={{ disabled: isLocked }}
            >
              {/* Icon */}
              <View style={[s.levelIcon, { backgroundColor: LEVEL_COLORS[level.colorKey][0] }]}>
                <Text style={{ fontSize: 22 }}>{level.emoji}</Text>
              </View>

              {/* Info */}
              <View style={s.levelInfo}>
                <Text style={s.levelNum}>
                  LEVEL {level.id} · {status.toUpperCase()}
                </Text>
                <Text style={s.levelName}>{level.title}</Text>
                <View style={s.levelMeta}>
                  <View style={[s.xpBadge, { backgroundColor: theme.primaryDim }]}>
                    <Text style={[s.xpText, { color: theme.primaryLight }]}>
                      +{level.xp} XP
                    </Text>
                  </View>
                  <Text style={s.levelQs}>{level.questions.length} questions</Text>
                  {isPerfect && (
                    <View style={[s.perfectPill, { backgroundColor: '#FFF3CD' }]}>
                      <Text style={s.perfectPillText}>🏆 Perfect</Text>
                    </View>
                  )}
                </View>

                {/* Progress bar for started/completed levels */}
                {!isLocked && (
                  <View
                    style={s.progressTrack}
                    accessibilityLabel={`Progress: ${Math.round(fillPct)}%`}
                  >
                    <View
                      style={[
                        s.progressFill,
                        {
                          width: `${isDone ? 100 : fillPct}%`,
                          backgroundColor: isPerfect ? '#FFD700' : isDone ? theme.success : accentColor,
                        },
                      ]}
                    />
                  </View>
                )}
              </View>

              {/* Right indicator */}
              <Text style={s.levelArrow}>
                {isPerfect ? '🏆' : isDone ? '✓' : isLocked ? '🔒' : '›'}
              </Text>
            </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topbarTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: theme.text,
  },
  iconBtn: {
    width: 44, height: 44,
    backgroundColor: theme.surface2,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Points card
  pointsCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  pointsLabel: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  pointsValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 42,
    color: '#fff',
    lineHeight: 48,
    marginTop: 2,
  },
  pointsSub: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.70)',
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 4,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: '#fff',
  },

  // Section title
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.textMuted,
    marginBottom: spacing.md,
  },

  // Level cards
  levelCardWrapper: {
    borderRadius: radii.lg,
    marginBottom: spacing.sm + 4,
  },
  levelCard: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.lg,
    padding: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelCardJustDone: {
    borderColor: '#FFD700',
    backgroundColor: theme.dark ? 'rgba(255,215,0,0.06)' : 'rgba(255,215,0,0.08)',
  },
  levelCardActive: {
    borderColor: theme.primary,
    backgroundColor: theme.surface2,
  },
  levelCardDone: {
    borderColor: theme.success,
    opacity: 0.9,
  },
  levelCardLocked: {
    opacity: 0.4,
  },
  levelIcon: {
    width: 52, height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  levelInfo: {
    flex: 1,
    minWidth: 0,
  },
  levelNum: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: theme.textMuted,
    letterSpacing: 0.5,
  },
  levelName: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.base,
    color: theme.text,
    marginVertical: 3,
  },
  levelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  xpBadge: {
    borderRadius: radii.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  xpText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  levelQs: {
    fontSize: fontSizes.xs,
    color: theme.textMuted,
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.surface3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  levelArrow: {
    fontSize: 20,
    color: theme.textMuted,
    flexShrink: 0,
  },
  perfectPill: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  perfectPillText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: '#92610A',
  },
});