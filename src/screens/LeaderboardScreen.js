// src/screens/LeaderboardScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radii, fontSizes } from '../theme/index';
import { useProgress } from '../hooks/ProgressContext';
import { StatusBar } from 'expo-status-bar';

const MOCK_PLAYERS = [
  { username: 'alex_uni',    points: 3450, levelsCompleted: 5 },
  { username: 'jamie_dev',   points: 2880, levelsCompleted: 4 },
  { username: 'sam_ux',      points: 2610, levelsCompleted: 4 },
  { username: 'chris_a11y',  points: 1380, levelsCompleted: 2 },
  { username: 'taylor_hci',  points: 1210, levelsCompleted: 2 },
  { username: 'morgan_ui',   points:  980, levelsCompleted: 1 },
  { username: 'riley_wcag',  points:  750, levelsCompleted: 1 },
];

const getRankLabel = (pts) => {
  if (pts >= 1500) return 'Expert';
  if (pts >= 800)  return 'Advanced';
  if (pts >= 300)  return 'Intermediate';
  return 'Beginner';
};

const getInitial = (name) => name.charAt(0).toUpperCase();

export default function LeaderboardScreen({ navigation, route }) {
  const { theme, reduceMotion } = useTheme();
  const { progress } = useProgress();
  const username = route.params?.username ?? 'Player';

  const allPlayers = [
    ...MOCK_PLAYERS.filter(p => p.username !== username),
    { username, points: progress.totalPoints, levelsCompleted: progress.completedLevels.length },
  ].sort((a, b) => b.points - a.points);

  const myRank = allPlayers.findIndex(p => p.username === username) + 1;
  const podium = [allPlayers[1], allPlayers[0], allPlayers[2]];

  // ── Animations — snap to final values instantly if reduceMotion is on ──
  const fadeAnim  = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(reduceMotion ? 0 : 30)).current;

  useEffect(() => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const s = styles(theme);

  const podiumConfig = [
    { height: 60,  medal: '🥈', color: ['#C0C0C0', '#8A9BAE'], rank: 2 },
    { height: 86,  medal: '🥇', color: ['#FFD166', '#F4A223'], rank: 1 },
    { height: 44,  medal: '🥉', color: ['#CD7F32', '#8C5A1E'], rank: 3 },
  ];

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
        <Text style={s.topbarTitle} accessibilityRole="header">Leaderboard</Text>
        <View style={[s.weeklyBadge, { backgroundColor: theme.warningDim }]}>
          <Text style={[s.weeklyText, { color: theme.warning }]}>🏆 Weekly</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >

        {/* ── Your rank card ── */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <LinearGradient
            colors={['#6C63FF', '#9B8FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.myRankCard}
            accessibilityLabel={`Your rank: ${myRank}. Points: ${progress.totalPoints}`}
          >
            <View style={s.myRankLeft}>
              <Text style={s.myRankLabel}>Your Rank</Text>
              <Text style={s.myRankNum}>#{myRank}</Text>
              <Text style={s.myRankSub}>
                {getRankLabel(progress.totalPoints)} · {progress.totalPoints} pts
              </Text>
            </View>
            <View style={s.myRankAvatar}>
              <Text style={s.myRankAvatarText}>{getInitial(username)}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Podium ── */}
        {allPlayers.length >= 3 && (
          <Animated.View
            style={[
              s.podiumWrap,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
            accessibilityLabel="Top 3 players podium"
          >
            {podium.map((player, i) => {
              const cfg  = podiumConfig[i];
              const isMe = player?.username === username;
              return (
                <View key={i} style={s.podiumPlace}>
                  <View style={[
                    s.podiumAvatar,
                    isMe && { borderColor: theme.primary, borderWidth: 2.5 },
                  ]}>
                    <Text style={s.podiumAvatarText}>
                      {getInitial(player?.username ?? '?')}
                    </Text>
                  </View>
                  <Text style={s.podiumName} numberOfLines={1}>
                    {player?.username ?? '—'}
                  </Text>
                  <Text style={[s.podiumPts, { color: theme.gold }]}>
                    {player?.points?.toLocaleString() ?? 0}
                  </Text>
                  <LinearGradient
                    colors={cfg.color}
                    style={[s.podiumBlock, { height: cfg.height }]}
                  >
                    <Text style={{ fontSize: 18 }}>{cfg.medal}</Text>
                  </LinearGradient>
                </View>
              );
            })}
          </Animated.View>
        )}

        {/* ── Full rankings list ── */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={s.sectionTitle}>ALL RANKINGS</Text>

          {allPlayers.map((player, index) => {
            const rank = index + 1;
            const isMe = player.username === username;

            return (
              <View
                key={player.username}
                style={[
                  s.rankRow,
                  isMe && { borderColor: theme.primary, backgroundColor: theme.primaryDim },
                ]}
                accessibilityLabel={`Rank ${rank}: ${player.username}, ${player.points} points${isMe ? ', this is you' : ''}`}
              >
                <Text style={[s.rankNum, isMe && { color: theme.primaryLight }]}>
                  {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : rank}
                </Text>

                <View style={[s.avatar, isMe && { backgroundColor: theme.primary }]}>
                  <Text style={[s.avatarText, isMe && { color: '#fff' }]}>
                    {getInitial(player.username)}
                  </Text>
                </View>

                <View style={s.rankInfo}>
                  <View style={s.rankNameRow}>
                    <Text style={[s.rankUsername, isMe && { color: theme.primaryLight }]}>
                      {player.username}
                    </Text>
                    {isMe && (
                      <View style={[s.youBadge, { backgroundColor: theme.primaryDim }]}>
                        <Text style={[s.youBadgeText, { color: theme.primaryLight }]}>You</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.rankLevel}>
                    {getRankLabel(player.points)} · {player.levelsCompleted} levels
                  </Text>
                </View>

                <Text style={[s.rankScore, { color: theme.gold }]}>
                  {player.points.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    borderWidth: 1.5,
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
  weeklyBadge: {
    borderRadius: radii.full,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  weeklyText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  myRankCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  myRankLeft: { gap: 2 },
  myRankLabel: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  myRankNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 38,
    color: '#fff',
    lineHeight: 44,
  },
  myRankSub: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.70)',
  },
  myRankAvatar: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  myRankAvatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: '#fff',
  },
  podiumWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    height: 180,
  },
  podiumPlace: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  podiumAvatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.border,
  },
  podiumAvatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: theme.text,
  },
  podiumName: {
    fontSize: fontSizes.xs,
    color: theme.textSecondary,
    fontWeight: '600',
    maxWidth: 80,
    textAlign: 'center',
  },
  podiumPts: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.xs + 1,
  },
  podiumBlock: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.textMuted,
    marginBottom: spacing.md,
  },
  rankRow: {
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  rankNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.base,
    color: theme.textMuted,
    width: 28,
    textAlign: 'center',
  },
  avatar: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.md,
    color: theme.text,
  },
  rankInfo: { flex: 1, gap: 2 },
  rankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flexWrap: 'wrap',
  },
  rankUsername: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: theme.text,
  },
  youBadge: {
    borderRadius: radii.full,
    paddingVertical: 1,
    paddingHorizontal: spacing.sm,
  },
  youBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  rankLevel: {
    fontSize: fontSizes.xs,
    color: theme.textMuted,
  },
  rankScore: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: fontSizes.lg,
  },
});