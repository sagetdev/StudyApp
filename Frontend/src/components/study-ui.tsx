import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

export const C = {
  bg: '#F6F7FB', surface: '#FFFFFF', ink: '#171A29', muted: '#6E758A',
  line: '#E8EAF2', primary: '#614AE8', primarySoft: '#E8E0FF',
  mint: '#D6F5E5', green: '#1F9463', blue: '#D1E8FF', amber: '#FFE8BA',
  danger: '#C64052', dangerSoft: '#FCE8EC',
};

export function Page({ children, scroll = true, style }: React.PropsWithChildren<{ scroll?: boolean; style?: ViewStyle }>) {
  if (!scroll) return <View style={[styles.page, style]}>{children}</View>;
  return <ScrollView style={styles.scroll} contentContainerStyle={[styles.page, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

export function Heading({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return <View style={styles.heading}>
    {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}

export function Card({ children, style }: React.PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }: {
  title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'quiet'; loading?: boolean; disabled?: boolean;
}) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [
    styles.button, variant === 'primary' ? styles.primaryButton : variant === 'secondary' ? styles.secondaryButton : styles.quietButton,
    (pressed || disabled || loading) && { opacity: 0.72 },
  ]}>
    {loading ? <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : C.primary} /> : <Text style={[styles.buttonText, variant !== 'primary' && { color: C.primary }]}>{title}</Text>}
  </Pressable>;
}

export function Field({ label, error, style, ...props }: TextInputProps & { label: string; error?: string }) {
  return <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      placeholderTextColor="#9AA1B2"
      selectionColor={C.primary}
      style={[styles.input, props.multiline && styles.multiline, style]}
      {...props}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

export function Pill({ children, tone = 'purple' }: React.PropsWithChildren<{ tone?: 'purple' | 'green' | 'blue' | 'amber' }>) {
  const tones = { purple: [C.primarySoft, C.primary], green: [C.mint, C.green], blue: [C.blue, '#2865A8'], amber: [C.amber, '#9B6500'] } as const;
  return <View style={[styles.pill, { backgroundColor: tones[tone][0] }]}><Text style={[styles.pillText, { color: tones[tone][1] }]}>{children}</Text></View>;
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionText}>{title}</Text>{action ? <Text style={styles.sectionAction}>{action}</Text> : null}</View>;
}

export const uiStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spread: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  body: { color: C.muted, fontSize: 14, lineHeight: 21 },
  strong: { color: C.ink, fontSize: 15, fontWeight: '700' },
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  page: { flexGrow: 1, backgroundColor: C.bg, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36, gap: 18 },
  heading: { gap: 7, marginBottom: 2 },
  eyebrow: { color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: C.muted, fontSize: 14, lineHeight: 21 },
  card: { backgroundColor: C.surface, borderRadius: 20, padding: 18, gap: 12, borderWidth: 1, borderColor: '#F0F1F6' },
  button: { minHeight: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primaryButton: { backgroundColor: C.primary },
  secondaryButton: { backgroundColor: C.primarySoft },
  quietButton: { backgroundColor: 'transparent' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  fieldWrap: { gap: 8 },
  fieldLabel: { color: C.ink, fontSize: 13, fontWeight: '700' },
  input: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15, color: C.ink },
  multiline: { minHeight: 138, textAlignVertical: 'top', lineHeight: 22 },
  error: { color: C.danger, fontSize: 12, lineHeight: 17 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 30 },
  pillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionText: { color: C.ink, fontSize: 16, fontWeight: '800' },
  sectionAction: { color: C.primary, fontSize: 12, fontWeight: '700' },
});
