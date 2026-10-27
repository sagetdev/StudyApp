import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, C, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function FlashcardsScreen() {
  const pack = getCurrentStudyPack();
  const cards = pack?.flashcards || [];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return <Page><Heading title="Flashcards" subtitle="Aucune carte disponible. Génère d'abord un pack." /><Button title="Accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  const card = cards[index];
  const move = (next: number) => { setIndex(next); setFlipped(false); };
  return <Page style={{ justifyContent: 'center' }}>
    <Heading eyebrow="Répétition active" title="Flashcards" subtitle="Essaie de répondre avant de retourner la carte." />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Pill tone="purple">{card.difficulty === 'EASY' ? 'FACILE' : card.difficulty === 'HARD' ? 'DIFFICILE' : 'INTERMÉDIAIRE'}</Pill><Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>{index + 1} / {cards.length}</Text></View>
    <View style={{ height: 5, backgroundColor: C.line, borderRadius: 8, overflow: 'hidden' }}><View style={{ height: 5, width: `${((index + 1) / cards.length) * 100}%`, backgroundColor: C.primary, borderRadius: 8 }} /></View>
    <Pressable accessibilityRole="button" accessibilityLabel={flipped ? 'Afficher la question' : 'Afficher la réponse'} onPress={() => setFlipped(!flipped)} style={({ pressed }) => [{ backgroundColor: flipped ? '#F0ECFF' : '#FFFFFF', borderRadius: 26, borderWidth: 1, borderColor: C.line, padding: 26, minHeight: 320, alignItems: 'center', justifyContent: 'center', gap: 18, opacity: pressed ? 0.86 : 1 }]}>
      <Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>{flipped ? 'RÉPONSE' : 'QUESTION'}</Text>
      <Text style={{ color: C.ink, fontSize: 22, lineHeight: 30, fontWeight: '800', textAlign: 'center' }}>{flipped ? card.back : card.front}</Text>
      <Text style={{ color: C.muted, fontSize: 12 }}>Toucher pour {flipped ? 'revoir la question' : 'voir la réponse'}</Text>
    </Pressable>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}><Button title="← Précédente" variant="secondary" onPress={() => move(Math.max(0, index - 1))} disabled={index === 0} /></View>
      <View style={{ flex: 1 }}><Button title={index === cards.length - 1 ? 'Terminer ✓' : 'Suivante →'} onPress={() => index === cards.length - 1 ? router.back() : move(index + 1)} /></View>
    </View>
  </Page>;
}
