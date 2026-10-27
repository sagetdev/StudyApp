import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';

export default function RankingScreen() {
  return <Page>
    <Heading eyebrow="Communauté" title="Le classement" subtitle="Célèbre tes efforts et découvre ta progression parmi les apprenants." />
    <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
      <View style={{ width: 76, height: 76, borderRadius: 26, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 32 }}>♛</Text></View>
      <Pill tone="amber">CLASSEMENT EN PRÉPARATION</Pill>
      <Text style={{ color: C.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' }}>Le prochain défi commence avec toi.</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' }}>Le backend ne propose pas encore d'API de scores ou de classement. Aucun rang ni score fictif n'est affiché.</Text>
    </Card>
    <Button title="Créer un pack de révision" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
