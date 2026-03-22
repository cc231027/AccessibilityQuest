// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { useProgress } from '../hooks/ProgressContext';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { exportAllParticipantData } from '../utils/exportData';

export default function SettingsScreen({ navigation, route }) {
  const { theme, isDark, toggleTheme, timerEnabled, toggleTimer, hapticEnabled, toggleHaptic, highContrast, toggleHighContrast, soundEnabled, toggleSound, reduceMotion, toggleReduceMotion } = useTheme();
  const { progress, resetProgress } = useProgress();
  const username = route.params?.username ?? 'Player';

  const [exporting, setExporting] = useState(false);

  const getRankLabel = (pts) => {
    if (pts >= 1500) return 'Expert';
    if (pts >= 800)  return 'Advanced';
    if (pts >= 300)  return 'Intermediate';
    return 'Beginner';
  };

  const handleToggleHaptic = async () => {
    if (!hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleHaptic();
  };

  // ── Export handler ──
  const handleExport = async () => {
    setExporting(true);
    const result = await exportAllParticipantData();
    setExporting(false);

    if (!result.success) {
      Alert.alert('Export Failed', result.message ?? 'Something went wrong.');
    }
    // On success the native share sheet has already opened — no alert needed
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all your scores, points and unlocked levels. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ],
    );
  };

  const s = styles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={s.topbar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.topbarTitle} accessibilityRole="header">Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Profile card ── */}
        <LinearGradient
          colors={['#6C63FF', '#9B8FFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.profileCard}
          accessibilityLabel={`Profile: ${username}. Rank ${getRankLabel(progress.totalPoints)}. ${progress.totalPoints} points.`}
        >
          <View style={s.profileAvatar}>
            <Text style={s.profileAvatarText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{username}</Text>
            <Text style={s.profileRank}>🏅 {getRankLabel(progress.totalPoints)} · {progress.totalPoints} pts</Text>
          </View>
        </LinearGradient>

        {/* ── Appearance ── */}
        <Text style={s.sectionTitle}>APPEARANCE</Text>
        <View style={s.themeTiles} accessibilityRole="radiogroup" accessibilityLabel="Choose app theme">
          <TouchableOpacity
            style={[s.themeTile, s.themeTileDark, isDark && { borderColor: theme.primary }]}
            onPress={() => { if (!isDark) toggleTheme(); }}
            accessibilityRole="radio"
            accessibilityState={{ checked: isDark }}
            accessibilityLabel="Dark mode"
          >
            {isDark && (
              <View style={[s.themeCheck, { backgroundColor: theme.primary }]}>
                <Text style={{ fontSize: 10, color: '#fff' }}>✓</Text>
              </View>
            )}
            <Text style={s.themeTileLabel}>🌙 Dark</Text>
            <View style={s.themeDots}>
              <View style={[s.themeDot, { width: 24, backgroundColor: '#6C63FF' }]} />
              <View style={[s.themeDot, { width: 16, backgroundColor: '#32324A' }]} />
              <View style={[s.themeDot, { width: 20, backgroundColor: '#32324A' }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.themeTile, s.themeTileLight, !isDark && { borderColor: theme.primary }]}
            onPress={() => { if (isDark) toggleTheme(); }}
            accessibilityRole="radio"
            accessibilityState={{ checked: !isDark }}
            accessibilityLabel="Light mode"
          >
            {!isDark && (
              <View style={[s.themeCheck, { backgroundColor: theme.primary }]}>
                <Text style={{ fontSize: 10, color: '#fff' }}>✓</Text>
              </View>
            )}
            <Text style={[s.themeTileLabel, { color: '#111128' }]}>☀️ Light</Text>
            <View style={s.themeDots}>
              <View style={[s.themeDot, { width: 24, backgroundColor: '#6C63FF' }]} />
              <View style={[s.themeDot, { width: 16, backgroundColor: '#D0D0E8' }]} />
              <View style={[s.themeDot, { width: 20, backgroundColor: '#D0D0E8' }]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <SettingsRow
            theme={theme}
            icon="🔆"
            iconBg="rgba(80,200,255,0.18)"
            label="High Contrast Mode"
            sublabel="Extra contrast for low vision users"
            value={highContrast}
            onToggle={toggleHighContrast}
            accessibilityLabel="High contrast mode"
          />
        </View>

        {/* ── Quiz Settings ── */}
        <Text style={s.sectionTitle}>QUIZ SETTINGS</Text>
        <View style={s.card}>
          <SettingsRow
            theme={theme}
            icon="⏱"
            iconBg="rgba(255,190,61,0.18)"
            label="40-Second Timer"
            sublabel="Each question has a countdown"
            value={timerEnabled}
            onToggle={toggleTimer}
            accessibilityLabel="40 second timer"
          />
          <View style={[s.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            theme={theme}
            icon="🔊"
            iconBg="rgba(34,217,122,0.18)"
            label="Sound Effects"
            sublabel="Audio cues for correct/incorrect answers"
            value={soundEnabled}
            onToggle={toggleSound}
            accessibilityLabel="Sound effects"
          />
          <View style={[s.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            theme={theme}
            icon="📳"
            iconBg={theme.surface3}
            label="Haptic Feedback"
            sublabel="Vibration on answer selection"
            value={hapticEnabled}
            onToggle={handleToggleHaptic}
            accessibilityLabel="Haptic feedback"
          />
        </View>

        {/* ── Accessibility ── */}
        <Text style={s.sectionTitle}>ACCESSIBILITY</Text>
        <View style={s.card}>
          <SettingsRow
            theme={theme}
            icon="✨"
            iconBg={theme.surface3}
            label="Reduce Motion"
            sublabel="Minimise animations throughout the app"
            value={reduceMotion}
            onToggle={toggleReduceMotion}
            accessibilityLabel="Reduce motion"
          />
        </View>

        {/* ── Account ── */}
        <Text style={s.sectionTitle}>ACCOUNT</Text>
        <View style={s.card}>

          {/* ── Export button ── */}
          <TouchableOpacity
            style={s.row}
            onPress={handleExport}
            disabled={exporting}
            accessibilityRole="button"
            accessibilityLabel="Export participant results"
            accessibilityHint="Generates a CSV file of all quiz results and opens the share sheet"
          >
            <View style={[s.rowIcon, { backgroundColor: 'rgba(108,99,255,0.18)' }]}>
              {exporting
                ? <ActivityIndicator size="small" color={theme.primary} />
                : <Text style={{ fontSize: 18 }}>📤</Text>
              }
            </View>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.primaryLight }]}>
                {exporting ? 'Preparing export…' : 'Export Results'}
              </Text>
              <Text style={s.rowSublabel}>
                Share a CSV of all participant scores
              </Text>
            </View>
            {!exporting && <Text style={[s.rowArrow, { color: theme.primaryLight }]}>›</Text>}
          </TouchableOpacity>

          <View style={[s.divider, { backgroundColor: theme.border }]} />

          {/* Reset */}
          <TouchableOpacity
            style={s.row}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Reset all progress"
            accessibilityHint="This will clear all your scores and levels"
          >
            <View style={[s.rowIcon, { backgroundColor: 'rgba(255,90,110,0.18)' }]}>
              <Text style={{ fontSize: 18 }}>🔄</Text>
            </View>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.error }]}>Reset Progress</Text>
              <Text style={s.rowSublabel}>Clear all scores and levels</Text>
            </View>
            <Text style={[s.rowArrow, { color: theme.error }]}>›</Text>
          </TouchableOpacity>

        </View>

        <Text style={s.version}>Accessibility Quest · v1.0.0</Text>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ theme, icon, iconBg, label, sublabel, value, onToggle, accessibilityLabel }) {
  return (
    <View style={rowStyles(theme).row}>
      <View style={[rowStyles(theme).icon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={rowStyles(theme).text}>
        <Text style={rowStyles(theme).label}>{label}</Text>
        <Text style={rowStyles(theme).sublabel}>{sublabel}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.surface3, true: theme.primary }}
        thumbColor={value ? '#fff' : theme.textMuted}
        accessibilityLabel={`${accessibilityLabel} toggle, currently ${value ? 'on' : 'off'}`}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

const rowStyles = (theme) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  icon: {
    width: 40, height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: { flex: 1 },
  label: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: theme.text,
  },
  sublabel: {
    fontSize: fontSizes.xs,
    color: theme.textMuted,
    marginTop: 2,
  },
});

