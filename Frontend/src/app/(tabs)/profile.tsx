import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); router.replace('/login'); } finally { setBusy(false); } };
  return <Page>
    <Heading eyebrow="Compte" title="Ton profil" subtitle="Gère ta session et retrouve les informations de ton compte." />
    <Card style={{ alignItems: 'center', paddingVertical: 26 }}>
      <View style={{ width: 76, height: 76, borderRadius: 26, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.primary, fontSize: 30, fontWeight: '800' }}>{(session?.user.email[0] || 'S').toUpperCase()}</Text>
      </View>
      <Text style={{ color: C.ink, fontSize: 18, fontWeight: '800' }}>{session?.user.email.split('@')[0] || 'Étudiant'}</Text>
      <Text style={{ color: C.muted, fontSize: 13 }}>{session?.user.email}</Text>
      <Pill tone="green">SESSION CONNECTÉE</Pill>
    </Card>
    <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Préférences</Text>
    <Card>
      <View style={{ gap: 4 }}>
        <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700' }}>Sécurité du compte</Text>
        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>Ta session est conservée sur cet appareil. Le serveur gère les connexions par jeton JWT.</Text>
      </View>
      <View style={{ height: 1, backgroundColor: C.line }} />
      <View style={{ gap: 4 }}>
        <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700' }}>Historique d'étude</Text>
        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>La sauvegarde des packs et des scores nécessite encore des routes backend dédiées.</Text>
      </View>
    </Card>
    <Button title="Se déconnecter" variant="secondary" onPress={logout} loading={busy} />
  </Page>;
}
