// src/hooks/ProgressContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Each username gets its own storage key so multiple users
// on the same device don't share progress.
const storageKey = (username) => `aq_progress_${username}`;

export const defaultProgress = {
  totalPoints: 0,
  unlockedLevels: [1],
  completedLevels: [],
  levelProgress: {},
};

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [currentUsername, setCurrentUsername] = useState(null);

  // Call this when a username is confirmed (in WelcomeScreen on Start)
  const loadProgressForUser = async (username) => {
    setCurrentUsername(username);
    const raw = await AsyncStorage.getItem(storageKey(username));
    if (raw) {
      setProgress(JSON.parse(raw));
    } else {
      // First time this user plays — start fresh
      setProgress(defaultProgress);
    }
  };

  const saveProgress = async (username, updated) => {
    setProgress(updated);
    await AsyncStorage.setItem(storageKey(username), JSON.stringify(updated));
  };

  const completeLevel = async (levelId, score, total, pointsEarned, totalTime) => {
    const raw = await AsyncStorage.getItem(storageKey(currentUsername));
    const base = raw ? JSON.parse(raw) : defaultProgress;

    const updated = {
      ...base,
      levelProgress:   {
        ...base.levelProgress,
        [levelId]: {
          score,
          total,
          points: pointsEarned,
          perfect: score === total,
          totalTime: totalTime ?? null,
        },
      },
      totalPoints:     base.totalPoints + pointsEarned,
      completedLevels: base.completedLevels.includes(levelId)
        ? [...base.completedLevels]
        : [...base.completedLevels, levelId],
      unlockedLevels:  base.unlockedLevels.includes(levelId + 1)
        ? [...base.unlockedLevels]
        : [...base.unlockedLevels, levelId + 1],
    };

    await saveProgress(currentUsername, updated);
    return updated;
  };

  const resetProgress = async () => {
    const fresh = {
      totalPoints: 0,
      unlockedLevels: [1],
      completedLevels: [],
      levelProgress: {},
    };
    await AsyncStorage.setItem(storageKey(currentUsername), JSON.stringify(fresh));
    // Also clear consent so the next participant sees the consent screen
    await AsyncStorage.removeItem('aq_consent_given');
    setProgress(fresh);
  };

  return (
    <ProgressContext.Provider value={{ progress, loadProgressForUser, completeLevel, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}