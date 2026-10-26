import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';
import { router } from 'expo-router';

function Preference({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={{ flex: 1, gap: 4 }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: '700' }}>{title}</Text><Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>{subtitle}</Text></View>
    <Switch value={value} onValueChange={onChange} trackColor={{ false: C.line, true: C.primary }} thumbColor="#FFFFFF" />
  </View>;
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [reminders, setReminders] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); router.replace('/login'); } finally { setBusy(false); } };
  return <Page>
    <Heading eyebrow="Personnalisation" title="Paramètres" subtitle="Ajuste ton expérience d'étude." />
    <Card>
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRÉFÉRENCES</Text>
      <Preference title="Rappels d'étude" subtitle="Préférence locale, aucune notification planifiée pour l'instant." value={reminders} onChange={setReminders} />
      <View style={{ height: 1, backgroundColor: C.line }} />
      <Preference title="Retour haptique" subtitle="Réglage visuel uniquement dans cette version." value={haptics} onChange={setHaptics} />
    </Card>
    <Card>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Confidentialité et compte</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>La session se termine lorsque tu te déconnectes. Les préférences ne sont pas encore synchronisées avec le backend.</Text>
      <Pill tone="green">SESSION ACTIVE</Pill>
    </Card>
    <Button title="Se déconnecter" onPress={logout} loading={busy} variant="secondary" />
  </Page>;
}
