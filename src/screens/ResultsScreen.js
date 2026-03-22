// src/screens/ResultsScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { levels } from '../data/quizData';
import { useProgress } from '../hooks/ProgressContext';
import { StatusBar } from 'expo-status-bar';

export default function ResultsScreen({ navigation, route }) {
  const { theme, reduceMotion } = useTheme();
  const { progress } = useProgress();
  const {
    levelId,
    username,
    allAnswers,
    sessionPoints,
    correctCount,
    totalQuestions,
    totalTimeTaken,
  } = route.params;

  const level        = levels.find(l => l.id === levelId);
  const accuracy     = Math.round((correctCount / totalQuestions) * 100);
  const nextLevel    = levels.find(l => l.id === levelId + 1);
  const wrongAnswers = allAnswers.filter(a => !a.correct);

  // Format seconds into "Xm Ys" or just "Ys"
  const formatTime = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };
  const avgTime = totalTimeTaken
    ? Math.round(totalTimeTaken / totalQuestions)
    : null;

  // ── Entrance animations — snap to final values instantly if reduceMotion is on ──
  const scaleAnim  = useRef(new Animated.Value(reduceMotion ? 1 : 0.7)).current;
  const fadeAnim   = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const slideAnim  = useRef(new Animated.Value(reduceMotion ? 0 : 40)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;
  const spinAnim   = useRef(new Animated.Value(0)).current;
  const isPerfect  = correctCount === totalQuestions;

  const spinInterpolate = spinAnim.interpolate({
    inputRange:  [0, 2],
    outputRange: ['0deg', '720deg'],
  });

  useEffect(() => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isPerfect) {
        // Single 360° spin with ease-in/out
        Animated.timing(spinAnim, {
          toValue: 2,
          duration:1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          // After spin settles, start the gentle badge pulse
          Animated.loop(
            Animated.sequence([
              Animated.timing(badgePulse, {
                toValue: 1.06,
                duration: 700,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(badgePulse, {
                toValue: 1,
                duration: 700,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ).start();
        });
      }
    });
  }, []);

  // ── Grade config ──
  const getGrade = () => {
    if (accuracy === 100) return { label: 'Perfect!',        emoji: '🏆', color: theme.gold };
    if (accuracy >= 80)  return { label: 'Level Complete!',  emoji: '🏅', color: theme.success };
    if (accuracy >= 60)  return { label: 'Good Effort!',     emoji: '⭐', color: theme.primary };
    return                      { label: 'Keep Practicing!', emoji: '💪', color: theme.warning };
  };
  const grade = getGrade();

  const s = styles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Trophy hero ── */}
        <Animated.View
          style={[
            s.hero,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={s.ringOuter}>
            <LinearGradient
              colors={[grade.color, theme.surface3]}
              style={s.ringGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[s.ringInner, { backgroundColor: theme.bg }]}>
                <Animated.Text
                  style={[
                    s.trophyEmoji,
                    isPerfect && { transform: [{ rotate: spinInterpolate }] },
                  ]}
                >
                  {grade.emoji}
                </Animated.Text>
              </View>
            </LinearGradient>
          </View>

          <Text style={[s.gradeTitle, { color: grade.color }]} accessibilityRole="header">
            {grade.label}
          </Text>
          <Text style={s.levelName}>
            {level.emoji} {level.title} · Level {level.id}
          </Text>
          <Text style={s.accuracyText}>
            {correctCount} of {totalQuestions} correct
          </Text>
        </Animated.View>

        {/* ── Perfect score badge ── */}
        {isPerfect && (
          <Animated.View style={[
            { opacity: fadeAnim, transform: [{ scale: badgePulse }] },
          ]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.perfectBadge}
            >
              <Text style={s.perfectBadgeEmoji}>🏆</Text>
              <View>
                <Text style={s.perfectBadgeTitle}>Perfect Score!</Text>
                <Text style={s.perfectBadgeSub}>5 out of 5 · Master of this level</Text>
              </View>
              <Text style={s.perfectBadgeStar}>⭐</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* ── Stats row ── */}
        <Animated.View
          style={[
            s.statsRow,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
          accessibilityLabel={`Points earned: ${sessionPoints}. Accuracy: ${accuracy}%.`}
        >
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: theme.gold }]}>+{sessionPoints}</Text>
            <Text style={s.statLabel}>Points</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: theme.success }]}>{accuracy}%</Text>
            <Text style={s.statLabel}>Accuracy</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: theme.primaryLight }]}>{correctCount}/{totalQuestions}</Text>
            <Text style={s.statLabel}>Correct</Text>
          </View>
        </Animated.View>

        {/* ── Time stats row ── */}
        <Animated.View
          style={[
            s.statsRow,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
          accessibilityLabel={`Total time: ${formatTime(totalTimeTaken)}. Average per question: ${formatTime(avgTime)}.`}
        >
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: theme.warning }]}>
              {formatTime(totalTimeTaken)}
            </Text>
            <Text style={s.statLabel}>Total Time</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: theme.warning }]}>
              {formatTime(avgTime)}
            </Text>
            <Text style={s.statLabel}>Avg / Question</Text>
          </View>
        </Animated.View>

        {/* ── Wrong answers review ── */}
        {wrongAnswers.length > 0 && (
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <Text style={s.sectionTitle}>REVIEW MISSED QUESTIONS</Text>

            {wrongAnswers.map((ans, i) => (
              <View key={i} style={s.reviewCard}>
                <Text style={s.reviewQ} numberOfLines={3}>
                  {ans.timedOut ? '⏱ ' : '✕ '}{ans.question}
                </Text>

                {ans.selectedIndex !== null && !ans.timedOut && (
                  <View style={[s.answerRow, { backgroundColor: theme.errorDim }]}>
                    <Text style={[s.answerLabel, { color: theme.error }]}>Your answer:</Text>
                    <Text style={[s.answerText, { color: theme.text }]}>
                      {String.fromCharCode(65 + ans.selectedIndex)}.{' '}
                      {ans.options[ans.selectedIndex]}
                    </Text>
                  </View>
                )}

                <View style={[s.answerRow, { backgroundColor: theme.successDim }]}>
                  <Text style={[s.answerLabel, { color: theme.success }]}>Correct answer:</Text>
                  <Text style={[s.answerText, { color: theme.text }]}>
                    {String.fromCharCode(65 + ans.correctIndex)}.{' '}
                    {ans.options[ans.correctIndex]}
                  </Text>
                </View>

                <View style={[s.wcagBox, { backgroundColor: theme.primaryDim }]}>
                  <Text style={[s.wcagText, { color: theme.primaryLight }]}>
                    📖 {ans.wcag}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* ── All correct celebration ── */}
        {wrongAnswers.length === 0 && (
          <Animated.View
            style={[s.perfectBox, { opacity: fadeAnim, borderColor: theme.gold }]}
          >
            <Text style={[s.perfectText, { color: theme.gold }]}>
              🌟 Flawless! You answered every question correctly!
            </Text>
          </Animated.View>
        )}

        {/* ── Action buttons ── */}
        <Animated.View
          style={[
            s.btnGroup,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {nextLevel && (
            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Quiz', { levelId: nextLevel.id, username })}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Continue to Level ${nextLevel.id}: ${nextLevel.title}`}
            >
              <Text style={s.primaryBtnText}>
                Continue → Level {nextLevel.id}: {nextLevel.title}
              </Text>
            </TouchableOpacity>
          )}

          {!nextLevel && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Leaderboard', { username })}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="You completed all levels! See the leaderboard"
            >
              <LinearGradient
                colors={['#6C63FF', '#9B8FFF']}
                style={s.primaryBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={s.primaryBtnText}>🎓 See Leaderboard →</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[s.secondaryBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Quiz', { levelId, username })}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Retry this level"
          >
            <Text style={[s.secondaryBtnText, { color: theme.text }]}>🔁 Retry Level</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.ghostBtn}
            onPress={() => navigation.navigate('LevelSelect', { username })}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Back to level select"
          >
            <Text style={[s.ghostBtnText, { color: theme.textSecondary }]}>← Back to Levels</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  ringOuter: {
    width: 120, height: 120,
    borderRadius: 60,
    marginBottom: spacing.lg,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  ringGradient: {
    width: 120, height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 94, height: 94,
    borderRadius: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyEmoji: { fontSize: 40 },
  gradeTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xxl + 2,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  levelName: {
    fontSize: fontSizes.md,
    color: theme.textSecondary,
    marginBottom: spacing.xs,
  },
  accuracyText: {
    fontSize: fontSizes.sm,
    color: theme.textMuted,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  perfectBadgeEmoji: { fontSize: 28 },
  perfectBadgeTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.base,
    color: '#3B2800',
  },
  perfectBadgeSub: {
    fontSize: fontSizes.xs,
    color: '#7A5200',
  },
  perfectBadgeStar: {
    fontSize: 20,
    marginLeft: 'auto',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xxl,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: theme.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.textMuted,
    marginBottom: spacing.md,
  },
  reviewCard: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderLeftWidth: 3,
    borderLeftColor: theme.error,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  reviewQ: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: theme.text,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  answerRow: {
    borderRadius: radii.sm,
    padding: spacing.sm + 2,
    gap: 3,
  },
  answerLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  answerText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    lineHeight: 20,
  },
  wcagBox: {
    borderRadius: radii.sm,
    padding: spacing.sm + 2,
  },
  wcagText: {
    fontSize: fontSizes.xs,
    lineHeight: 18,
  },
  perfectBox: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  perfectText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  btnGroup: {
    gap: spacing.sm + 2,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    borderRadius: radii.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  secondaryBtnText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  ghostBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  ghostBtnText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});