import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function RecallScreen() {
  const questions = getCurrentStudyPack()?.activeRecallQuestions || [];
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  if (!questions.length) return <Page><Heading title="Rappel actif" subtitle="Génère un pack pour accéder aux questions." /><Button title="Accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  const item = questions[index];
  const move = () => { if (index === questions.length - 1) router.back(); else { setIndex(index + 1); setShowHint(false); setShowAnswer(false); } };
  return <Page>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Pill tone="amber">RAPPEL ACTIF</Pill><Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>{index + 1} / {questions.length}</Text></View>
    <Heading title={item.question} subtitle="Essaie de formuler ta réponse avant de révéler la solution." />
    <Card style={{ minHeight: 150, justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
      {showAnswer ? <><Text style={{ color: C.green, fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>RÉPONSE ATTENDUE</Text><Text style={{ color: C.ink, fontSize: 15, lineHeight: 23 }}>{item.expectedAnswer}</Text></> : <Text style={{ color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>Prends quelques secondes pour réfléchir, puis compare avec la réponse attendue.</Text>}
    </Card>
    {item.hint && !showAnswer ? <Button title={showHint ? `Indice : ${item.hint}` : 'Afficher un indice'} variant="secondary" onPress={() => setShowHint(true)} /> : null}
    <Button title={showAnswer ? (index === questions.length - 1 ? 'Terminer' : 'Question suivante →') : 'Révéler la réponse'} onPress={() => showAnswer ? move() : setShowAnswer(true)} />
  </Page>;
}
