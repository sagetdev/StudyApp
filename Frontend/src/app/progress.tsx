import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';
import { getRevisionSessions, type RevisionSession } from '@/lib/revision-progress';

export default function ProgressScreen() {
  useThemeMode();
  const [sessions, setSessions] = useState<RevisionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => {
    let active = true;
    void getRevisionSessions().then((items) => { if (active) setSessions(items); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useFocusEffect(refresh);
  const completed = sessions.length;
  const average = sessions.length ? Math.round(sessions.reduce((sum, item) => sum + (item.quizTotal ? item.quizCorrect / item.quizTotal * 100 : 0), 0) / sessions.length) : 0;
  const recent = sessions[0];
  return <Page>
    <Heading eyebrow="Ton évolution" title="Chaque session compte." subtitle="Tes sessions terminées et tes résultats récents, réunis au même endroit." />
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}><Card style={{ padding: 14, minHeight: 112, justifyContent: 'space-between' }}><Text style={{ color: C.muted, fontSize: 11, fontWeight: '700' }}>SESSIONS FINIES</Text><Text style={{ color: C.ink, fontSize: 30, fontWeight: '900' }}>{completed}</Text><Text style={{ color: C.muted, fontSize: 11 }}>parcours complétés</Text></Card></View>
      <View style={{ flex: 1 }}><Card style={{ padding: 14, minHeight: 112, justifyContent: 'space-between' }}><Text style={{ color: C.muted, fontSize: 11, fontWeight: '700' }}>SCORE MOYEN</Text><Text style={{ color: C.primary, fontSize: 30, fontWeight: '900' }}>{completed ? average + '%' : '—'}</Text><Text style={{ color: C.muted, fontSize: 11 }}>sur les quiz terminés</Text></Card></View>
    </View>
    {recent ? <Card style={{ backgroundColor: C.primarySoft, borderColor: C.primarySoft }}>
      <Pill tone="green">DERNIÈRE SESSION</Pill>
      <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>{recent.courseTitle}</Text>
      <Text style={{ color: C.muted, fontSize: 12 }}>{new Date(recent.completedAt).toLocaleDateString()} · {recent.flashcardsReviewed} flashcards · {recent.recallQuestions} questions de rappel</Text>
      {recent.quizTotal ? <Text style={{ color: C.primary, fontSize: 14, fontWeight: '800' }}>Quiz : {recent.quizCorrect}/{recent.quizTotal} ({Math.round(recent.quizCorrect / recent.quizTotal * 100)}%)</Text> : null}
    </Card> : <Card style={{ alignItems: 'center', paddingVertical: 24, gap: 10 }}>
      <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 28, fontWeight: '800' }}>✦</Text></View>
      <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800', textAlign: 'center' }}>{loading ? 'Chargement de ta progression…' : 'Ta progression commence ici'}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' }}>Termine les quatre étapes d'un parcours pour enregistrer ta première session et suivre tes résultats.</Text>
    </Card>}
    <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Historique des sessions</Text>
    {sessions.length ? sessions.map((item) => <Card key={item.id} style={{ padding: 14, gap: 7 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.green, fontWeight: '900' }}>✓</Text></View>
        <View style={{ flex: 1, gap: 3 }}><Text style={{ color: C.ink, fontWeight: '800', fontSize: 14 }}>{item.courseTitle}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{new Date(item.completedAt).toLocaleDateString()} · {item.examQuestions} sujets d'examen</Text></View>
        {item.quizTotal ? <Pill tone={item.quizCorrect / item.quizTotal >= 0.7 ? 'green' : 'amber'}>{Math.round(item.quizCorrect / item.quizTotal * 100)}%</Pill> : null}
      </View>
    </Card>) : null}
    <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17 }}>La progression est actuellement enregistrée sur cet appareil. La synchronisation de l'historique entre appareils nécessitera un endpoint dédié côté backend.</Text>
    <Button title="Lancer une autre révision" onPress={() => router.replace('/(tabs)')} />
    <Button title="Voir mes cours" variant="secondary" onPress={() => router.push('/library')} />
  </Page>;
}
