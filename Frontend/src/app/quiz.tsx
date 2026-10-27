import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, EmptyState, Heading, IconBadge, Page, Pill, ProgressBar } from '@/components/study-ui';
import { Icon } from '@/components/icon';
import { radius, space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function QuizScreen() {
  const c = useColors();
  const questions = getCurrentStudyPack()?.multipleChoiceQuiz || [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  if (!questions.length) return <Page back><EmptyState icon="quiz" title="Aucune question" text="Génère un pack pour commencer le quiz." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  const question = questions[index];
  const selected = answers[index];
  const correct = selected === question.correctAnswer;

  if (finished) {
    const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correctAnswer ? 1 : 0), 0);
    return <Page back style={{ justifyContent: 'center', gap: space.xl }}>
      <View style={{ alignItems: 'center', gap: space.lg }}>
        <IconBadge icon="check" tone="green" size={76} />
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <Text style={[type.label, { color: c.primary }]}>SESSION TERMINÉE</Text>
          <Text style={[type.display, { color: c.ink, fontSize: 40, lineHeight: 46 }]}>{score} / {questions.length}</Text>
          <Text style={[type.body, { color: c.muted, textAlign: 'center' }]}>{score / questions.length >= 0.7 ? 'Bien joué ! Continue à consolider tes acquis.' : "Chaque erreur est une occasion d'apprendre. Relis les explications et réessaie."}</Text>
        </View>
      </View>
      <Button title="Recommencer le quiz" variant="secondary" onPress={() => { setIndex(0); setAnswers({}); setFinished(false); }} />
      <Button title="Retour au pack" onPress={() => router.replace('/study-pack')} />
    </Page>;
  }

  return <Page back>
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill tone="blue">QUIZ</Pill>
        <Text style={[type.caption, { color: c.muted, fontWeight: '700' }]}>{index + 1} / {questions.length}</Text>
      </View>
      <ProgressBar value={(index + 1) / questions.length} label="Progression du quiz" />
    </View>
    <Heading title={question.question} subtitle="Choisis la réponse qui te semble correcte." />
    <View style={{ gap: space.md }}>
      {question.options.map((option, i) => {
        const isSelected = selected === option;
        const isRight = !!selected && option === question.correctAnswer;
        const isWrong = isSelected && !isRight;
        const border = isRight ? c.success : isWrong ? c.danger : isSelected ? c.primary : c.line;
        const bg = isRight ? c.tones.green.bg : isWrong ? c.tones.red.bg : c.surface;
        return <Pressable key={option} accessibilityRole="radio" accessibilityState={{ selected: isSelected, disabled: !!selected }}
          accessibilityLabel={`Option ${String.fromCharCode(65 + i)} : ${option}${isRight ? ', bonne réponse' : isWrong ? ', incorrecte' : ''}`}
          disabled={!!selected} onPress={() => setAnswers({ ...answers, [index]: option })}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 60, borderWidth: isRight || isWrong ? 2 : 1, borderColor: border, backgroundColor: bg, borderRadius: radius.md, padding: space.lg, opacity: pressed ? 0.8 : 1 })}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[type.caption, { color: c.primary, fontWeight: '800' }]}>{String.fromCharCode(65 + i)}</Text>
          </View>
          <Text style={[type.bodyStrong, { color: c.ink, flex: 1 }]}>{option}</Text>
          {isRight ? <Icon name="check" color={c.success} size={22} /> : isWrong ? <Icon name="cross" color={c.danger} size={20} /> : null}
        </Pressable>;
      })}
    </View>
    {selected ? <Card style={{ backgroundColor: correct ? c.tones.green.bg : c.tones.amber.bg, borderColor: 'transparent' }}>
      <Text style={[type.heading, { color: correct ? c.tones.green.fg : c.tones.amber.fg }]}>{correct ? 'Bonne réponse !' : 'Pas tout à fait'}</Text>
      <Text style={[type.body, { color: c.ink }]}>{question.explanation}</Text>
      {!correct ? <Text style={[type.caption, { color: c.muted }]}>Réponse attendue : {question.correctAnswer}</Text> : null}
    </Card> : null}
    <Button title={!selected ? 'Choisis une réponse' : index === questions.length - 1 ? 'Voir mon résultat' : 'Question suivante'} disabled={!selected} onPress={() => (index === questions.length - 1 ? setFinished(true) : setIndex(index + 1))} />
  </Page>;
}
