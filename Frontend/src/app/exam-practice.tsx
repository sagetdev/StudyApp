import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function ExamPracticeScreen() {
  const questions = getCurrentStudyPack()?.examQuestions || [];
  if (!questions.length) return <Page><Heading title="Préparation aux examens" subtitle="Génère un pack pour afficher les sujets." /><Button title="Accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  return <Page>
    <Heading eyebrow="Aller plus loin" title="Préparation aux examens" subtitle="Entraîne-toi à structurer des réponses complètes à partir des critères proposés." />
    {questions.map((item, index) => <Card key={`${index}-${item.question}`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Pill tone="purple">SUJET {index + 1}</Pill><Text style={{ color: C.muted, fontSize: 11 }}>{item.gradingCriteria.length} critères</Text></View>
      <Text style={{ color: C.ink, fontSize: 16, lineHeight: 23, fontWeight: '800' }}>{item.question}</Text>
      <View style={{ height: 1, backgroundColor: C.line }} />
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 }}>POUR CONSTRUIRE TA RÉPONSE</Text>
      {item.gradingCriteria.map((criterion, i) => <View key={criterion} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
        <Text style={{ color: C.primary, fontWeight: '800' }}>{i + 1}.</Text><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20, flex: 1 }}>{criterion}</Text>
      </View>)}
    </Card>)}
  </Page>;
}
