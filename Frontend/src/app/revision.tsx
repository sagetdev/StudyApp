import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function RevisionScreen() {
  useThemeMode();
  const pack = getCurrentStudyPack();
  const stages = [
    { title: '1. Flashcards', description: 'Rappelle-toi les notions essentielles avant de retourner les cartes.', icon: '▤', color: C.primarySoft },
    { title: '2. Quiz', description: 'Vérifie ta compréhension avec des questions à choix multiples.', icon: '✓', color: C.blue },
    { title: '3. Rappel actif', description: 'Réponds sans regarder la solution pour renforcer ta mémoire.', icon: '↗', color: C.mint },
    { title: '4. Préparation aux examens', description: 'Applique ce que tu as appris à des questions plus approfondies.', icon: '✎', color: C.amber },
  ];
  return <Page>
    <Heading eyebrow="Parcours guidé" title="Une étape à la fois." subtitle="Un parcours progressif inspiré des apps d'apprentissage : avance à ton rythme et consolide tes acquis." />
    {pack ? <Card style={{ gap: 14 }}>
      <Pill tone="green">PACK ACTIF</Pill>
      <Text style={{ color: C.ink, fontSize: 18, lineHeight: 24, fontWeight: '800' }}>{pack.overview.title}</Text>
      <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>Environ {pack.overview.estimatedStudyTimeMinutes || 15} minutes · {pack.flashcards.length + pack.multipleChoiceQuiz.length + pack.activeRecallQuestions.length + pack.examQuestions.length} activités</Text>
      {stages.map((item, index) => <View key={item.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 18, fontWeight: '800' }}>{item.icon}</Text></View>
        <View style={{ flex: 1, gap: 3 }}><Text style={{ color: C.ink, fontSize: 13, fontWeight: '800' }}>{item.title}</Text><Text style={{ color: C.muted, fontSize: 12, lineHeight: 17 }}>{item.description}</Text></View>
      </View>)}
      <Button title="Commencer le parcours  →" onPress={() => router.push('/flashcards')} disabled={!pack.flashcards.length} />
      {!pack.flashcards.length ? <Text style={{ color: C.muted, fontSize: 12 }}>Ce pack ne contient pas de flashcards. Génère un nouveau pack pour lancer le parcours complet.</Text> : null}
    </Card> : <Card><Text style={{ color: C.ink, fontWeight: '800' }}>Aucun pack actif</Text><Text style={{ color: C.muted, fontSize: 13 }}>Crée ou ouvre un cours enregistré avant de commencer.</Text><Button title="Créer un pack" onPress={() => router.replace('/(tabs)')} /></Card>}
    {pack ? <Button title="Consulter le cours" variant="secondary" onPress={() => router.replace('/study-pack')} /> : null}
  </Page>;
}
