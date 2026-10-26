import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';

const methods = [
  { title: 'Flashcards', subtitle: 'Mémorise une notion à la fois.', icon: '▤', tone: C.primarySoft, color: C.primary },
  { title: 'Quiz à choix multiples', subtitle: 'Teste ta compréhension et découvre les explications.', icon: '✓', tone: C.blue, color: '#2865A8' },
  { title: 'Glossaire', subtitle: 'Revois les termes essentiels et leurs définitions.', icon: 'Aa', tone: C.mint, color: C.green },
  { title: 'Rappel actif', subtitle: 'Entraîne-toi à retrouver la réponse sans indice.', icon: '↗', tone: C.amber, color: '#9B6500' },
];

export default function ExploreScreen() {
  return <Page>
    <Heading eyebrow="Découvrir" title="À chaque notion, sa méthode." subtitle="Choisis une méthode pour comprendre ce que tu peux faire avec un pack généré." />
    <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}>
      <Pill>CONSEIL D'ÉTUDE</Pill>
      <Text style={{ color: C.ink, fontSize: 20, fontWeight: '800', lineHeight: 27 }}>Ne relis pas seulement tes notes.</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Le rappel actif et les quiz t'aident à vérifier ce que tu sais vraiment. Commence par créer un pack depuis l'accueil.</Text>
      <Button title="Créer un pack" onPress={() => router.replace('/(tabs)')} />
    </Card>
    <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>Tes méthodes de révision</Text>
    {methods.map((method) => <Card key={method.title} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: method.tone, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: method.color, fontWeight: '800', fontSize: 20 }}>{method.icon}</Text>
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ color: C.ink, fontSize: 14, fontWeight: '800' }}>{method.title}</Text>
        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>{method.subtitle}</Text>
      </View>
    </Card>)}
    <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>Les méthodes s'ouvrent depuis le pack de révision généré. La bibliothèque persistante arrivera avec les routes de sauvegarde du backend.</Text>
  </Page>;
}
