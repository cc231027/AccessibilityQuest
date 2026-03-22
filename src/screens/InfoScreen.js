// src/screens/InfoScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { StatusBar } from 'expo-status-bar';

export default function InfoScreen({ navigation }) {
  const { theme, reduceMotion } = useTheme();

  const fadeAnim = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(reduceMotion ? 0 : 24)).current;

  useEffect(() => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const s = styles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View style={[
          s.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
          <LinearGradient
            colors={['#6C63FF', '#9B8FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.headerGradient}
          >
            <Text style={s.headerLabel}>BACHELOR THESIS</Text>
            <View style={s.headerRow}>
              <View style={s.headerIconBox}>
                <Text style={s.headerEmoji}>🎓</Text>
              </View>
              <Text style={s.headerTitle}>
                Gamified Learning App for Accessibility Guidelines
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Thesis details card ── */}
        <Animated.View style={[
          s.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
          <View style={[s.cardAccent, { backgroundColor: theme.primary }]} />
          <View style={s.cardContent}>

            <InfoRow theme={theme} label="DEGREE" value="Bachelor of Science in Engineering (BSc)" />
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <InfoRow theme={theme} label="PROGRAMME" value="Creative Computing" sub="USTP – University of Applied Sciences St. Pölten" />
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <InfoRow theme={theme} label="AUTHOR" value="Augustine Onyirioha" sub="cc231027" />
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <InfoRow theme={theme} label="SUPERVISOR" value={'FH-Prof. Dr. Victor Adriel\nde Jesus Oliveira'} />
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <InfoRow theme={theme} label="YEAR" value="2026" />

          </View>
        </Animated.View>

        {/* ── Research question ── */}
        <Animated.View style={[
          s.researchWrap,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
          <Text style={s.researchText}>
            Does a gamified quiz app improve students' understanding of mobile accessibility guidelines?
          </Text>
        </Animated.View>

        {/* ── Continue button ── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={s.continueBtn}
            onPress={() => navigation.replace('Consent')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue to the app"
          >
            <LinearGradient
              colors={['#6C63FF', '#9B8FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.continueBtnGradient}
            >
              <Text style={s.continueBtnText}>Continue →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={s.footnote}>St. Pölten, 2026 · Bachelor's Thesis</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ theme, label, value, sub }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{
        fontSize: fontSizes.xs,
        fontWeight: '700',
        letterSpacing: 1,
        color: theme.primaryLight,
        marginBottom: 2,
      }}>
        {label}
      </Text>
      <Text style={{
        fontSize: fontSizes.sm,
        fontWeight: '600',
        color: theme.text,
        lineHeight: 20,
      }}>
        {value}
      </Text>
      {sub && (
        <Text style={{
          fontSize: fontSizes.xs,
          color: theme.textMuted,
          lineHeight: 16,
        }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  // Header gradient banner
  header: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  headerLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.70)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIconBox: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.lg,
    color: '#fff',
    lineHeight: 26,
    flex: 1,
  },

  // Info card
  card: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardAccent: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },

  // Research question
  researchWrap: {
    paddingHorizontal: spacing.xs,
  },
  researchText: {
    fontSize: fontSizes.sm,
    color: theme.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Button
  continueBtn: {
    borderRadius: radii.md,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  footnote: {
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: theme.textMuted,
    marginTop: spacing.sm,
  },
});