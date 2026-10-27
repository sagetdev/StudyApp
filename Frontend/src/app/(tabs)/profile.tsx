import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Body, Button, Card, Heading, ListItem, Page, Pill, SectionTitle } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import { space, type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

const shortcuts: Array<{ title: string; subtitle: string; route: string; icon: IconName; tone: ToneName }> = [
  { title: 'Mes cours', subtitle: 'Retrouver les packs enregistrés', route: '/library', icon: 'cards', tone: 'purple' },
  { title: 'Mes notes', subtitle: 'Capturer les notions importantes', route: '/notes', icon: 'notes', tone: 'blue' },
  { title: 'Ma progression', subtitle: 'Suivre tes sessions et tes scores', route: '/progress', icon: 'progress', tone: 'green' },
  { title: 'Classement', subtitle: 'Découvrir les défis à venir', route: '/ranking', icon: 'ranking', tone: 'amber' },
  { title: 'Paramètres', subtitle: 'Personnaliser ton expérience', route: '/settings', icon: 'settings', tone: 'purple' },
];

export default function ProfileScreen() {
  const c = useColors();
  const { session, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); router.replace('/login'); } finally { setBusy(false); } };
  return <Page>
    <Heading eyebrow="Compte" title="Ton profil" />
    <Card style={{ alignItems: 'center', paddingVertical: space.xl, gap: space.sm }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[type.display, { color: c.primary }]}>{(session?.user.email[0] || 'S').toUpperCase()}</Text>
      </View>
      <Text style={[type.heading, { color: c.ink }]}>{session?.user.email.split('@')[0] || 'Étudiant'}</Text>
      <Text style={[type.caption, { color: c.muted }]}>{session?.user.email}</Text>
      <Pill tone="green">CONNECTÉ</Pill>
    </Card>
    <SectionTitle title="Ton espace" />
    {shortcuts.map((s) => <ListItem key={s.title} icon={s.icon} tone={s.tone} title={s.title} subtitle={s.subtitle} onPress={() => router.push(s.route as never)} />)}
    <Body>Tes cours et tes notes sont sauvegardés sur ton compte : reconnecte-toi sur un autre appareil pour les retrouver.</Body>
    <Button title="Se déconnecter" variant="secondary" onPress={logout} loading={busy} />
  </Page>;
}
