import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Divider, Heading, Page, Pill } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

function Preference({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  const c = useColors();
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56 }}>
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={[type.bodyStrong, { color: c.ink }]}>{title}</Text>
      <Text style={[type.caption, { color: c.muted }]}>{subtitle}</Text>
    </View>
    <Switch accessibilityLabel={title} value={value} onValueChange={onChange} trackColor={{ false: c.line, true: c.primary }} thumbColor="#FFFFFF" />
  </View>;
}

export default function SettingsScreen() {
  const c = useColors();
  const { signOut } = useAuth();
  const [reminders, setReminders] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); router.replace('/login'); } finally { setBusy(false); } };

  return <Page back>
    <Heading eyebrow="Personnalisation" title="Paramètres" />
    <Card>
      <Text style={[type.label, { color: c.primary }]}>PRÉFÉRENCES DE CETTE SESSION</Text>
      <Preference title="Rappels d'étude" subtitle="Les notifications ne sont pas encore disponibles." value={reminders} onChange={setReminders} />
      <Divider />
      <Preference title="Retour haptique" subtitle="Les vibrations seront ajoutées ultérieurement." value={haptics} onChange={setHaptics} />
    </Card>
    <Card>
      <Text style={[type.heading, { color: c.ink }]}>Compte et données</Text>
      <Text style={[type.body, { color: c.muted }]}>Tes cours et tes notes sont sauvegardés sur ton compte et disponibles après reconnexion.</Text>
      <Pill tone="green">SAUVEGARDE EN LIGNE</Pill>
      <Button title="Mes cours" variant="secondary" onPress={() => router.push('/library')} />
      <Button title="Mes notes" variant="secondary" onPress={() => router.push('/notes')} />
    </Card>
    <Button title="Se déconnecter" variant="danger" onPress={logout} loading={busy} />
  </Page>;
}
