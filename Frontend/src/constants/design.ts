/**
 * Design tokens de StudyApp : couleurs (clair/sombre), espacements (grille de 4 pt),
 * rayons et échelle typographique. Source unique de vérité pour l'interface.
 */

export type ToneName = 'purple' | 'green' | 'blue' | 'amber' | 'red';
type ToneSet = Record<ToneName, { bg: string; fg: string }>;

const lightTones: ToneSet = {
  purple: { bg: '#EDE8FF', fg: '#4B35C9' },
  green: { bg: '#DDF5E8', fg: '#17724C' },
  blue: { bg: '#DDEBFF', fg: '#1F5A9E' },
  amber: { bg: '#FFEFC9', fg: '#8A5A00' },
  red: { bg: '#FCE8EC', fg: '#B3263F' },
};

const darkTones: ToneSet = {
  purple: { bg: '#2B2556', fg: '#C3B8FF' },
  green: { bg: '#16352A', fg: '#7FE0B0' },
  blue: { bg: '#16304D', fg: '#9CCBFF' },
  amber: { bg: '#3D2E10', fg: '#FFD27A' },
  red: { bg: '#42171F', fg: '#FF9AAB' },
};

export interface AppColors {
  bg: string;
  surface: string;
  surfaceTint: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  danger: string;
  success: string;
  tones: ToneSet;
}

export const palette: { light: AppColors; dark: AppColors } = {
  light: {
    bg: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceTint: '#F3F0FF',
    ink: '#171A29',
    muted: '#5B6176',
    faint: '#8A90A3',
    line: '#E4E6EF',
    primary: '#5B43E0',
    onPrimary: '#FFFFFF',
    primarySoft: '#EDE8FF',
    danger: '#B3263F',
    success: '#17724C',
    tones: lightTones,
  },
  dark: {
    bg: '#0F111A',
    surface: '#181B27',
    surfaceTint: '#1F1F3A',
    ink: '#F2F3F8',
    muted: '#A3A9BD',
    faint: '#7A8096',
    line: '#2A2E40',
    primary: '#8B79FF',
    onPrimary: '#12101F',
    primarySoft: '#2B2556',
    danger: '#FF9AAB',
    success: '#7FE0B0',
    tones: darkTones,
  },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 } as const;

/** Échelle typographique (taille minimale 12 pt pour la lisibilité). */
export const type = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: -0.3 },
  heading: { fontSize: 17, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.6 },
} as const;

export const MIN_TOUCH = 48;
export const CONTENT_MAX_WIDTH = 720;
