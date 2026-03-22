// src/screens/FeedbackScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { levels } from '../data/quizData';
import { useProgress } from '../hooks/ProgressContext';
import { StatusBar } from 'expo-status-bar';

// Sound playback is stubbed out until a dev build replaces Expo Go.
// Drop correct.mp3 / incorrect.mp3 into assets/sounds/ and restore
// the expo-av implementation when ready.
const loadSound = () => null;

export default function FeedbackScreen({ navigation, route }) {
  const { theme, soundEnabled, reduceMotion } = useTheme();
  const { completeLevel } = useProgress();
  const {
    answer,
    questionIndex,
    totalQuestions,
    sessionPoints,
    levelId,
    username,
    allAnswers,
    isLastQuestion,
    questionOrder,
  } = route.params;

  const { correct, timedOut, pointsEarned, wcag } = answer;
  const feedbackType = timedOut ? 'timeout' : correct ? 'correct' : 'incorrect';

  // Sound playback stubbed — restore with expo-av in a dev build
  useEffect(() => {}, []);

  // Slide-up animation for the sheet
  const slideAnim = useRef(new Animated.Value(reduceMotion ? 0 : 300)).current;
  const fadeAnim  = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) return; // already at final values
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    if (isLastQuestion) {
      const correctCount   = allAnswers.filter(a => a.correct).length;
      const totalTimeTaken = allAnswers.reduce((sum, a) => sum + (a.timeTaken ?? 0), 0);
      await completeLevel(levelId, correctCount, totalQuestions, sessionPoints, totalTimeTaken);

      navigation.reset({
        index: 2,
        routes: [
          { name: 'Welcome',     params: { username } },
          { name: 'LevelSelect', params: { username, justCompletedLevelId: levelId } },
          { name: 'Results',     params: {
            levelId,
            username,
            allAnswers,
            sessionPoints,
            correctCount,
            totalQuestions,
            totalTimeTaken,
          }},
        ],
      });
    } else {
      navigation.replace('Quiz', {
        levelId,
        username,
        questionIndex: questionIndex + 1,
        sessionPoints,
        allAnswers,
        questionOrder,
      });
    }
  };

  const s = styles(theme);

  const config = {
    correct: {
      icon: '✓',
      iconBg: theme.successDim,
      iconColor: theme.success,
      title: 'Correct!',
      titleColor: theme.success,
      gradientColors: theme.dark
        ? ['#0E2B1E', theme.bg]
        : ['#D6F5E8', theme.bg],
      borderColor: theme.success,
      pointsText: `✨ +${pointsEarned} points earned`,
      pointsColor: theme.gold,
      btnStyle: { backgroundColor: theme.success },
      btnTextColor: theme.dark ? '#0A1F12' : '#fff',
      btnLabel: 'Continue',
    },
    incorrect: {
      icon: '✕',
      iconBg: theme.errorDim,
      iconColor: theme.error,
      title: 'Not quite',
      titleColor: theme.error,
      gradientColors: theme.dark
        ? ['#2B0E16', theme.bg]
        : ['#FDDDE2', theme.bg],
      borderColor: theme.error,
      pointsText: 'No points this time',
      pointsColor: theme.textMuted,
      btnStyle: { backgroundColor: theme.surface2, borderWidth: 1.5, borderColor: theme.border },
      btnTextColor: theme.text,
      btnLabel: 'Continue',
    },
    timeout: {
      icon: '⏱',
      iconBg: theme.warningDim,
      iconColor: theme.warning,
      title: "Time's Up!",
      titleColor: theme.warning,
      gradientColors: theme.dark
        ? ['#1F1A0A', theme.bg]
        : ['#FFF4D6', theme.bg],
      borderColor: theme.warning,
      pointsText: 'No answer submitted · 0 pts',
      pointsColor: theme.textMuted,
      btnStyle: { backgroundColor: theme.surface2, borderWidth: 1.5, borderColor: theme.border },
      btnTextColor: theme.text,
      btnLabel: 'Continue',
    },
  }[feedbackType];

  const level = levels.find(l => l.id === levelId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      {/* Dimmed quiz header behind sheet */}
      <View style={[s.dimmedHeader, { opacity: 0.25 }]}>
        <View style={s.dimHeaderRow}>
          <View style={s.dimBackBtn} />
          <Text style={[s.dimText, { color: theme.textSecondary }]}>
            Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <View style={[s.dimBadge, { backgroundColor: theme.primaryDim }]}>
            <Text style={[s.dimBadgeText, { color: theme.primaryLight }]}>
              ⚡ {sessionPoints} pts
            </Text>
          </View>
        </View>
        <View style={[s.dimProgress, { backgroundColor: theme.surface3 }]}>
          <View style={[
            s.dimProgressFill,
            {
              width: `${(questionIndex / totalQuestions) * 100}%`,
              backgroundColor: theme.primary,
            },
          ]} />
        </View>
      </View>

      {/* ── Slide-up Feedback Sheet ── */}
      <Animated.View
        style={[
          s.sheetOuter,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <LinearGradient
          colors={config.gradientColors}
          style={[s.sheet, { borderTopColor: config.borderColor }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.sheetScroll}
          >
            {/* Icon */}
            <View
              style={[s.feedbackIcon, { backgroundColor: config.iconBg }]}
              accessibilityLabel={`${feedbackType} answer`}
            >
              <Text style={[s.feedbackIconText, { color: config.iconColor }]}>
                {config.icon}
              </Text>
            </View>

            {/* Title */}
            <Text
              style={[s.feedbackTitle, { color: config.titleColor }]}
              accessibilityRole="header"
            >
              {config.title}
            </Text>

            {/* Points */}
            <Text style={[s.feedbackPoints, { color: config.pointsColor }]}>
              {config.pointsText}
            </Text>

            {/* Show correct answer if wrong or timed out */}
            {(feedbackType === 'incorrect' || feedbackType === 'timeout') && (
              <View style={[s.correctAnswerBox, { backgroundColor: theme.successDim, borderColor: theme.success }]}>
                <Text style={[s.correctAnswerLabel, { color: theme.success }]}>
                  ✓ Correct answer
                </Text>
                <Text style={[s.correctAnswerText, { color: theme.text }]}>
                  {String.fromCharCode(65 + answer.correctIndex)}.{' '}
                  {answer.options[answer.correctIndex]}
                </Text>
              </View>
            )}

            {/* WCAG explanation */}
            <View style={[s.explanationBox, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
              <Text style={[s.explanationText, { color: theme.textSecondary }]}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>
                  📖 WCAG Reference:{'\n'}
                </Text>
                {wcag}
              </Text>
            </View>

            {/* Continue button */}
            <TouchableOpacity
              style={[s.continueBtn, config.btnStyle]}
              onPress={handleContinue}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={
                isLastQuestion
                  ? 'Continue to results'
                  : `Continue to question ${questionIndex + 2}`
              }
            >
              <Text style={[s.continueBtnText, { color: config.btnTextColor }]}>
                {isLastQuestion ? 'See Results 🏅' : `${config.btnLabel} → Q${questionIndex + 2}`}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  dimmedHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  dimHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dimBackBtn: {
    width: 40, height: 40,
    backgroundColor: theme.surface2,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  dimText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  dimBadge: {
    borderRadius: radii.full,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  dimBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  dimProgress: {
    height: 6,
    borderRadius: 100,
    overflow: 'hidden',
  },
  dimProgressFill: {
    height: '100%',
    borderRadius: 100,
  },
  sheetOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderTopWidth: 1.5,
    maxHeight: '82%',
  },
  sheetScroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  feedbackIcon: {
    width: 60, height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  feedbackIconText: {
    fontSize: 26,
    fontWeight: '700',
  },
  feedbackTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xxl,
    marginBottom: spacing.xs,
  },
  feedbackPoints: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  correctAnswerBox: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  correctAnswerLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  correctAnswerText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  explanationBox: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  explanationText: {
    fontSize: fontSizes.sm,
    lineHeight: 21,
  },
  continueBtn: {
    borderRadius: radii.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueBtnText: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
});