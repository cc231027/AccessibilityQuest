// src/components/CountdownTimer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 48;

export default function CountdownTimer({ timeLeft, totalTime, timerState }) {
  const { theme } = useTheme();

  const progress = timeLeft / totalTime;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const stateColor = {
    green:  theme.success,
    orange: theme.warning,
    red:    theme.error,
  }[timerState];

  const stateLabel = {
    green:  'Time Remaining',
    orange: 'Time Remaining',
    red:    '⚠ Running out of time!',
  }[timerState];

  const barColor = {
    green:  theme.successDim,
    orange: theme.warningDim,
    red:    theme.errorDim,
  };

  return (
    <View
      style={styles.row}
      accessible={true}
      accessibilityRole="timer"
      accessibilityLabel={`${timeLeft} seconds remaining`}
      accessibilityLiveRegion="polite"
    >
      {/* Ring */}
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          {/* Background track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={theme.surface3}
            strokeWidth={4}
          />
          {/* Animated fill */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={stateColor}
            strokeWidth={4}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <Text style={[styles.ringNumber, { color: stateColor }]}>
          {timeLeft}
        </Text>
      </View>

      {/* Bar + label */}
      <View style={styles.labelWrap}>
        <Text
          style={[
            styles.labelText,
            timerState === 'red'
              ? { color: theme.error, fontWeight: '700' }
              : { color: theme.textMuted },
          ]}
        >
          {stateLabel}
        </Text>
        <View style={[styles.barTrack, { backgroundColor: theme.surface3 }]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: stateColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  ringNumber: {
    position: 'absolute',
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
  },
  labelWrap: {
    flex: 1,
    gap: 5,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  barTrack: {
    height: 6,
    borderRadius: 100,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 100,
  },
});