import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function QuizScreen() {
  const pack = getCurrentStudyPack();
  const questions = pack?.multipleChoiceQuiz || [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  if (!questions.length) return <Page><Heading title="Quiz" subtitle="Aucune question disponible. Génère un pack pour commencer." /><Button title="Accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  const question = questions[index];
  const selected = answers[index];
  const correct = selected === question.correctAnswer;
  if (finished) {
    const score = questions.reduce((sum, item, i) => sum + (answers[i] === item.correctAnswer ? 1 : 0), 0);
    return <Page style={{ justifyContent: 'center', maxWidth: 720, alignSelf: 'center', width: '100%' }}>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 30 }}>
        <View style={{ width: 76, height: 76, borderRadius: 28, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.green, fontSize: 34, fontWeight: '800' }}>✓</Text></View>
        <Heading eyebrow="Étape 2 terminée" title={score + ' / ' + questions.length} subtitle={score / questions.length >= 0.7 ? 'Bien joué ! Continue à consolider tes acquis.' : 'Chaque erreur est une occasion d’apprendre. Revois les explications et continue.'} />
      </View>
      <Card><Text style={{ color: C.ink, fontWeight: '800', fontSize: 15 }}>Prochaine étape : rappel actif</Text><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>Tu vas maintenant restituer les notions sans choix de réponses.</Text><Button title="Continuer le parcours  →" onPress={() => router.replace('/recall')} /></Card>
      <Button title="Revoir les questions" variant="secondary" onPress={() => { setIndex(0); setAnswers({}); setFinished(false); }} />
      <Button title="Retour au pack" variant="quiet" onPress={() => router.replace('/study-pack')} />
    </Page>;
  }
  return <Page style={{ maxWidth: 720, alignSelf: 'center', width: '100%' }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Pill tone="blue">ÉTAPE 2 · QUIZ</Pill><Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>{index + 1} / {questions.length}</Text></View>
    <View style={{ height: 6, backgroundColor: C.line, borderRadius: 8, overflow: 'hidden' }}><View style={{ height: 6, width: ((index + 1) / questions.length * 100) + '%', backgroundColor: C.primary }} /></View>
    <Heading title={question.question} subtitle="Choisis la réponse qui te semble correcte." />
    <View style={{ gap: 10 }}>
      {question.options.map((option, optionIndex) => {
        const isSelected = selected === option;
        const isCorrect = Boolean(selected) && option === question.correctAnswer;
        return <Text accessibilityRole="button" key={option} onPress={() => !selected && setAnswers({ ...answers, [index]: option })} style={{ overflow: 'hidden', borderWidth: 1, borderColor: isCorrect ? C.green : isSelected ? C.primary : C.line, backgroundColor: isCorrect ? C.mint : isSelected ? C.primarySoft : C.surface, borderRadius: 15, padding: 16, color: C.ink, fontSize: 14, lineHeight: 20, fontWeight: '600' }}>{String.fromCharCode(65 + optionIndex)}.  {option}{isCorrect ? '  ✓' : ''}</Text>;
      })}
    </View>
    {selected ? <Card style={{ backgroundColor: correct ? '#EFFAF4' : '#FFF7E8', borderColor: correct ? '#CBEFDC' : '#F8E3B9' }}>
      <Text style={{ color: correct ? C.green : '#9B6500', fontWeight: '800', fontSize: 14 }}>{correct ? 'Bonne réponse !' : 'Pas tout à fait'}</Text>
      <Text style={{ color: C.ink, fontSize: 13, lineHeight: 20 }}>{question.explanation}</Text>
      {!correct ? <Text style={{ color: C.muted, fontSize: 12 }}>Réponse attendue : {question.correctAnswer}</Text> : null}
    </Card> : null}
    <Button title={!selected ? 'Sélectionne une réponse' : index === questions.length - 1 ? 'Voir mon résultat' : 'Question suivante →'} disabled={!selected} onPress={() => selected && (index === questions.length - 1 ? setFinished(true) : setIndex(index + 1))} />
  </Page>;
}
