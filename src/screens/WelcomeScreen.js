// src/screens/WelcomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Dimensions, Modal, Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { TOTAL_LEVELS, TOTAL_QUESTIONS } from '../data/quizData';
import { useProgress } from '../hooks/ProgressContext';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// ── Info content (same data as InfoScreen) ──────────────────────────────────
const INFO_ROWS = [
  { label: 'DEGREE',     value: 'Bachelor of Science in Engineering (BSc)' },
  { label: 'PROGRAMME',  value: 'Creative Computing', sub: 'USTP – University of Applied Sciences St. Pölten' },
  { label: 'AUTHOR',     value: 'Augustine Onyirioha', sub: 'cc231027' },
  { label: 'SUPERVISOR', value: 'FH-Prof. Dr. Victor Adriel\nde Jesus Oliveira' },
  { label: 'YEAR',       value: '2026' },
];

function InfoRow({ theme, label, value, sub }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ fontSize: fontSizes.xs, fontWeight: '700', letterSpacing: 1, color: theme.primaryLight, marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontSize: fontSizes.sm, fontWeight: '600', color: theme.text, lineHeight: 20 }}>
        {value}
      </Text>
      {sub && (
        <Text style={{ fontSize: fontSizes.xs, color: theme.textMuted, lineHeight: 16 }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

// ── Info Modal ───────────────────────────────────────────────────────────────
function InfoModal({ visible, onClose, theme }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 65, friction: 11, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.94, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop — tap anywhere to close */}
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close info overlay">
        <Animated.View style={[ms.backdrop, { opacity: fadeAnim }]}>
          {/* Card — stop tap propagation so tapping the card doesn't close */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View style={[
              ms.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}>
              {/* Header gradient */}
              <LinearGradient
                colors={['#6C63FF', '#9B8FFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ms.header}
              >
                <View style={ms.headerRow}>
                  <View style={ms.headerIconBox}>
                    <Text style={{ fontSize: 22 }}>🎓</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={ms.headerLabel}>BACHELOR THESIS</Text>
                    <Text style={ms.headerTitle}>Gamified Learning for{'\n'}Accessibility Guidelines</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Info rows */}
              <View style={[ms.infoCard, { borderColor: theme.border }]}>
                <View style={[ms.accent, { backgroundColor: theme.primary }]} />
                <View style={ms.infoContent}>
                  {INFO_ROWS.map((row, i) => (
                    <React.Fragment key={row.label}>
                      <InfoRow theme={theme} label={row.label} value={row.value} sub={row.sub} />
                      {i < INFO_ROWS.length - 1 && (
                        <View style={[ms.divider, { backgroundColor: theme.border }]} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>

              {/* Research question */}
              <Text style={[ms.research, { color: theme.textSecondary }]}>
                "Does a gamified quiz app improve students' understanding of mobile accessibility guidelines?"
              </Text>

              {/* Close hint */}
              <Text style={[ms.hint, { color: theme.textMuted }]}>
                Tap anywhere to close
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const ms = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIconBox: {
    width: 48, height: 48,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.70)',
  },
  headerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.base,
    color: '#fff',
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  accent: {
    width: 4,
  },
  infoContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  research: {
    fontSize: fontSizes.xs,
    lineHeight: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
    paddingBottom: spacing.md,
  },
});

// ── WelcomeScreen ────────────────────────────────────────────────────────────
export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { loadProgressForUser } = useProgress();
  const [username, setUsername] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const s = styles(theme);

  const handleStart = async () => {
    if (username.trim().length === 0) return;
    const trimmed = username.trim();
    await loadProgressForUser(trimmed);
    navigation.navigate('LevelSelect', { username: trimmed });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      {/* ── Info icon top-right ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          style={[s.infoBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
          onPress={() => setInfoVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="About this app"
          accessibilityHint="Opens thesis information overlay"
        >
          <Text style={[s.infoBtnText, { color: theme.primaryLight }]}>ℹ</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <View style={s.hero}>
            <View style={s.iconGlow} />
            <LinearGradient
              colors={['#6C63FF', '#8B85FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.appIcon}
            >
              <Text style={s.appIconEmoji} accessibilityLabel="Accessibility Quest icon">♿</Text>
            </LinearGradient>
            <Text style={s.appTitle} accessibilityRole="header">
              Accessibility{'\n'}Quest
            </Text>
            <Text style={s.appTagline}>
              Learn mobile accessibility guidelines through interactive quizzes.
            </Text>
          </View>

          {/* ── Stats row ── */}
          <View style={s.statsRow} accessibilityLabel={`${TOTAL_LEVELS} levels, ${TOTAL_QUESTIONS} questions, WCAG standard`}>
            <View style={s.statPill}>
              <Text style={s.statNum}>{TOTAL_LEVELS}</Text>
              <Text style={s.statDesc}>Levels</Text>
            </View>
            <View style={s.statPill}>
              <Text style={s.statNum}>{TOTAL_QUESTIONS}+</Text>
              <Text style={s.statDesc}>Questions</Text>
            </View>
            <View style={s.statPill}>
              <Text style={s.statNum}>WCAG</Text>
              <Text style={s.statDesc}>Standard</Text>
            </View>
          </View>

          {/* ── Username input ── */}
          <View style={s.inputSection}>
            <Text style={s.inputLabel} accessibilityRole="text">
              Your username
            </Text>
            <TextInput
              style={[s.input, inputFocused && s.inputFocused]}
              placeholder="e.g. alex_uni"
              placeholderTextColor={theme.textMuted}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleStart}
              accessibilityLabel="Enter your username"
              accessibilityHint="Type a username then tap Start Learning"
            />
          </View>

          {/* ── CTA Button ── */}
          <TouchableOpacity
            style={[s.primaryBtn, !username.trim() && s.primaryBtnDisabled]}
            onPress={handleStart}
            disabled={!username.trim()}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Start Learning"
            accessibilityState={{ disabled: !username.trim() }}
          >
            <Text style={s.primaryBtnText}>Start Learning →</Text>
          </TouchableOpacity>

          <Text style={s.footnote}>
            No account needed · Progress saved locally per username
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Info Modal ── */}
      <InfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  topBar: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,          // perfect circle
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtnText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconGlow: {
    position: 'absolute',
    top: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(108,99,255,0.18)',
  },
  appIcon: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
  appIconEmoji: { fontSize: 38 },
  appTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xxxl,
    color: theme.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  appTagline: {
    fontSize: fontSizes.md,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statPill: {
    flex: 1,
    backgroundColor: theme.surface2,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xl,
    color: theme.primaryLight,
  },
  statDesc: {
    fontSize: fontSizes.xs,
    color: theme.textSecondary,
    marginTop: 2,
  },
  inputSection: { marginBottom: spacing.md },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: theme.surface2,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.base,
    color: theme.text,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginBottom: spacing.md,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  footnote: {
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: theme.textMuted,
  },
});