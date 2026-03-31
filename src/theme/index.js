// src/theme/index.js

export const darkTheme = {
  dark: true,
  bg: '#0F0F14',
  surface: '#1A1A24',
  surface2: '#22222F',
  surface3: '#2A2A3A',
  border: '#32324A',
  primary: '#5A52E0',
  primaryLight: '#8B85FF',
  primaryDim: 'rgba(108,99,255,0.15)',
  success: '#22D97A',
  successDim: 'rgba(34,217,122,0.15)',
  error: '#FF5A6E',
  errorDim: 'rgba(255,90,110,0.15)',
  warning: '#FFBE3D',
  warningDim: 'rgba(255,190,61,0.15)',
  text: '#F0EFFF',
  textSecondary: '#9898B8',
  textMuted: '#7A7A9A',
  gold: '#FFD166',
};

export const lightTheme = {
  dark: false,
  bg: '#F5F5FA',
  surface: '#FFFFFF',
  surface2: '#EBEBF5',
  surface3: '#DDDDED',
  border: '#D0D0E8',
  primary: '#6C63FF',
  primaryLight: '#5248CC',
  primaryDim: 'rgba(108,99,255,0.10)',
  success: '#0E8A47',
  successDim: 'rgba(22,168,90,0.12)',
  error: '#D42B4A',
  errorDim: 'rgba(224,48,80,0.12)',
  warning: '#A86A00',
  warningDim: 'rgba(196,127,0,0.12)',
  text: '#111128',
  textSecondary: '#4A4A72',
  textMuted: '#6A6A8A',
  gold: '#B8860B',
};

// High contrast overlays — merged on top of the base theme
export const darkHighContrastOverrides = {
  bg: '#000000',
  surface: '#0A0A0F',
  surface2: '#111118',
  surface3: '#1A1A26',
  border: '#7B7BFF',          // vivid purple border, clearly visible
  primary: '#7B7BFF',
  primaryLight: '#FFFFFF',
  primaryDim: 'rgba(123,123,255,0.25)',
  success: '#00FF7F',          // pure bright green
  successDim: 'rgba(0,255,127,0.20)',
  error: '#FF3355',            // vivid red
  errorDim: 'rgba(255,51,85,0.22)',
  warning: '#FFD000',          // vivid amber
  warningDim: 'rgba(255,208,0,0.22)',
  text: '#FFFFFF',             // pure white
  textSecondary: '#D0D0FF',
  textMuted: '#9090C0',
  gold: '#FFD700',
  borderWidth: 3,              // extra token consumed by components
};

export const lightHighContrastOverrides = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#F0F0FF',
  surface3: '#DCDCF0',
  border: '#3A30CC',           // deep purple border
  primary: '#3A30CC',
  primaryLight: '#3A30CC',
  primaryDim: 'rgba(58,48,204,0.15)',
  success: '#006B35',          // deep green
  successDim: 'rgba(0,107,53,0.15)',
  error: '#C0001A',            // deep red
  errorDim: 'rgba(192,0,26,0.15)',
  warning: '#8A5700',          // deep amber
  warningDim: 'rgba(138,87,0,0.15)',
  text: '#000000',             // pure black
  textSecondary: '#1A1A40',
  textMuted: '#4A4A6A',
  gold: '#7A5C00',
  borderWidth: 3,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 13,
  md: 15,
  base: 16,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 30,
};