import React, { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTENT_MAX_WIDTH, MIN_TOUCH, radius, space, type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { Icon, type IconName } from '@/components/icon';

/* ───────────── Page ───────────── */

export function Page({ children, scroll = true, back = false, style }: React.PropsWithChildren<{ scroll?: boolean; back?: boolean; style?: StyleProp<ViewStyle> }>) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const padding = { paddingHorizontal: space.xl, paddingTop: insets.top + space.md, paddingBottom: space.xxl + (back ? insets.bottom : 0) };
  const inner = <View style={[{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', gap: space.lg, flexGrow: 1 }, style]}>
    {back ? <BackButton /> : null}
    {children}
  </View>;
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: c.bg }, padding]}>{inner}</View>;
  return <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={[{ flexGrow: 1 }, padding]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{inner}</ScrollView>;
}

export function BackButton({ label = 'Retour' }: { label?: string }) {
  const c = useColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8}
    onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
    style={({ pressed }) => ({ alignSelf: 'flex-start', minHeight: MIN_TOUCH, flexDirection: 'row', alignItems: 'center', gap: space.xs, marginLeft: -space.xs, paddingRight: space.md, opacity: pressed ? 0.6 : 1 })}>
    <Icon name="back" color={c.primary} size={30} />
    <Text style={[type.bodyStrong, { color: c.primary }]}>{label}</Text>
  </Pressable>;
}

/* ───────────── Texte ───────────── */

export function Heading({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  const c = useColors();
  return <View style={{ gap: space.sm }}>
    {eyebrow ? <Text style={[type.label, { color: c.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
    <Text accessibilityRole="header" style={[type.display, { color: c.ink }]}>{title}</Text>
    {subtitle ? <Text style={[type.body, { color: c.muted }]}>{subtitle}</Text> : null}
  </View>;
}

export function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  const c = useColors();
  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md }}>
    <Text accessibilityRole="header" style={[type.heading, { color: c.ink }]}>{title}</Text>
    {right}
  </View>;
}

export function Body({ children, tone = 'muted', style }: React.PropsWithChildren<{ tone?: 'muted' | 'ink'; style?: object }>) {
  const c = useColors();
  return <Text style={[type.body, { color: tone === 'ink' ? c.ink : c.muted }, style]}>{children}</Text>;
}

/* ───────────── Surfaces ───────────── */

export function Card({ children, style, tinted = false }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; tinted?: boolean }>) {
  const c = useColors();
  return <View style={[{ backgroundColor: tinted ? c.surfaceTint : c.surface, borderRadius: radius.lg, padding: space.lg, gap: space.md, borderWidth: 1, borderColor: tinted ? c.primarySoft : c.line }, style]}>{children}</View>;
}

export function Divider() {
  const c = useColors();
  return <View style={{ height: 1, backgroundColor: c.line }} />;
}

export function IconBadge({ icon, tone = 'purple', size = 44 }: { icon: IconName; tone?: ToneName; size?: number }) {
  const c = useColors();
  const t = c.tones[tone];
  return <View style={{ width: size, height: size, borderRadius: size * 0.32, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
    <Icon name={icon} color={t.fg} size={size * 0.46} />
  </View>;
}

export function Pill({ children, tone = 'purple' }: React.PropsWithChildren<{ tone?: ToneName }>) {
  const c = useColors();
  const t = c.tones[tone];
  return <View style={{ alignSelf: 'flex-start', backgroundColor: t.bg, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill }}>
    <Text style={[type.label, { color: t.fg }]}>{children}</Text>
  </View>;
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const c = useColors();
  const pct = Math.max(0, Math.min(1, value));
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.line, overflow: 'hidden' }}>
    <View style={{ height: 6, width: `${pct * 100}%`, borderRadius: radius.pill, backgroundColor: c.primary }} />
  </View>;
}

/* ───────────── Actions ───────────── */

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }: {
  title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; loading?: boolean; disabled?: boolean;
}) {
  const c = useColors();
  const inactive = disabled || loading;
  const bg = variant === 'primary' ? c.primary : variant === 'secondary' ? c.primarySoft : variant === 'danger' ? c.tones.red.bg : 'transparent';
  const fg = variant === 'primary' ? c.onPrimary : variant === 'danger' ? c.tones.red.fg : c.primary;
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: inactive, busy: loading }} onPress={onPress} disabled={inactive}
    style={({ pressed }) => ({ minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg, backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 })}>
    {loading ? <ActivityIndicator color={fg} /> : <Text style={[type.bodyStrong, { color: fg }]}>{title}</Text>}
  </Pressable>;
}

/** Ligne de navigation tactile : icône, titre, sous-titre, chevron. */
export function ListItem({ icon, tone = 'purple', title, subtitle, onPress }: { icon: IconName; tone?: ToneName; title: string; subtitle?: string; onPress: () => void }) {
  const c = useColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title} onPress={onPress}
    style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, minHeight: 72 }}>
      <IconBadge icon={icon} tone={tone} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.bodyStrong, { color: c.ink }]}>{title}</Text>
        {subtitle ? <Text style={[type.caption, { color: c.muted }]}>{subtitle}</Text> : null}
      </View>
      <Icon name="next" color={c.faint} size={26} />
    </Card>
  </Pressable>;
}

/* ───────────── Formulaires ───────────── */

export function Field({ label, error, hint, style, ...props }: TextInputProps & { label: string; error?: string; hint?: string }) {
  const c = useColors();
  const [focused, setFocused] = useState(false);
  return <View style={{ gap: space.sm }}>
    <Text style={[type.caption, { color: c.ink, fontWeight: '700' }]}>{label}</Text>
    <TextInput
      accessibilityLabel={label}
      placeholderTextColor={c.faint}
      selectionColor={c.primary}
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={[{ minHeight: 52, borderRadius: radius.md, borderWidth: focused ? 2 : 1, borderColor: error ? c.danger : focused ? c.primary : c.line, backgroundColor: c.surface, paddingHorizontal: space.lg - (focused ? 1 : 0), paddingVertical: space.md, fontSize: 16, color: c.ink },
        props.multiline && { minHeight: 140, textAlignVertical: 'top', lineHeight: 23 }, style]}
    />
    {error ? <Text accessibilityRole="alert" style={[type.caption, { color: c.danger }]}>{error}</Text> : hint ? <Text style={[type.caption, { color: c.faint }]}>{hint}</Text> : null}
  </View>;
}

export function ErrorText({ children }: { children?: string }) {
  const c = useColors();
  return children ? <Text accessibilityRole="alert" style={[type.caption, { color: c.danger }]}>{children}</Text> : null;
}

/* ───────────── États ───────────── */

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: React.ReactNode }) {
  const c = useColors();
  return <Card style={{ alignItems: 'center', paddingVertical: space.xl, gap: space.sm }}>
    <IconBadge icon={icon} size={56} />
    <Text style={[type.heading, { color: c.ink, textAlign: 'center', marginTop: space.xs }]}>{title}</Text>
    <Text style={[type.body, { color: c.muted, textAlign: 'center' }]}>{text}</Text>
    {action ? <View style={{ alignSelf: 'stretch', marginTop: space.md }}>{action}</View> : null}
  </Card>;
}
