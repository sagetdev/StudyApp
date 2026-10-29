import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';
import { generateStudyPack, createStudyPack } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCurrentStudyPack, setCurrentStudyPack } from '@/lib/study-pack-store';

export default function TutorScreen() {
  useThemeMode();
  const { width: screenWidth } = useWindowDimensions();
  const wideLayout = screenWidth >= 1050;
  const pack = getCurrentStudyPack();
  const { session } = useAuth();
  const [busyPrompt, setBusyPrompt] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [error, setError] = useState('');
  const prompts = pack?.aiTutorPrompts || [];
  const ask = async (prompt: string) => {
    if (!session?.token) { router.replace('/login'); return; }
    setError('');
    const busyKey = prompt === customQuestion.trim() ? '__custom__' : prompt;
    setBusyPrompt(busyKey);
    try {
      const courseContext = pack ? [
        `Sujet du cours actuel : ${pack.overview.title}`,
        `Résumé du cours : ${pack.overview.summary}`,
        pack.overview.keyTakeaways?.length ? `Notions importantes : ${pack.overview.keyTakeaways.join('; ')}` : '',
      ].filter(Boolean).join('\n') : '';
      const contextualQuestion = `CONTEXTE DU COURS ACTUEL\n${courseContext || 'Aucun cours actuel disponible.'}\n\nDEMANDE DE L’ÉTUDIANT\n${prompt}\n\nConsigne : réponds à la demande en restant directement lié au sujet du cours actuel. Si la demande semble sans rapport, ne pars pas sur un cours sans rapport : explique le lien possible avec le sujet actuel et recentre le contenu sur ce sujet. Personnalise les explications et exemples autour de la demande précise de l’étudiant.`;
      const nextPack = await generateStudyPack(contextualQuestion, session.token);
      await createStudyPack(nextPack, prompt, session.token);
      await setCurrentStudyPack(nextPack);
      router.push('/study-pack');
    } catch (e) { setError(e instanceof Error ? e.message : 'Impossible de générer une réponse.'); }
    finally { setBusyPrompt(''); }
  };
  return <Page>
    <Heading eyebrow="Approfondir" title="Explore plus loin." subtitle="Choisis une question suggérée pour générer un nouveau pack d'apprentissage autour du sujet." />
    <View style={{ flexDirection: wideLayout ? 'row' : 'column', alignItems: 'stretch', gap: 22, width: '100%' }}>
    <View style={{ flex: wideLayout ? 1.05 : undefined, minWidth: 0, gap: 18 }}> 
    <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}>
      <Pill>ASSISTANT D'ÉTUDE</Pill>
      <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800', lineHeight: 24 }}>{pack?.overview.title || 'Choisis une piste pour commencer'}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Le backend actuel génère un pack complet à partir d'une question ; il ne propose pas encore de conversation chat multi-messages.</Text>
    </Card>
    <Card>
      <Pill>TA QUESTION PERSONNALISÉE</Pill>
      <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Qu’aimerais-tu comprendre plus précisément ?</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>
        Pose ta propre question sur « {pack?.overview.title || 'le sujet étudié'} ». L’IA utilisera le cours actuel pour te répondre avec des explications et des exemples adaptés, tout en restant dans le sujet.
      </Text>
      <TextInput
        value={customQuestion}
        onChangeText={setCustomQuestion}
        placeholder="Ex. Peux-tu m'expliquer cette notion avec un exemple concret ?"
        placeholderTextColor={C.muted}
        multiline
        maxLength={1200}
        textAlignVertical="top"
        accessibilityLabel="Ta question personnalisée sur le cours"
        style={{ minHeight: 112, maxHeight: 220, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 13, color: C.ink, backgroundColor: C.bg, fontSize: 14, lineHeight: 21 }}
      />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: 'right' }}>{customQuestion.length}/1200</Text>
      <Button
        title={busyPrompt === '__custom__' ? 'Préparation de ta réponse…' : 'Poser ma question →'}
        onPress={() => {
          const question = customQuestion.trim();
          if (question.length < 5) { setError('Écris une question un peu plus précise (au moins 5 caractères).'); return; }
          ask(question);
        }}
        loading={busyPrompt === '__custom__'}
        disabled={!!busyPrompt || customQuestion.trim().length < 5}
      />
    </Card>
    {error ? <Text accessibilityRole="alert" style={{ color: C.danger, fontSize: 13 }}>{error}</Text> : null}
    </View>
    <View style={{ flex: wideLayout ? 0.95 : undefined, minWidth: 0, gap: 12 }}>
    <Heading eyebrow="Suggestions" title="Questions pour approfondir" subtitle="Choisis une piste proposée par l’IA ou pose ta propre question." />
    {prompts.length ? prompts.map((prompt, index) => <Card key={`${index}-${prompt}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 18, fontWeight: '800' }}>?</Text></View>
      <View style={{ flex: 1, gap: 10 }}>
        <Text style={{ color: C.ink, fontSize: 13, lineHeight: 20, fontWeight: '600' }}>{prompt}</Text>
        <Button title={busyPrompt === prompt ? 'Génération…' : 'Explorer cette question →'} onPress={() => ask(prompt)} loading={busyPrompt === prompt} disabled={!!busyPrompt && busyPrompt !== prompt} variant="secondary" />
      </View>
    </Card>) : <Card><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Les suggestions de questions apparaîtront ici après la génération d'un pack.</Text><Button title="Créer un pack" onPress={() => router.replace('/(tabs)')} /></Card>}
    </View>
    </View>
  </Page>;
}
