import React from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';

const methods = [
  { title: 'Flashcards', subtitle: 'Mémorise une notion à la fois.', icon: '▤', tone: C.primarySoft, color: C.primary, route: '/flashcards' },
  { title: 'Quiz à choix multiples', subtitle: 'Teste ta compréhension et découvre les explications.', icon: '✓', tone: C.blue, color: '#2865A8', route: '/quiz' },
  { title: 'Glossaire', subtitle: 'Revois les termes essentiels et leurs définitions.', icon: 'Aa', tone: C.mint, color: C.green, route: '/glossary' },
  { title: 'Rappel actif', subtitle: 'Entraîne-toi à retrouver la réponse sans indice.', icon: '↗', tone: C.amber, color: '#9B6500', route: '/recall' },
  { title: 'Préparation aux examens', subtitle: 'Prépare des réponses structurées.', icon: '✎', tone: '#F2EDFF', color: C.primary, route: '/exam-practice' },
];

export default function ExploreScreen() {
  return <Page>
    <Heading eyebrow="Découvrir" title="À chaque notion, sa méthode." subtitle="Ouvre un outil de révision pour le pack actif ou choisis un cours enregistré." />
    <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}>
      <Pill>CONSEIL D'ÉTUDE</Pill>
      <Text style={{ color: C.ink, fontSize: 20, fontWeight: '800' }}>Ne relis pas seulement tes notes.</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Le rappel actif et les quiz t'aident à vérifier ce que tu sais vraiment. Choisis un cours enregistré pour reprendre là où tu en étais.</Text>
      <Button title="Ouvrir mes cours" onPress={() => router.push('/library')} />
      <Button title="Créer un pack" variant="secondary" onPress={() => router.replace('/(tabs)')} />
    </Card>
    <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>Tes méthodes de révision</Text>
    {methods.map((method) => <Pressable key={method.title} accessibilityRole="button" onPress={() => router.push(method.route as any)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: method.tone, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: method.color, fontWeight: '800', fontSize: 20 }}>{method.icon}</Text>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ color: C.ink, fontSize: 14, fontWeight: '800' }}>{method.title}</Text>
          <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>{method.subtitle}</Text>
        </View>
        <Text style={{ color: C.primary, fontSize: 22 }}>›</Text>
      </Card>
    </Pressable>)}
  </Page>;
}
