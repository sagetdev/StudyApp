import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, Pressable } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, SectionTitle, useThemeMode } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function StudyPackScreen() {
  useThemeMode();
  const pack = getCurrentStudyPack();
  const [openPage, setOpenPage] = useState(0);
  if (!pack) return <Page><Heading title="Aucun pack ouvert" subtitle="Génère un pack depuis l'accueil pour commencer à réviser." /><Button title="Retour à l'accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  const time = pack.overview.estimatedStudyTimeMinutes;
  const materials = [
    { title: 'Glossaire', count: pack.glossary.length + ' termes', icon: 'Aa', route: '/glossary', tone: C.primarySoft, color: C.primary },
    { title: 'Flashcards', count: pack.flashcards.length + ' cartes', icon: '▤', route: '/flashcards', tone: C.mint, color: C.green },
    { title: 'Quiz à choix multiples', count: pack.multipleChoiceQuiz.length + ' questions', icon: '✓', route: '/quiz', tone: C.blue, color: '#2865A8' },
    { title: 'Rappel actif', count: pack.activeRecallQuestions.length + ' questions', icon: '↗', route: '/recall', tone: C.amber, color: '#9B6500' },
    { title: 'Préparation aux examens', count: pack.examQuestions.length + ' sujets', icon: '✎', route: '/exam-practice', tone: '#F2EDFF', color: C.primary },
  ] as const;
  return <Page>
    <View style={{ gap: 6 }}>
      <Text style={{ color: C.primary, fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>TON COURS EST PRÊT</Text>
      <Heading title={pack.overview.title || 'Ton pack de révision'} subtitle="Un cours structuré, puis un parcours pour mémoriser et vérifier tes acquis." />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Pill>✦ IA GÉNÉRATIVE</Pill>
        {time ? <Pill tone="green">◷ ~{time} MIN</Pill> : null}
        {pack.coursePages?.length ? <Pill tone="blue">{pack.coursePages.length} PAGES DE COURS</Pill> : null}
      </View>
    </View>
    <Card>
      <Text style={{ color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>VUE D'ENSEMBLE</Text>
      <Text style={{ color: C.ink, fontSize: 20, lineHeight: 26, fontWeight: '800' }}>{pack.overview.title}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>{pack.overview.summary}</Text>
      <Button title="Commencer la révision guidée  →" onPress={() => router.push('/revision')} />
    </Card>
    {pack.coursePages?.length ? <View style={{ gap: 12 }}>
      <SectionTitle title="Le cours, page par page" action={pack.coursePages.length + ' pages'} />
      <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>Lis les notions dans l'ordre. Chaque page présente une explication, des exemples et les idées essentielles.</Text>
      {pack.coursePages.map((page, index) => {
        const expanded = openPage === index;
        return <Card key={index} style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setOpenPage(expanded ? -1 : index)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontWeight: '800' }}>{String(index + 1).padStart(2, '0')}</Text></View>
            <View style={{ flex: 1, gap: 3 }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: '800' }}>{page.title}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{page.keyPoints.length} points clés · {page.examples.length} exemples</Text></View>
            <Text style={{ color: C.primary, fontSize: 22 }}>{expanded ? '−' : '+'}</Text>
          </Pressable>
          {expanded ? <View style={{ paddingHorizontal: 16, paddingBottom: 17, gap: 14 }}>
            <Text style={{ color: C.ink, fontSize: 14, lineHeight: 23 }}>{page.content}</Text>
            {page.examples.length ? <View style={{ gap: 7 }}><Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 }}>EXEMPLES</Text>{page.examples.map((example, i) => <View key={i} style={{ borderLeftWidth: 3, borderLeftColor: C.primary, paddingLeft: 11 }}><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>{example}</Text></View>)}</View> : null}
            {page.keyPoints.length ? <View style={{ gap: 8 }}><Text style={{ color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 }}>À RETENIR</Text>{page.keyPoints.map((point, i) => <View key={i} style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}><Text style={{ color: C.green, fontWeight: '900' }}>✓</Text><Text style={{ color: C.ink, fontSize: 13, lineHeight: 20, flex: 1 }}>{point}</Text></View>)}</View> : null}
            {index < pack.coursePages!.length - 1 ? <Button title="Page suivante  →" variant="secondary" onPress={() => setOpenPage(index + 1)} /> : <Pill tone="green">Fin du cours · prêt à réviser</Pill>}
          </View> : null}
        </Card>;
      })}
    </View> : <Card><Text style={{ color: C.ink, fontWeight: '800' }}>Le cours détaillé n'est pas disponible pour ce pack</Text><Text style={{ color: C.muted, fontSize: 12, lineHeight: 19 }}>Les packs déjà enregistrés avant l'ajout des pages restent consultables. Génère un nouveau pack pour obtenir le cours découpé en pages.</Text></Card>}
    <View style={{ gap: 12 }}>
      <SectionTitle title="Les points à retenir" />
      {pack.overview.keyTakeaways.map((takeaway, index) => <View key={index + '-' + takeaway} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11 }}>
        <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.green, fontSize: 12, fontWeight: '900' }}>✓</Text></View>
        <Text style={{ color: C.ink, fontSize: 13, lineHeight: 20, flex: 1 }}>{takeaway}</Text>
      </View>)}
    </View>
    <View style={{ gap: 12 }}>
      <SectionTitle title="Tes supports de révision" />
      {materials.map((item) => <Card key={item.title} style={{ padding: 13 }}>
        <Pressable accessibilityRole="button" onPress={() => router.push(item.route as any)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: item.tone, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: item.color, fontSize: 18, fontWeight: '800' }}>{item.icon}</Text></View>
          <View style={{ flex: 1, gap: 3 }}><Text style={{ color: C.ink, fontSize: 13, fontWeight: '800' }}>{item.title}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{item.count}</Text></View>
          <Text style={{ color: C.primary, fontSize: 24, paddingHorizontal: 6 }}>›</Text>
        </Pressable>
      </Card>)}
    </View>
    <Card style={{ backgroundColor: C.primarySoft, borderColor: C.primarySoft }}>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Besoin d'aller plus loin ?</Text>
      <Text style={{ color: C.muted, fontSize: 12, lineHeight: 19 }}>Approfondis une notion avec les suggestions de l'assistant IA.</Text>
      <Button title="Approfondir avec l'IA →" variant="secondary" onPress={() => router.push('/tutor')} />
    </Card>
    <Button title="Commencer la révision guidée" onPress={() => router.push('/revision')} />
    <Button title="Retour à l'accueil" variant="quiet" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
