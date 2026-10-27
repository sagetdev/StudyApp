import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, SectionTitle } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function StudyPackScreen() {
  const pack = getCurrentStudyPack();
  if (!pack) return <Page><Heading title="Aucun pack ouvert" subtitle="Génère un pack depuis l'accueil pour commencer à réviser." /><Button title="Retour à l'accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  const time = pack.overview.estimatedStudyTimeMinutes;
  const materials = [
    { title: 'Glossaire', count: `${pack.glossary.length} termes`, icon: 'Aa', route: '/glossary', tone: C.primarySoft, color: C.primary },
    { title: 'Flashcards', count: `${pack.flashcards.length} cartes`, icon: '▤', route: '/flashcards', tone: C.mint, color: C.green },
    { title: 'Quiz à choix multiples', count: `${pack.multipleChoiceQuiz.length} questions`, icon: '✓', route: '/quiz', tone: C.blue, color: '#2865A8' },
    { title: 'Rappel actif', count: `${pack.activeRecallQuestions.length} questions`, icon: '↗', route: '/recall', tone: C.amber, color: '#9B6500' },
    { title: 'Préparation aux examens', count: `${pack.examQuestions.length} sujets`, icon: '✎', route: '/exam-practice', tone: '#F2EDFF', color: C.primary },
  ] as const;
  return <Page>
    <View style={{ gap: 6 }}>
      <Text style={{ color: C.primary, fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>PACK GÉNÉRÉ PAR L'IA</Text>
      <Heading title={pack.overview.title || 'Ton pack de révision'} subtitle="Tout ton matériel de révision, organisé au même endroit." />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Pill>✦ IA GÉNÉRATIVE</Pill>
        {time ? <Pill tone="green">◷ ~{time} MIN</Pill> : null}
      </View>
    </View>
    <Card>
      <Text style={{ color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>VUE D'ENSEMBLE DU COURS</Text>
      <Text style={{ color: C.ink, fontSize: 20, lineHeight: 26, fontWeight: '800' }}>{pack.overview.title}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>{pack.overview.summary}</Text>
    </Card>
    <View style={{ gap: 12 }}>
      <SectionTitle title="Les points à retenir" />
      {pack.overview.keyTakeaways.map((takeaway, index) => <View key={`${index}-${takeaway}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11 }}>
        <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.green, fontSize: 12, fontWeight: '900' }}>✓</Text></View>
        <Text style={{ color: C.ink, fontSize: 13, lineHeight: 20, flex: 1 }}>{takeaway}</Text>
      </View>)}
    </View>
    <View style={{ gap: 12 }}>
      <SectionTitle title="Explore tes supports" />
      {materials.map((item) => <Card key={item.title} style={{ padding: 13 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: item.tone, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: item.color, fontSize: 18, fontWeight: '800' }}>{item.icon}</Text></View>
          <View style={{ flex: 1, gap: 3 }}><Text style={{ color: C.ink, fontSize: 13, fontWeight: '800' }}>{item.title}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{item.count}</Text></View>
          <Text onPress={() => router.push(item.route as any)} style={{ color: C.muted, fontSize: 24, paddingHorizontal: 6 }}>›</Text>
        </View>
      </Card>)}
    </View>
    <Card style={{ backgroundColor: '#F0ECFF', borderColor: '#E8E0FF' }}>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Curieux d'en savoir plus ?</Text>
      <Text style={{ color: C.muted, fontSize: 12, lineHeight: 19 }}>Utilise les pistes de l'IA pour explorer une question et générer un nouveau support d'étude.</Text>
      <Button title="Approfondir avec l'IA →" variant="secondary" onPress={() => router.push('/tutor')} />
    </Card>
    <Button title="Organiser ma session de révision" variant="secondary" onPress={() => router.push('/revision')} />
    <Button title="Commencer les flashcards" onPress={() => router.push('/flashcards')} />
    <Button title="Retour à l'accueil" variant="quiet" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
