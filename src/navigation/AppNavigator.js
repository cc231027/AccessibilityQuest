// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeContext';

import StartScreen       from '../screens/StartScreen';
import InfoScreen        from '../screens/InfoScreen';
import WelcomeScreen     from '../screens/WelcomeScreen';
import LevelSelectScreen from '../screens/LevelSelectScreen';
import QuizScreen        from '../screens/QuizScreen';
import FeedbackScreen    from '../screens/FeedbackScreen';
import ResultsScreen     from '../screens/ResultsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import SettingsScreen    from '../screens/SettingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.bg },
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Start"       component={StartScreen} />
      <Stack.Screen name="Info"        component={InfoScreen} />
      <Stack.Screen name="Welcome"     component={WelcomeScreen} />
      <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
      <Stack.Screen name="Quiz"        component={QuizScreen} />
      <Stack.Screen name="Feedback"    component={FeedbackScreen} />
      <Stack.Screen name="Results"     component={ResultsScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Settings"    component={SettingsScreen} />
    </Stack.Navigator>
  );
}