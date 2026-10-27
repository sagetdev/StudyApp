import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { getCurrentStudyPack } from '@/lib/study-pack-store';

export default function GlossaryScreen() {
  const pack = getCurrentStudyPack();
  if (!pack) return <Page><Heading title="Glossaire" subtitle="Génère un pack pour afficher les définitions." /><Button title="Accueil" onPress={() => router.replace('/(tabs)')} /></Page>;
  return <Page>
    <Heading eyebrow="Ton pack" title="Glossaire" subtitle="Les concepts importants, expliqués simplement." />
    <Pill>{pack.glossary.length} TERMES</Pill>
    {pack.glossary.map((item, index) => <Card key={`${item.term}-${index}`}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={{ backgroundColor: C.primarySoft, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 }}><Text style={{ color: C.primary, fontWeight: '800' }}>Aa</Text></View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>{item.term}</Text>
          <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>{item.definition}</Text>
        </View>
      </View>
    </Card>)}
  </Page>;
}
