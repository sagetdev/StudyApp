import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';

export default function ProgressScreen() {
  useThemeMode();
  return <Page>
    <Heading eyebrow="Ton évolution" title="Chaque session compte." subtitle="Un espace pensé pour visualiser tes habitudes et tes progrès au fil du temps." />
    <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
      <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.primary, fontSize: 31, fontWeight: '800' }}>↗</Text></View>
      <Pill>BIENTÔT DISPONIBLE</Pill>
      <Text style={{ color: C.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' }}>Ton tableau de progression</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' }}>Les données de sessions, scores et historique ne sont pas encore enregistrées par le backend. Cette page sera alimentée lorsque ces endpoints seront disponibles.</Text>
    </Card>
    <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Ce que tu pourras suivre</Text>
    {['Temps de révision par semaine', 'Précision aux quiz et évolution des scores', 'Notions à revoir en priorité'].map((item, i) => <Card key={item} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
      <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: [C.mint, C.blue, C.amber][i], alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.ink, fontWeight: '800' }}>{i + 1}</Text></View><Text style={{ color: C.ink, fontSize: 13, fontWeight: '600', flex: 1 }}>{item}</Text>
    </Card>)}
    <Button title="Lancer une révision" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
