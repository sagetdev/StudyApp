import React from 'react';
import { router } from 'expo-router';
import { Button, EmptyState, Heading, Page } from '@/components/study-ui';

export default function RankingScreen() {
  return <Page back>
    <Heading eyebrow="Communauté" title="Le classement" subtitle="Célèbre tes efforts et situe-toi parmi les autres apprenants." />
    <EmptyState icon="ranking" title="Classement en préparation" text="Aucune API de score n'est disponible pour l'instant : aucun rang fictif n'est affiché."
      action={<Button title="Créer un pack de révision" onPress={() => router.replace('/(tabs)')} />} />
  </Page>;
}
