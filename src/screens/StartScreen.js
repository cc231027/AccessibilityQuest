// src/screens/StartScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontSizes } from '../theme/index';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function StartScreen({ navigation }) {
  const { theme, reduceMotion } = useTheme();

  const logoScale   = useRef(new Animated.Value(reduceMotion ? 1 : 0.6)).current;
  const logoOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const titleOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      // Skip straight to InfoScreen after a brief pause
      const t = setTimeout(() => navigation.replace('Welcome'), 800);
      return () => clearTimeout(t);
    }

    Animated.sequence([
      // 1. Logo scales + fades in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 2. Title fades in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      // 3. Hold for a moment
      Animated.delay(1500),
      // 4. Whole screen fades out
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  return (
    <Animated.View style={[styles.root, { backgroundColor: theme.bg, opacity: screenOpacity }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      {/* Background glow */}
      <View style={styles.bgGlow} pointerEvents="none" />

      {/* Logo */}
      <Animated.View style={[
        styles.logoWrap,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] },
      ]}>
        <View style={styles.iconGlow} />
        <LinearGradient
          colors={['#6C63FF', '#8B85FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.appIcon}
        >
          <Text style={styles.appIconEmoji} accessibilityLabel="Accessibility Quest icon">♿</Text>
        </LinearGradient>
      </Animated.View>

      {/* App name */}
      <Animated.Text style={[styles.appTitle, { color: theme.text, opacity: titleOpacity }]}>
        Accessibility{'\n'}Quest
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { color: theme.textSecondary, opacity: titleOpacity }]}>
        Gamified Learning for Accessibility
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bgGlow: {
    position: 'absolute',
    top: '25%',
    left: width / 2 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108,99,255,0.10)',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(108,99,255,0.15)',
  },
  appIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 14,
  },
  appIconEmoji: {
    fontSize: 42,
  },
  appTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  tagline: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
});