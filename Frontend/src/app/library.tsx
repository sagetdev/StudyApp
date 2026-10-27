import React, { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill, useThemeMode } from '@/components/study-ui';
import { listStudyPacks, removeStudyPack, type SavedStudyPack } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { setCurrentStudyPack } from '@/lib/study-pack-store';

export default function LibraryScreen() {
  useThemeMode();
  const { session } = useAuth();
  const [packs, setPacks] = useState<SavedStudyPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!session?.token) { setPacks([]); setLoading(false); return; }
    setLoading(true); setError('');
    try { setPacks(await listStudyPacks(session.token)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de charger les cours.'); }
    finally { setLoading(false); }
  }, [session?.token]);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const openPack = async (item: SavedStudyPack) => {
    await setCurrentStudyPack(item.content);
    router.push('/study-pack');
  };

  const removePack = (item: SavedStudyPack) => Alert.alert('Supprimer ce cours ?', `« ${item.title} » sera supprimé de ton compte.`, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => {
      if (!session?.token) return;
      try { await removeStudyPack(item.id, session.token); await refresh(); }
      catch (e) { setError(e instanceof Error ? e.message : 'Impossible de supprimer ce cours.'); }
    } },
  ]);

  return <Page>
    <Heading eyebrow="Bibliothèque personnelle" title="Mes cours enregistrés" subtitle="Tes cours sont stockés dans ton compte et suivent ta connexion sur tes appareils." />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Tous mes cours</Text>
      <Pill>{packs.length} COURS</Pill>
    </View>
    {error ? <Card><Text style={{ color: C.danger, fontSize: 13 }}>{error}</Text><Button title="Réessayer" onPress={() => void refresh()} variant="secondary" /></Card> : null}
    {loading ? <Card><Text style={{ color: C.muted }}>Chargement depuis la base de données…</Text></Card> : packs.length ? packs.map((item) => (
      <Card key={item.id} style={{ gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={() => void openPack(item)} style={{ gap: 8 }}>
          <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>{item.title}</Text>
          <Text numberOfLines={3} style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>{item.content.overview.summary}</Text>
          <Text style={{ color: C.muted, fontSize: 11 }}>{new Date(item.createdAt).toLocaleDateString()} · {item.content.flashcards.length} flashcards · {item.content.multipleChoiceQuiz.length} questions</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}><Button title="Ouvrir le cours" onPress={() => void openPack(item)} /></View>
          <View style={{ flex: 1 }}><Button title="Supprimer" variant="secondary" onPress={() => removePack(item)} /></View>
        </View>
      </Card>
    )) : !loading && !error ? <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 26 }}>
      <Text style={{ color: C.primary, fontSize: 28 }}>▤</Text>
      <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Ta bibliothèque est vide</Text>
      <Text style={{ color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>Génère un pack pour le sauvegarder dans ton compte.</Text>
      <Button title="Créer mon premier cours" onPress={() => router.replace('/(tabs)')} />
    </Card> : null}
    <Button title="Retour à l'accueil" variant="secondary" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
