import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, Divider, EmptyState, Heading, Page, Pill } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function ExamPracticeScreen() {
  const c = useColors();
  const questions = getCurrentStudyPack()?.examQuestions || [];
  if (!questions.length) return <Page back><EmptyState icon="exam" title="Aucun sujet" text="Génère un pack pour afficher les sujets d'examen." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  return <Page back>
    <Heading eyebrow="Aller plus loin" title="Préparation aux examens" subtitle="Entraîne-toi à structurer des réponses complètes à partir des critères proposés." />
    {questions.map((item, i) => <Card key={`${i}-${item.question}`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill>SUJET {i + 1}</Pill>
        <Text style={[type.caption, { color: c.faint }]}>{item.gradingCriteria.length} critères</Text>
      </View>
      <Text style={[type.heading, { color: c.ink }]}>{item.question}</Text>
      <Divider />
      <Text style={[type.label, { color: c.primary }]}>POUR CONSTRUIRE TA RÉPONSE</Text>
      {item.gradingCriteria.map((criterion, n) => <View key={criterion} style={{ flexDirection: 'row', gap: space.sm }}>
        <Text style={[type.bodyStrong, { color: c.primary }]}>{n + 1}.</Text>
        <Text style={[type.body, { color: c.muted, flex: 1 }]}>{criterion}</Text>
      </View>)}
    </Card>)}
  </Page>;
}
