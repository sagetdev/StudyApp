import React from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Card, EmptyState, Heading, ListItem, Page, Pill } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import { type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

const options: Array<{ title: string; description: string; route: string; icon: IconName; tone: ToneName }> = [
  { title: 'Flashcards', description: 'Mémorise les notions essentielles.', route: '/flashcards', icon: 'cards', tone: 'purple' },
  { title: 'Quiz', description: 'Vérifie ta compréhension.', route: '/quiz', icon: 'quiz', tone: 'blue' },
  { title: 'Rappel actif', description: "Retrouve l'information de mémoire.", route: '/recall', icon: 'recall', tone: 'green' },
];

export default function RevisionScreen() {
  const c = useColors();
  const pack = getCurrentStudyPack();
  if (!pack) return <Page back><EmptyState icon="book" title="Aucun pack actif" text="Génère un pack depuis l'accueil pour démarrer une session." action={<Button title="Créer mon premier pack" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  return <Page back>
    <Heading eyebrow="Session de révision" title="On passe à la pratique." subtitle={`Choisis comment réviser « ${pack.overview.title} ».`} />
    <Card tinted>
      <Pill>PACK ACTIF</Pill>
      <Text style={[type.heading, { color: c.ink }]}>{pack.overview.title}</Text>
      <Text style={[type.caption, { color: c.muted }]}>{pack.flashcards.length} flashcards · {pack.multipleChoiceQuiz.length} questions de quiz</Text>
      <Button title="Voir le pack" variant="secondary" onPress={() => router.push('/study-pack')} />
    </Card>
    {options.map((o) => <ListItem key={o.title} icon={o.icon} tone={o.tone} title={o.title} subtitle={o.description} onPress={() => router.push(o.route as never)} />)}
  </Page>;
}
