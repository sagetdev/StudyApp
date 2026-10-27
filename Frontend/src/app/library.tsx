import React, { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { Button, Card, EmptyState, ErrorText, Heading, Page, Pill } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { listStudyPacks, removeStudyPack, type SavedStudyPack } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { setCurrentStudyPack } from '@/lib/study-pack-store';

export default function LibraryScreen() {
  const c = useColors();
  const { session } = useAuth();
  const token = session?.token;
  const [packs, setPacks] = useState<SavedStudyPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!token) { setPacks([]); setLoading(false); return; }
    setLoading(true); setError('');
    try { setPacks(await listStudyPacks(token)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de charger les cours.'); }
    finally { setLoading(false); }
  }, [token]);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const openPack = async (item: SavedStudyPack) => { await setCurrentStudyPack(item.content); router.push('/study-pack'); };

  const removePack = (item: SavedStudyPack) => Alert.alert('Supprimer ce cours ?', `« ${item.title} » sera supprimé de ton compte.`, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => {
      if (!session?.token) return;
      try { await removeStudyPack(item.id, session.token); await refresh(); }
      catch (e) { setError(e instanceof Error ? e.message : 'Impossible de supprimer ce cours.'); }
    } },
  ]);

  return <Page back>
    <Heading eyebrow="Bibliothèque" title="Mes cours" subtitle="Tes cours sont enregistrés sur ton compte." />
    {!loading && packs.length ? <Pill>{packs.length} COURS</Pill> : null}
    {error ? <Card><ErrorText>{error}</ErrorText><Button title="Réessayer" variant="secondary" onPress={() => void refresh()} /></Card> : null}
    {loading ? <View style={{ paddingVertical: space.xl }}><ActivityIndicator color={c.primary} /></View>
      : packs.length ? packs.map((item) => <Card key={item.id}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Ouvrir le cours ${item.title}`} onPress={() => void openPack(item)} style={({ pressed }) => ({ gap: space.sm, opacity: pressed ? 0.7 : 1 })}>
          <Text style={[type.heading, { color: c.ink }]}>{item.title}</Text>
          <Text numberOfLines={3} style={[type.body, { color: c.muted }]}>{item.content.overview.summary}</Text>
          <Text style={[type.caption, { color: c.faint }]}>{new Date(item.createdAt).toLocaleDateString('fr-FR')} · {item.content.flashcards.length} flashcards · {item.content.multipleChoiceQuiz.length} questions</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <View style={{ flex: 2 }}><Button title="Ouvrir" onPress={() => void openPack(item)} /></View>
          <View style={{ flex: 1 }}><Button title="Supprimer" variant="danger" onPress={() => removePack(item)} /></View>
        </View>
      </Card>)
      : !error ? <EmptyState icon="book" title="Ta bibliothèque est vide" text="Génère un pack pour le retrouver ici." action={<Button title="Créer mon premier cours" onPress={() => router.replace('/(tabs)')} />} /> : null}
  </Page>;
}
