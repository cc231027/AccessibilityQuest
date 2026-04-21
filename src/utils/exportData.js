// src/utils/exportData.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { levels } from '../data/quizData';

// Returns a human-readable level title from its ID
const getLevelTitle = (levelId) => {
  const level = levels.find(l => l.id === levelId);
  return level ? level.title : `Level ${levelId}`;
};

// Format seconds into "Xm Ys" or "Ys"
const formatTime = (secs) => {
  if (!secs && secs !== 0) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

// Wrap a value in quotes and escape any internal quotes (CSV safe)
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export async function exportAllParticipantData() {
  try {
    // ── 1. Find all participant storage keys ──
    const allKeys = await AsyncStorage.getAllKeys();
    const progressKeys = allKeys.filter(k => k.startsWith('aq_progress_'));

    if (progressKeys.length === 0) {
      return { success: false, message: 'No participant data found to export.' };
    }

    // ── 2. Load all participants' data ──
    const pairs = await AsyncStorage.multiGet(progressKeys);

    // ── 3. Build CSV rows ──
    const headers = [
      'Username',
      'Level ID',
      'Level Title',
      'Score',
      'Total Questions',
      'Accuracy (%)',
      'Points Earned',
      'Perfect',
      'Total Time',
      'Avg Time Per Question',
    ];

    const rows = [headers.map(csvCell).join(',')];

    for (const [key, raw] of pairs) {
      if (!raw) continue;

      // Username is everything after "aq_progress_"
      const username = key.replace('aq_progress_', '');
      const data = JSON.parse(raw);
      const { levelProgress } = data;

      if (!levelProgress || Object.keys(levelProgress).length === 0) {
        // Participant registered but never completed a level — still include them
        rows.push([
          csvCell(username),
          csvCell('—'),
          csvCell('No levels completed'),
          csvCell(0),
          csvCell(0),
          csvCell(0),
          csvCell(0),
          csvCell('No'),
          csvCell('—'),
          csvCell('—'),
        ].join(','));
        continue;
      }

      // One row per completed level
      for (const [levelIdStr, lp] of Object.entries(levelProgress)) {
        const levelId  = parseInt(levelIdStr, 10);
        const accuracy = lp.total > 0 ? Math.round((lp.score / lp.total) * 100) : 0;
        const totalTime = lp.totalTime ?? null;
        const avgTime   = (totalTime && lp.total > 0)
          ? Math.round(totalTime / lp.total)
          : null;

        rows.push([
          csvCell(username),
          csvCell(levelId),
          csvCell(getLevelTitle(levelId)),
          csvCell(lp.score ?? 0),
          csvCell(lp.total ?? 0),
          csvCell(accuracy),
          csvCell(lp.points ?? 0),
          csvCell(lp.perfect ? 'Yes' : 'No'),
          csvCell(totalTime ? formatTime(totalTime) : '—'),
          csvCell(avgTime   ? formatTime(avgTime)   : '—'),
        ].join(','));
      }
    }

    // ── 4. Write to a temp file ──
    const csvContent = rows.join('\n');
    const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename   = `accessibility_quest_results_${timestamp}.csv`;
    const fileUri    = FileSystem.cacheDirectory + filename;

    // @ts-ignore — writeAsStringAsync is valid and working in expo-file-system SDK 51
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: 'utf8',
    });

    // ── 5. Share ──
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      return { success: false, message: 'Sharing is not available on this device.' };
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Participant Results',
      UTI: 'public.comma-separated-values-text', // iOS
    });

    return { success: true };

  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
}