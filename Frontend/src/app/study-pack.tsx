import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, EmptyState, Heading, IconBadge, ListItem, Page, Pill, SectionTitle } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import { space, type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function StudyPackScreen() {
  const c = useColors();
  const pack = getCurrentStudyPack();
  if (!pack) return <Page back><EmptyState icon="book" title="Aucun pack ouvert" text="Génère un pack depuis l'accueil pour commencer à réviser." action={<Button title="Aller à l'accueil" onPress={() => router.replace('/(tabs)')} />} /></Page>;
  const time = pack.overview.estimatedStudyTimeMinutes;
  const materials: Array<{ title: string; count: string; icon: IconName; route: string; tone: ToneName }> = [
    { title: 'Flashcards', count: `${pack.flashcards.length} cartes`, icon: 'cards', route: '/flashcards', tone: 'purple' },
    { title: 'Quiz à choix multiples', count: `${pack.multipleChoiceQuiz.length} questions`, icon: 'quiz', route: '/quiz', tone: 'blue' },
    { title: 'Glossaire', count: `${pack.glossary.length} termes`, icon: 'glossary', route: '/glossary', tone: 'green' },
    { title: 'Rappel actif', count: `${pack.activeRecallQuestions.length} questions`, icon: 'recall', route: '/recall', tone: 'amber' },
    { title: 'Préparation aux examens', count: `${pack.examQuestions.length} sujets`, icon: 'exam', route: '/exam-practice', tone: 'purple' },
  ];
  return <Page back>
    <Heading eyebrow="Ton pack de révision" title={pack.overview.title || 'Ton pack de révision'} />
    <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
      <Pill>GÉNÉRÉ PAR L’IA</Pill>
      {time ? <Pill tone="green">~{time} MIN</Pill> : null}
    </View>
    <Button title="Commencer les flashcards" onPress={() => router.push('/flashcards')} />
    <Card>
      <Text style={[type.label, { color: c.primary }]}>VUE D’ENSEMBLE</Text>
      <Text style={[type.body, { color: c.ink }]}>{pack.overview.summary}</Text>
    </Card>
    <View style={{ gap: space.md }}>
      <SectionTitle title="Les points à retenir" />
      {pack.overview.keyTakeaways.map((t, i) => <View key={`${i}-${t}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.md }}>
        <IconBadge icon="check" tone="green" size={28} />
        <Text style={[type.body, { color: c.ink, flex: 1 }]}>{t}</Text>
      </View>)}
    </View>
    <View style={{ gap: space.md }}>
      <SectionTitle title="Explore tes supports" />
      {materials.map((m) => <ListItem key={m.title} icon={m.icon} tone={m.tone} title={m.title} subtitle={m.count} onPress={() => router.push(m.route as never)} />)}
    </View>
    <Card tinted>
      <Text style={[type.heading, { color: c.ink }]}>Curieux d’en savoir plus ?</Text>
      <Text style={[type.body, { color: c.muted }]}>Utilise les pistes de l’IA pour explorer une question et générer un nouveau support.</Text>
      <Button title="Approfondir avec l'IA" variant="secondary" onPress={() => router.push('/tutor')} />
    </Card>
    <Button title="Organiser ma session de révision" variant="quiet" onPress={() => router.push('/revision')} />
  </Page>;
}
