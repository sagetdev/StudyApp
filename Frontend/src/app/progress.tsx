import React from 'react';
import { router } from 'expo-router';
import { Button, EmptyState, Heading, ListItem, Page, SectionTitle } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import type { ToneName } from '@/constants/design';

const upcoming: Array<{ title: string; icon: IconName; tone: ToneName }> = [
  { title: 'Temps de révision par semaine', icon: 'clock', tone: 'green' },
  { title: 'Précision aux quiz et évolution des scores', icon: 'quiz', tone: 'blue' },
  { title: 'Notions à revoir en priorité', icon: 'recall', tone: 'amber' },
];

export default function ProgressScreen() {
  return <Page back>
    <Heading eyebrow="Ton évolution" title="Chaque session compte." subtitle="Un espace pour visualiser tes habitudes et tes progrès." />
    <EmptyState icon="progress" title="Bientôt disponible" text="Les sessions et les scores ne sont pas encore enregistrés par le serveur. Cette page s'activera dès que ce sera le cas."
      action={<Button title="Lancer une révision" onPress={() => router.replace('/(tabs)')} />} />
    <SectionTitle title="Ce que tu pourras suivre" />
    {upcoming.map((u) => <ListItem key={u.title} icon={u.icon} tone={u.tone} title={u.title} onPress={() => router.replace('/(tabs)')} />)}
  </Page>;
}
