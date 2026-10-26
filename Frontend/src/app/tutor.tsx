import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { generateStudyPack, createStudyPack } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCurrentStudyPack, setCurrentStudyPack } from '@/lib/study-pack-store';

export default function TutorScreen() {
  const pack = getCurrentStudyPack();
  const { session } = useAuth();
  const [busyPrompt, setBusyPrompt] = useState('');
  const [error, setError] = useState('');
  const prompts = pack?.aiTutorPrompts || [];
  const ask = async (prompt: string) => {
    if (!session?.token) { router.replace('/login'); return; }
    setError(''); setBusyPrompt(prompt);
    try {
      const nextPack = await generateStudyPack(prompt, session.token);
      await createStudyPack(nextPack, prompt, session.token);
      await setCurrentStudyPack(nextPack);
      router.push('/study-pack');
    } catch (e) { setError(e instanceof Error ? e.message : 'Impossible de générer une réponse.'); }
    finally { setBusyPrompt(''); }
  };
  return <Page>
    <Heading eyebrow="Approfondir" title="Explore plus loin." subtitle="Choisis une question suggérée pour générer un nouveau pack d'apprentissage autour du sujet." />
    <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}>
      <Pill>ASSISTANT D'ÉTUDE</Pill>
      <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800', lineHeight: 24 }}>{pack?.overview.title || 'Choisis une piste pour commencer'}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Le backend actuel génère un pack complet à partir d'une question ; il ne propose pas encore de conversation chat multi-messages.</Text>
    </Card>
    {error ? <Text accessibilityRole="alert" style={{ color: C.danger, fontSize: 13 }}>{error}</Text> : null}
    {prompts.length ? prompts.map((prompt, index) => <Card key={`${index}-${prompt}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 18, fontWeight: '800' }}>?</Text></View>
      <View style={{ flex: 1, gap: 10 }}>
        <Text style={{ color: C.ink, fontSize: 13, lineHeight: 20, fontWeight: '600' }}>{prompt}</Text>
        <Button title={busyPrompt === prompt ? 'Génération…' : 'Explorer cette question →'} onPress={() => ask(prompt)} loading={busyPrompt === prompt} disabled={!!busyPrompt && busyPrompt !== prompt} variant="secondary" />
      </View>
    </Card>) : <Card><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Les suggestions de questions apparaîtront ici après la génération d'un pack.</Text><Button title="Créer un pack" onPress={() => router.replace('/(tabs)')} /></Card>}
  </Page>;
}
