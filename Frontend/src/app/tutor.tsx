import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, EmptyState, ErrorText, Heading, IconBadge, Page, Pill } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { generateStudyPack, createStudyPack } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCurrentStudyPack, setCurrentStudyPack } from '@/lib/study-pack-store';

export default function TutorScreen() {
  const c = useColors();
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
  return <Page back>
    <Heading eyebrow="Approfondir" title="Explore plus loin." subtitle="Choisis une question pour générer un nouveau pack autour du sujet." />
    <Card tinted>
      <Pill>ASSISTANT D’ÉTUDE</Pill>
      <Text style={[type.heading, { color: c.ink }]}>{pack?.overview.title || 'Choisis une piste pour commencer'}</Text>
      <Text style={[type.caption, { color: c.muted }]}>Chaque question génère un pack complet. La conversation multi-messages n’est pas encore disponible.</Text>
    </Card>
    <ErrorText>{error}</ErrorText>
    {prompts.length ? prompts.map((prompt, i) => <Card key={`${i}-${prompt}`}>
      <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
        <IconBadge icon="help" tone="purple" size={36} />
        <Text style={[type.bodyStrong, { color: c.ink, flex: 1 }]}>{prompt}</Text>
      </View>
      <Button title="Explorer cette question" variant="secondary" onPress={() => ask(prompt)} loading={busyPrompt === prompt} disabled={!!busyPrompt && busyPrompt !== prompt} />
    </Card>) : <EmptyState icon="help" title="Pas encore de suggestions" text="Les questions apparaîtront ici après la génération d'un pack." action={<Button title="Créer un pack" onPress={() => router.replace('/(tabs)')} />} />}
  </Page>;
}
