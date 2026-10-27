import React from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Card, EmptyState, Heading, Page, Pill } from '@/components/study-ui';
import { type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function GlossaryScreen() {
  const c = useColors();
  const pack = getCurrentStudyPack();
  if (!pack) return <Page back><EmptyState icon="glossary" title="Glossaire vide" text="Génère un pack pour afficher les définitions." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  return <Page back>
    <Heading eyebrow="Ton pack" title="Glossaire" subtitle="Les concepts importants, expliqués simplement." />
    <Pill tone="green">{pack.glossary.length} TERMES</Pill>
    {pack.glossary.map((item, i) => <Card key={`${item.term}-${i}`}>
      <Text style={[type.heading, { color: c.ink }]}>{item.term}</Text>
      <Text style={[type.body, { color: c.muted }]}>{item.definition}</Text>
    </Card>)}
  </Page>;
}
