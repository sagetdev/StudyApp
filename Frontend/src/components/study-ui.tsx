import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';
const THEME_KEY = 'studyapp:theme-mode:v1';
const palettes = {
  light: { bg: '#F6F7FB', surface: '#FFFFFF', ink: '#171A29', muted: '#6E758A', line: '#E8EAF2', primary: '#614AE8', primarySoft: '#E8E0FF', mint: '#D6F5E5', green: '#1F9463', blue: '#D1E8FF', amber: '#FFE8BA', danger: '#C64052', dangerSoft: '#FCE8EC' },
  dark: { bg: '#11131C', surface: '#1C2030', ink: '#F2F3FA', muted: '#A5ABC0', line: '#34394D', primary: '#A99AFF', primarySoft: '#302A4D', mint: '#1E3B32', green: '#69D6A2', blue: '#203B56', amber: '#49391E', danger: '#FF8796', dangerSoft: '#482831' },
};
export const C: { [K in keyof typeof palettes.light]: string } = { ...palettes.light };
let activeTheme: ThemeMode = 'light';
const themeListeners = new Set<(mode: ThemeMode) => void>();
function applyTheme(mode: ThemeMode) {
  activeTheme = mode;
  Object.assign(C, palettes[mode]);
  themeListeners.forEach((listener) => listener(mode));
}
export async function initializeThemeMode() {
  try {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
  } catch { /* Le thème clair reste le choix par défaut si le stockage est indisponible. */ }
}
export async function updateThemeMode(mode: ThemeMode) {
  applyTheme(mode);
  try { await AsyncStorage.setItem(THEME_KEY, mode); } catch { /* Le thème reste actif pour cette session. */ }
}
export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(activeTheme);
  useEffect(() => {
    const listener = (next: ThemeMode) => setMode(next);
    themeListeners.add(listener);
    return () => { themeListeners.delete(listener); };
  }, []);
  return { mode, setMode: updateThemeMode };
}

export function Page({ children, scroll = true, style }: React.PropsWithChildren<{ scroll?: boolean; style?: ViewStyle }>) {
  useThemeMode();
  if (!scroll) return <View style={[styles.page, { backgroundColor: C.bg }, style]}>{children}</View>;
  return <ScrollView style={[styles.scroll, { backgroundColor: C.bg }]} contentContainerStyle={[styles.page, { backgroundColor: C.bg }, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

export function Heading({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  useThemeMode();
  return <View style={styles.heading}>
    {eyebrow ? <Text style={[styles.eyebrow, { color: C.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
    <Text style={[styles.title, { color: C.ink }]}>{title}</Text>
    {subtitle ? <Text style={[styles.subtitle, { color: C.muted }]}>{subtitle}</Text> : null}
  </View>;
}

export function Card({ children, style }: React.PropsWithChildren<{ style?: ViewStyle }>) {
  useThemeMode();
  return <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.line }, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }: {
  title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'quiet'; loading?: boolean; disabled?: boolean;
}) {
  useThemeMode();
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [
    styles.button,
    variant === 'primary' ? { backgroundColor: '#614AE8' } : variant === 'secondary' ? { backgroundColor: C.primarySoft } : { backgroundColor: 'transparent' },
    (pressed || disabled || loading) && { opacity: 0.72 },
  ]}>
    {loading ? <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : C.primary} /> : <Text style={[styles.buttonText, variant !== 'primary' && { color: C.primary }]}>{title}</Text>}
  </Pressable>;
}

export function Field({ label, error, style, ...props }: TextInputProps & { label: string; error?: string }) {
  useThemeMode();
  return <View style={styles.fieldWrap}>
    <Text style={[styles.fieldLabel, { color: C.ink }]}>{label}</Text>
    <TextInput placeholderTextColor={C.muted} selectionColor={C.primary} style={[styles.input, { backgroundColor: C.surface, borderColor: C.line, color: C.ink }, props.multiline && styles.multiline, style]} {...props} />
    {error ? <Text style={[styles.error, { color: C.danger }]}>{error}</Text> : null}
  </View>;
}

export function Pill({ children, tone = 'purple' }: React.PropsWithChildren<{ tone?: 'purple' | 'green' | 'blue' | 'amber' }>) {
  useThemeMode();
  const tones = { purple: [C.primarySoft, C.primary], green: [C.mint, C.green], blue: [C.blue, '#69B6FF'], amber: [C.amber, '#E5B85C'] } as const;
  return <View style={[styles.pill, { backgroundColor: tones[tone][0] }]}><Text style={[styles.pillText, { color: tones[tone][1] }]}>{children}</Text></View>;
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  useThemeMode();
  return <View style={styles.sectionTitle}><Text style={[styles.sectionText, { color: C.ink }]}>{title}</Text>{action ? <Text style={[styles.sectionAction, { color: C.primary }]}>{action}</Text> : null}</View>;
}

export const uiStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spread: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  body: { color: C.muted, fontSize: 14, lineHeight: 21 },
  strong: { color: C.ink, fontSize: 15, fontWeight: '700' },
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  page: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36, gap: 18, width: '100%', alignSelf: 'center', maxWidth: 960 },
  heading: { gap: 7, marginBottom: 2 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { fontSize: 28, lineHeight: 35, fontWeight: '800', letterSpacing: -0.6, flexShrink: 1 },
  subtitle: { fontSize: 14, lineHeight: 21 },
  card: { borderRadius: 20, padding: 18, gap: 12, borderWidth: 1 },
  button: { minHeight: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '700' },
  input: { minHeight: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15 },
  multiline: { minHeight: 138, textAlignVertical: 'top', lineHeight: 22 },
  error: { fontSize: 12, lineHeight: 17 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 30 },
  pillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  sectionText: { fontSize: 16, fontWeight: '800', flexShrink: 1 },
  sectionAction: { fontSize: 12, fontWeight: '700' },
});
