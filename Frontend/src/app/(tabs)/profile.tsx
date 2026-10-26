import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

const shortcuts = [
  { title: 'Mes notes', subtitle: 'Capturer les notions importantes', route: '/notes', icon: '✎', tone: C.primarySoft },
  { title: 'Ma progression', subtitle: 'Suivre tes sessions et tes scores', route: '/progress', icon: '↗', tone: C.mint },
  { title: 'Classement', subtitle: 'Découvrir les défis à venir', route: '/ranking', icon: '♛', tone: C.amber },
  { title: 'Paramètres', subtitle: 'Personnaliser ton expérience', route: '/settings', icon: '⚙', tone: C.blue },
] as const;

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); router.replace('/login'); } finally { setBusy(false); } };
  return <Page>
    <Heading eyebrow="Compte" title="Ton profil" subtitle="Gère ta session et accède à tes outils personnels." />
    <Card style={{ alignItems: 'center', paddingVertical: 26 }}>
      <View style={{ width: 76, height: 76, borderRadius: 26, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.primary, fontSize: 30, fontWeight: '800' }}>{(session?.user.email[0] || 'S').toUpperCase()}</Text>
      </View>
      <Text style={{ color: C.ink, fontSize: 18, fontWeight: '800' }}>{session?.user.email.split('@')[0] || 'Étudiant'}</Text>
      <Text style={{ color: C.muted, fontSize: 13 }}>{session?.user.email}</Text>
      <Pill tone="green">SESSION CONNECTÉE</Pill>
    </Card>
    <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Ton espace</Text>
    {shortcuts.map((item) => <Pressable key={item.title} onPress={() => router.push(item.route)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13 }}>
        <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: item.tone, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 20, fontWeight: '800' }}>{item.icon}</Text></View>
        <View style={{ flex: 1, gap: 4 }}><Text style={{ color: C.ink, fontSize: 13, fontWeight: '800' }}>{item.title}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{item.subtitle}</Text></View>
        <Text style={{ color: C.muted, fontSize: 22 }}>›</Text>
      </Card>
    </Pressable>)}
    <Card>
      <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700' }}>À propos de la session</Text>
      <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>La connexion reste active tant que l'app est ouverte. Une reconnexion sera demandée après un redémarrage complet. Les statistiques et l'historique seront synchronisés lorsque les routes backend seront ajoutées.</Text>
    </Card>
    <Button title="Se déconnecter" variant="secondary" onPress={logout} loading={busy} />
  </Page>;
}
