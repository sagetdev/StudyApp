import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function RevisionScreen() {
  const pack = getCurrentStudyPack();
  const options = [
    { title: 'Flashcards', description: 'Mémorise les notions essentielles.', route: '/flashcards', icon: '▤', color: C.primarySoft },
    { title: 'Quiz', description: 'Vérifie ta compréhension.', route: '/quiz', icon: '✓', color: C.blue },
    { title: 'Rappel actif', description: 'Récupère l’information de mémoire.', route: '/recall', icon: '↗', color: C.mint },
  ] as const;
  return <Page>
    <Heading eyebrow="Session de révision" title="On passe à la pratique." subtitle={pack ? `Choisis comment réviser « ${pack.overview.title} ».` : 'Génère un pack depuis l’accueil pour démarrer une session.'} />
    {pack ? <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}><Pill>PACK ACTIF</Pill><Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>{pack.overview.title}</Text><Text style={{ color: C.muted, fontSize: 12 }}>{pack.flashcards.length} flashcards · {pack.multipleChoiceQuiz.length} questions quiz</Text><Button title="Voir le pack" onPress={() => router.push('/study-pack')} variant="secondary" /></Card> : null}
    {options.map((item) => <Card key={item.title} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 21, fontWeight: '800' }}>{item.icon}</Text></View>
      <View style={{ flex: 1, gap: 4 }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: '800' }}>{item.title}</Text><Text style={{ color: C.muted, fontSize: 12 }}>{item.description}</Text></View>
      <Text onPress={() => router.push(item.route)} style={{ color: C.primary, fontSize: 22 }}>›</Text>
    </Card>)}
    {!pack ? <Button title="Créer mon premier pack" onPress={() => router.replace('/(tabs)')} /> : null}
  </Page>;
}
