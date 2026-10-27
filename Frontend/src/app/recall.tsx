import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, EmptyState, Heading, Page, Pill, ProgressBar } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function RecallScreen() {
  const c = useColors();
  const questions = getCurrentStudyPack()?.activeRecallQuestions || [];
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  if (!questions.length) return <Page back><EmptyState icon="recall" title="Aucune question" text="Génère un pack pour accéder au rappel actif." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  const item = questions[index];
  const last = index === questions.length - 1;
  const next = () => { if (last) router.back(); else { setIndex(index + 1); setShowHint(false); setShowAnswer(false); } };
  return <Page back>
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill tone="amber">RAPPEL ACTIF</Pill>
        <Text style={[type.caption, { color: c.muted, fontWeight: '700' }]}>{index + 1} / {questions.length}</Text>
      </View>
      <ProgressBar value={(index + 1) / questions.length} label="Progression du rappel actif" />
    </View>
    <Heading title={item.question} subtitle="Formule ta réponse dans ta tête avant de la révéler." />
    <Card style={{ minHeight: 150, justifyContent: 'center' }}>
      {showAnswer
        ? <><Text style={[type.label, { color: c.success }]}>RÉPONSE ATTENDUE</Text><Text style={[type.body, { color: c.ink }]}>{item.expectedAnswer}</Text></>
        : <Text style={[type.body, { color: c.muted, textAlign: 'center' }]}>Prends quelques secondes pour réfléchir, puis compare avec la réponse attendue.</Text>}
    </Card>
    {item.hint && !showAnswer ? (showHint
      ? <Card tinted><Text style={[type.label, { color: c.primary }]}>INDICE</Text><Text style={[type.body, { color: c.ink }]}>{item.hint}</Text></Card>
      : <Button title="Afficher un indice" variant="secondary" onPress={() => setShowHint(true)} />) : null}
    <Button title={showAnswer ? (last ? 'Terminer' : 'Question suivante') : 'Révéler la réponse'} onPress={() => (showAnswer ? next() : setShowAnswer(true))} />
  </Page>;
}
