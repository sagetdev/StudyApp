import React from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Card, Heading, ListItem, Page, Pill, SectionTitle } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import { type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';

const methods: Array<{ title: string; subtitle: string; icon: IconName; tone: ToneName; route: string }> = [
  { title: 'Flashcards', subtitle: 'Mémorise une notion à la fois.', icon: 'cards', tone: 'purple', route: '/flashcards' },
  { title: 'Quiz à choix multiples', subtitle: 'Teste ta compréhension et lis les explications.', icon: 'quiz', tone: 'blue', route: '/quiz' },
  { title: 'Glossaire', subtitle: 'Revois les termes essentiels.', icon: 'glossary', tone: 'green', route: '/glossary' },
  { title: 'Rappel actif', subtitle: 'Retrouve la réponse sans indice.', icon: 'recall', tone: 'amber', route: '/recall' },
  { title: 'Préparation aux examens', subtitle: 'Structure des réponses complètes.', icon: 'exam', tone: 'purple', route: '/exam-practice' },
];

export default function ExploreScreen() {
  const c = useColors();
  return <Page>
    <Heading eyebrow="Découvrir" title="À chaque notion, sa méthode." subtitle="Ouvre un outil de révision pour ton pack actif ou choisis un cours enregistré." />
    <Card tinted>
      <Pill>CONSEIL D’ÉTUDE</Pill>
      <Text style={[type.heading, { color: c.ink }]}>Ne relis pas seulement tes notes.</Text>
      <Text style={[type.body, { color: c.muted }]}>Le rappel actif et les quiz vérifient ce que tu sais vraiment.</Text>
      <Button title="Ouvrir mes cours" onPress={() => router.push('/library')} />
    </Card>
    <SectionTitle title="Tes méthodes de révision" />
    {methods.map((m) => <ListItem key={m.title} icon={m.icon} tone={m.tone} title={m.title} subtitle={m.subtitle} onPress={() => router.push(m.route as never)} />)}
  </Page>;
}
