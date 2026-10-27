import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, EmptyState, Heading, Page, Pill, ProgressBar } from '@/components/study-ui';
import { radius, space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

const difficulty = { EASY: ['FACILE', 'green'], MEDIUM: ['INTERMÉDIAIRE', 'amber'], HARD: ['DIFFICILE', 'red'] } as const;

export default function FlashcardsScreen() {
  const c = useColors();
  const cards = getCurrentStudyPack()?.flashcards || [];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return <Page back><EmptyState icon="cards" title="Aucune carte" text="Génère d'abord un pack pour réviser avec des flashcards." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  const card = cards[index];
  const [label, tone] = difficulty[card.difficulty] ?? difficulty.MEDIUM;
  const move = (next: number) => { setIndex(next); setFlipped(false); };
  return <Page back>
    <Heading eyebrow="Répétition active" title="Flashcards" />
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill tone={tone}>{label}</Pill>
        <Text style={[type.caption, { color: c.muted, fontWeight: '700' }]}>{index + 1} / {cards.length}</Text>
      </View>
      <ProgressBar value={(index + 1) / cards.length} label="Progression des flashcards" />
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={flipped ? `Réponse : ${card.back}. Toucher pour revoir la question` : `Question : ${card.front}. Toucher pour voir la réponse`}
      onPress={() => setFlipped(!flipped)}
      style={({ pressed }) => ({ backgroundColor: flipped ? c.surfaceTint : c.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: flipped ? c.primarySoft : c.line, padding: space.xl, minHeight: 320, alignItems: 'center', justifyContent: 'center', gap: space.lg, opacity: pressed ? 0.9 : 1 })}>
      <Text style={[type.label, { color: c.primary }]}>{flipped ? 'RÉPONSE' : 'QUESTION'}</Text>
      <Text style={[type.title, { color: c.ink, textAlign: 'center' }]}>{flipped ? card.back : card.front}</Text>
      <Text style={[type.caption, { color: c.faint }]}>Toucher pour {flipped ? 'revoir la question' : 'voir la réponse'}</Text>
    </Pressable>
    <View style={{ flexDirection: 'row', gap: space.md }}>
      <View style={{ flex: 1 }}><Button title="Précédente" variant="secondary" onPress={() => move(Math.max(0, index - 1))} disabled={index === 0} /></View>
      <View style={{ flex: 1 }}><Button title={index === cards.length - 1 ? 'Terminer' : 'Suivante'} onPress={() => (index === cards.length - 1 ? router.back() : move(index + 1))} /></View>
    </View>
  </Page>;
}
