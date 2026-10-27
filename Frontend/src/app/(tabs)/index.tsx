import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, ErrorText, Field, IconBadge, ListItem, Page, SectionTitle } from '@/components/study-ui';
import type { IconName } from '@/components/icon';
import { space, type, type ToneName } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';
import { generateStudyPack, createStudyPack } from '@/lib/api';
import { setCurrentStudyPack } from '@/lib/study-pack-store';

const suggestions: Array<{ icon: IconName; tone: ToneName; title: string; prompt: string }> = [
  { icon: 'science', tone: 'purple', title: 'Sciences', prompt: 'Explique les bases de la biologie cellulaire avec des exemples.' },
  { icon: 'math', tone: 'blue', title: 'Mathématiques', prompt: 'Crée un pack de révision sur les équations du second degré.' },
  { icon: 'history', tone: 'green', title: 'Histoire', prompt: 'Prépare un pack de révision sur les grandes étapes de la Révolution française.' },
];

export default function HomeScreen() {
  const c = useColors();
  const { session } = useAuth();
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const name = session?.user.email.split('@')[0] || 'toi';

  const createPack = async () => {
    if (!session?.token) { router.replace('/login'); return; }
    if (course.trim().length < 10) { setError('Ajoute un sujet ou colle un extrait de cours (10 caractères minimum).'); return; }
    setError(''); setBusy(true);
    try {
      const pack = await generateStudyPack(course.trim(), session.token);
      await createStudyPack(pack, course.trim(), session.token);
      await setCurrentStudyPack(pack);
      router.push('/study-pack');
    } catch (e) { setError(e instanceof Error ? e.message : 'La génération a échoué. Réessaie.'); }
    finally { setBusy(false); }
  };

  return <Page>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.caption, { color: c.muted }]}>Bonjour,</Text>
        <Text numberOfLines={1} style={[type.title, { color: c.ink }]}>{name}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir le profil" onPress={() => router.push('/(tabs)/profile')}
        style={({ pressed }) => ({ width: 48, height: 48, borderRadius: 24, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}>
        <Text style={[type.heading, { color: c.primary }]}>{(session?.user.email[0] || 'S').toUpperCase()}</Text>
      </Pressable>
    </View>

    <Card tinted style={{ padding: space.xl, gap: space.lg }}>
      <View style={{ gap: space.xs }}>
        <Text style={[type.title, { color: c.ink }]}>Que veux-tu réviser ?</Text>
        <Text style={[type.body, { color: c.muted }]}>Un thème ou un extrait de cours suffit : tu obtiens résumé, flashcards et quiz.</Text>
      </View>
      <Field label="Ton cours ou ton sujet" value={course} onChangeText={(t) => { setCourse(t); if (error) setError(''); }} placeholder="Ex. : la photosynthèse, chapitre 4…" multiline numberOfLines={5} />
      <ErrorText>{error}</ErrorText>
      <Button title="Générer mon pack" onPress={createPack} loading={busy} />
    </Card>

    <View style={{ gap: space.md }}>
      <SectionTitle title="Besoin d'une idée ?" />
      {suggestions.map((item) => <ListItem key={item.title} icon={item.icon} tone={item.tone} title={item.title} subtitle="Utiliser cet exemple" onPress={() => { setCourse(item.prompt); setError(''); }} />)}
    </View>

    <ListItem icon="book" tone="green" title="Mes cours enregistrés" subtitle="Reprendre une révision" onPress={() => router.push('/library')} />
  </Page>;
}
