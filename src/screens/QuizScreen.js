// src/screens/QuizScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { levels } from '../data/quizData';
import { useCountdown } from '../hooks/useCountdown';
import CountdownTimer from '../components/CountdownTimer';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

const TIMER_SECONDS = 40;
const POINTS_PER_CORRECT = 100;
const POINTS_BONUS_FAST = 50;

// Shuffles an array and returns { shuffled, newCorrectIndex }
// so we always know which option is the correct one after shuffling.
function shuffleOptions(options, correctIndex) {
  const indexed = options.map((text, i) => ({ text, isCorrect: i === correctIndex }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    shuffledOptions: indexed.map(o => o.text),
    newCorrectIndex: indexed.findIndex(o => o.isCorrect),
  };
}

// Fisher-Yates shuffle for any array
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen({ navigation, route }) {
  const { theme, timerEnabled, hapticEnabled } = useTheme();
  const { levelId, username } = route.params;
  const level = levels.find(l => l.id === levelId);

  const initialIndex   = route.params?.questionIndex ?? 0;
  const initialPoints  = route.params?.sessionPoints ?? 0;
  const initialAnswers = route.params?.allAnswers ?? [];

  // questionOrder is an array of question IDs that defines the shuffle for
  // the whole session. It is created once on the first mount (questionIndex === 0)
  // and passed forward through every navigation.replace so every subsequent
  // QuizScreen mount uses the exact same order — preventing duplicates.
  const [questions] = useState(() => {
    const orderParam = route.params?.questionOrder;
    if (orderParam && orderParam.length > 0) {
      // Reconstruct ordered array from the persisted ID list
      return orderParam.map(id => level.questions.find(q => q.id === id)).filter(Boolean);
    }
    // First mount — shuffle and save the order
    return shuffleArray(level.questions);
  });

  // Derive the ID order so we can pass it forward via navigation params
  const questionOrder = questions.map(q => q.id);

  const [questionIndex, setQuestionIndex] = useState(initialIndex);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sessionPoints, setSessionPoints] = useState(initialPoints);
  const [answers, setAnswers]             = useState(initialAnswers);

  // Shuffled options for the current question
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [shuffledCorrectIndex, setShuffledCorrectIndex] = useState(0);

  // Refs so timer callback always sees latest values
  const answersRef            = useRef(initialAnswers);
  const sessionPointsRef      = useRef(initialPoints);
  const questionIndexRef      = useRef(initialIndex);
  const shuffledOptionsRef    = useRef([]);
  const shuffledCorrectRef    = useRef(0);

  const currentQ       = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  // Keep refs in sync
  useEffect(() => { answersRef.current = answers; },                       [answers]);
  useEffect(() => { sessionPointsRef.current = sessionPoints; },           [sessionPoints]);
  useEffect(() => { questionIndexRef.current = questionIndex; },           [questionIndex]);
  useEffect(() => { shuffledOptionsRef.current = shuffledOptions; },       [shuffledOptions]);
  useEffect(() => { shuffledCorrectRef.current = shuffledCorrectIndex; },  [shuffledCorrectIndex]);

  // ── Answer logic (uses refs so it's safe inside timer callback) ──
  const recordAnswer = (chosenIndex, timedOut = false) => {
    stop();

    const q              = questions[questionIndexRef.current];
    const isLast         = questionIndexRef.current === questions.length - 1;
    const correct        = !timedOut && chosenIndex === shuffledCorrectRef.current;
    const fast           = timeLeftRef.current > TIMER_SECONDS / 2;
    const pts            = correct ? POINTS_PER_CORRECT + (fast ? POINTS_BONUS_FAST : 0) : 0;
    // Time spent on this question in seconds
    const timeTaken      = timedOut ? TIMER_SECONDS : TIMER_SECONDS - timeLeftRef.current;

    const updatedAnswers = [
      ...answersRef.current,
      {
        questionId:    q.id,
        question:      q.text,
        selectedIndex: chosenIndex,
        correctIndex:  shuffledCorrectRef.current,
        options:       shuffledOptionsRef.current,
        correct,
        timedOut,
        pointsEarned:  pts,
        wcag:          q.wcag,
        timeTaken,
      },
    ];

    const updatedPoints = sessionPointsRef.current + pts;

    answersRef.current       = updatedAnswers;
    sessionPointsRef.current = updatedPoints;

    setAnswers(updatedAnswers);
    setSessionPoints(updatedPoints);

    setTimeout(() => navigation.replace('Feedback', {
      answer:         updatedAnswers[updatedAnswers.length - 1],
      questionIndex:  questionIndexRef.current,
      totalQuestions: questions.length,
      sessionPoints:  updatedPoints,
      levelId,
      username,
      allAnswers:     updatedAnswers,
      isLastQuestion: isLast,
      questionOrder,
    }), 0);
  };

  // ── Timer ──
  const timeLeftRef = useRef(TIMER_SECONDS);
  const handleExpire = () => recordAnswer(null, true);
  const { timeLeft, start, stop, timerState } = useCountdown(TIMER_SECONDS, handleExpire);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Shuffle options and start timer whenever the question changes
  useEffect(() => {
    setSelectedIndex(null);

    const { shuffledOptions: opts, newCorrectIndex } = shuffleOptions(
      currentQ.options,
      currentQ.correctIndex,
    );
    setShuffledOptions(opts);
    setShuffledCorrectIndex(newCorrectIndex);

    // Keep refs in sync immediately (state update is async)
    shuffledOptionsRef.current = opts;
    shuffledCorrectRef.current = newCorrectIndex;

    // Only start the countdown if the timer setting is enabled
    if (timerEnabled) {
      start();
    } else {
      // Make sure any previous interval is cleared
      stop();
    }
  }, [questionIndex, timerEnabled]);

  // ── Select handler ──
  const handleSelect = (index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => recordAnswer(index), 400);
  };

  const handleBack = () => {
    Alert.alert(
      'Quit Quiz?',
      'Your progress on this level will be lost. Are you sure you want to go back?',
      [
        { text: 'Keep Playing', style: 'cancel' },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            stop();
            navigation.goBack();
          },
        },
      ],
    );
  };

  // Intercept Android hardware/gesture back button
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true; // returning true prevents default back behaviour
      });
      return () => subscription.remove();
    }, [])
  );

  const s = styles(theme);
  const progressPct = (questionIndex / questions.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>

      {/* ── Header ── */}
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={s.header}>
        <View style={s.headerTop}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back to level select"
          >
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text
            style={s.progressText}
            accessibilityLabel={`Question ${questionIndex + 1} of ${questions.length}`}
          >
            Question {questionIndex + 1} of {questions.length}
          </Text>

          <View
            style={s.scoreBadge}
            accessibilityLabel={`Score: ${sessionPoints} points`}
          >
            <Text style={s.scoreBadgeText}>⚡ {sessionPoints} pts</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={s.progressTrack}
          accessibilityRole="progressbar"
          accessibilityValue={{ now: questionIndex + 1, min: 1, max: questions.length }}
        >
          <View style={[s.progressFill, { width: `${progressPct}%` }]} />
        </View>

        {/* Countdown timer — only shown when timer setting is on */}
        {timerEnabled && (
          <CountdownTimer
            timeLeft={timeLeft}
            totalTime={TIMER_SECONDS}
            timerState={timerState}
          />
        )}
      </View>

      {/* ── Question + choices ── */}
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Question card */}
        <View style={s.questionCard}>
          <Text style={s.levelTag}>
            {level.emoji} {level.title} · Level {level.id}
          </Text>
          <Text
            style={s.questionText}
            accessibilityLabel={currentQ.text}
          >
            {currentQ.text}
          </Text>
        </View>

        {/* Answer choices (shuffled) */}
        <View
          style={s.choicesList}
          accessibilityRole="radiogroup"
          accessibilityLabel="Answer choices"
        >
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedIndex === index;
            const letter = ['A', 'B', 'C', 'D'][index];
            return (
              <TouchableOpacity
                key={index}
                style={[s.choiceBtn, isSelected && s.choiceBtnSelected]}
                onPress={() => handleSelect(index)}
                activeOpacity={0.75}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${letter}: ${option}`}
              >
                <View style={[s.choiceLetter, isSelected && s.choiceLetterSelected]}>
                  <Text style={[s.choiceLetterText, isSelected && { color: '#fff' }]}>
                    {letter}
                  </Text>
                </View>
                <Text style={s.choiceText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40, height: 40,
    backgroundColor: theme.surface2,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  backArrow: {
    fontSize: 24,
    color: theme.text,
    lineHeight: 28,
  },
  progressText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  scoreBadge: {
    backgroundColor: theme.primaryDim,
    borderRadius: radii.full,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  scoreBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: theme.primaryLight,
  },
  progressTrack: {
    height: 6,
    backgroundColor: theme.surface3,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: theme.primary,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  questionCard: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  levelTag: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.primaryLight,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: theme.text,
    lineHeight: 26,
  },
  choicesList: {
    gap: spacing.sm + 4,
  },
  choiceBtn: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
  },
  choiceBtnSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primaryDim,
  },
  choiceLetter: {
    width: 32, height: 32,
    borderRadius: 10,
    backgroundColor: theme.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  choiceLetterSelected: {
    backgroundColor: theme.primary,
  },
  choiceLetterText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  choiceText: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '500',
    color: theme.text,
    lineHeight: 22,
  },
});