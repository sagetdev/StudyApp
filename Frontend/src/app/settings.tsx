import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

function Preference({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={{ flex: 1, gap: 4 }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: '700' }}>{title}</Text><Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>{subtitle}</Text></View>
    <Switch value={value} onValueChange={onChange} trackColor={{ false: C.line, true: C.primary }} thumbColor="#FFFFFF" />
  </View>;
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { mode, setMode } = useThemeMode();
  const [reminders, setReminders] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    try { await signOut(); router.replace('/login'); }
    finally { setBusy(false); }
  };

  return <Page>
    <Heading eyebrow="Personnalisation" title="Paramètres" subtitle="Configure ton expérience StudyApp." />
    <Card>
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>APPARENCE</Text>
      <Preference title="Mode sombre" subtitle={mode === 'dark' ? 'Un thème sombre, confortable en faible luminosité.' : 'Un thème clair, net et lumineux.'} value={mode === 'dark'} onChange={(enabled) => { void setMode(enabled ? 'dark' : 'light'); }} />
      <Text style={{ color: C.muted, fontSize: 11 }}>Ton choix est conservé sur cet appareil.</Text>
    </Card>
    <Card>
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRÉFÉRENCES</Text>
      <Preference title="Rappels d'étude" subtitle="Les notifications automatiques ne sont pas encore disponibles." value={reminders} onChange={setReminders} />
      <View style={{ height: 1, backgroundColor: C.line }} />
      <Preference title="Retour haptique" subtitle="La prise en charge des vibrations sera ajoutée ultérieurement." value={haptics} onChange={setHaptics} />
    </Card>
    <Card>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Compte et données</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Tes cours et tes notes sont sauvegardés dans la base de données, associés à ton compte. Ils sont disponibles après reconnexion sur un autre appareil.</Text>
      <Pill tone="green">SAUVEGARDE EN LIGNE</Pill>
      <Button title="Ouvrir mes cours" variant="secondary" onPress={() => router.push('/library')} />
      <Button title="Gérer mes notes" variant="secondary" onPress={() => router.push('/notes')} />
    </Card>
    <Button title="Se déconnecter" onPress={logout} loading={busy} variant="secondary" />
  </Page>;
}
