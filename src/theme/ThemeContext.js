// src/theme/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  darkTheme, lightTheme,
  darkHighContrastOverrides, lightHighContrastOverrides,
} from './index';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark,         setIsDark]         = useState(true);
  const [timerEnabled,   setTimerEnabled]   = useState(true);
  const [hapticEnabled,  setHapticEnabled]  = useState(false);
  const [highContrast,   setHighContrast]   = useState(false);
  const [soundEnabled,   setSoundEnabled]   = useState(true);
  const [reduceMotion,   setReduceMotion]   = useState(false);

  // Merge high contrast overrides on top of the base theme when enabled
  const baseTheme = isDark ? darkTheme : lightTheme;
  const hcOverrides = isDark ? darkHighContrastOverrides : lightHighContrastOverrides;
  const theme = highContrast ? { ...baseTheme, ...hcOverrides } : baseTheme;

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const toggleTimer = async () => {
    const next = !timerEnabled;
    setTimerEnabled(next);
    await AsyncStorage.setItem('timerEnabled', next ? 'true' : 'false');
  };

  const toggleHaptic = async () => {
    const next = !hapticEnabled;
    setHapticEnabled(next);
    await AsyncStorage.setItem('hapticEnabled', next ? 'true' : 'false');
  };

  const toggleHighContrast = async () => {
    const next = !highContrast;
    setHighContrast(next);
    await AsyncStorage.setItem('highContrast', next ? 'true' : 'false');
  };

  const toggleSound = async () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    await AsyncStorage.setItem('soundEnabled', next ? 'true' : 'false');
  };

  const toggleReduceMotion = async () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    await AsyncStorage.setItem('reduceMotion', next ? 'true' : 'false');
  };

  React.useEffect(() => {
    AsyncStorage.multiGet(['theme', 'timerEnabled', 'hapticEnabled', 'highContrast', 'soundEnabled', 'reduceMotion']).then(pairs => {
      const map = Object.fromEntries(pairs);
      if (map.theme === 'light')          setIsDark(false);
      if (map.timerEnabled === 'false')   setTimerEnabled(false);
      if (map.hapticEnabled === 'true')   setHapticEnabled(true);
      if (map.highContrast === 'true')    setHighContrast(true);
      if (map.soundEnabled === 'false')   setSoundEnabled(false);
      if (map.reduceMotion === 'true')    setReduceMotion(true);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme, isDark, toggleTheme,
      timerEnabled, toggleTimer,
      hapticEnabled, toggleHaptic,
      highContrast, toggleHighContrast,
      soundEnabled, toggleSound,
      reduceMotion, toggleReduceMotion,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}