import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';
import { getPreferences, savePreferences } from '@/lib/local-storage';
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

  useEffect(() => {
    void getPreferences({ reminders: false, haptics: true }).then((prefs) => {
      setReminders(prefs.reminders);
      setHaptics(prefs.haptics);
    });
  }, []);

  const updatePreference = (key: 'reminders' | 'haptics', value: boolean) => {
    const next = { reminders: key === 'reminders' ? value : reminders, haptics: key === 'haptics' ? value : haptics };
    if (key === 'reminders') setReminders(value);
    else setHaptics(value);
    void savePreferences(next);
  };

  const logout = async () => {
    setBusy(true);
    try { await signOut(); router.replace('/login'); }
    finally { setBusy(false); }
  };

  return <Page>
    <Heading eyebrow="Personnalisation" title="Paramètres" subtitle="Ajuste et conserve tes préférences sur cet appareil." />
    <Card>
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRÉFÉRENCES</Text>
      <Preference title="Rappels d'étude" subtitle="Enregistre ton choix. Les notifications automatiques ne sont pas encore planifiées." value={reminders} onChange={(value) => updatePreference('reminders', value)} />
      <View style={{ height: 1, backgroundColor: C.line }} />
      <Preference title="Retour haptique" subtitle="Préférence mémorisée; les vibrations seront activées dans une prochaine version." value={haptics} onChange={(value) => updatePreference('haptics', value)} />
    </Card>
    <Card>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Confidentialité et compte</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Tes cours, notes et préférences sont enregistrés localement sur cet appareil. Ils ne sont pas encore synchronisés avec un compte en ligne.</Text>
      <Pill tone="green">SESSION ACTIVE</Pill>
      <Button title="Ouvrir mes cours" variant="secondary" onPress={() => router.push('/library')} />
      <Button title="Gérer mes notes" variant="secondary" onPress={() => router.push('/notes')} />
    </Card>
    <Button title="Se déconnecter" onPress={logout} loading={busy} variant="secondary" />
  </Page>;
}