const styles = (theme) => StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 44, height: 44,
    backgroundColor: theme.surface2,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borderWidth ?? 1.5,
    borderColor: theme.border,
  },
  backArrow: {
    fontSize: 24,
    color: theme.text,
    lineHeight: 28,
  },
  topbarTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: theme.text,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  profileAvatar: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    flexShrink: 0,
  },
  profileAvatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: '#fff',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.lg + 1,
    color: '#fff',
  },
  profileRank: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.textMuted,
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: theme.surface,
    borderWidth: theme.borderWidth ?? 1.5,
    borderColor: theme.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    marginLeft: spacing.lg + 40 + spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  rowIcon: {
    width: 40, height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowLabel: {
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  rowSublabel: {
    fontSize: fontSizes.xs,
    color: theme.textMuted,
    marginTop: 2,
  },
  rowArrow: { fontSize: 20 },
  themeTiles: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  themeTile: {
    flex: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  themeTileDark: {
    backgroundColor: '#0F0F14',
    borderColor: '#32324A',
  },
  themeTileLight: {
    backgroundColor: '#F5F5FA',
    borderColor: '#D0D0E8',
  },
  themeCheck: {
    position: 'absolute',
    top: 8, right: 8,
    width: 18, height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTileLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: '#F0EFFF',
    marginBottom: spacing.sm,
  },
  themeDots: {
    flexDirection: 'row',
    gap: 4,
  },
  themeDot: {
    height: 4,
    borderRadius: 2,
  },
  version: {
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: theme.textMuted,
    marginTop: spacing.sm,
  },
});