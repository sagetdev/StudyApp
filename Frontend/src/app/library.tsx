import React, { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button, C, Card, Heading, Page, Pill } from '@/components/study-ui';
import { deleteSavedPack, getSavedPacks, type SavedStudyPack } from '@/lib/local-storage';
import { setCurrentStudyPack } from '@/lib/study-pack-store';

export default function LibraryScreen() {
  const [packs, setPacks] = useState<SavedStudyPack[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setPacks(await getSavedPacks()); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const openPack = async (item: SavedStudyPack) => {
    await setCurrentStudyPack(item.pack);
    router.push('/study-pack');
  };

  const removePack = (item: SavedStudyPack) => {
    Alert.alert('Supprimer ce cours ?', `« ${item.title} » sera retiré de la bibliothèque de cet appareil.`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteSavedPack(item.id); await refresh(); } },
    ]);
  };

  return <Page>
    <Heading eyebrow="Bibliothèque personnelle" title="Mes cours enregistrés" subtitle="Tes packs restent disponibles sur cet appareil, même après avoir fermé StudyApp." />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Tous mes cours</Text>
      <Pill>{packs.length} COURS</Pill>
    </View>
    {loading ? <Card><Text style={{ color: C.muted }}>Chargement de ta bibliothèque…</Text></Card> : packs.length ? packs.map((item) => (
      <Card key={item.id} style={{ gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={() => void openPack(item)} style={{ gap: 8 }}>
          <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>{item.title}</Text>
          <Text numberOfLines={3} style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>{item.pack.overview.summary}</Text>
          <Text style={{ color: C.muted, fontSize: 11 }}>{new Date(item.createdAt).toLocaleDateString()} · {item.pack.flashcards.length} flashcards · {item.pack.multipleChoiceQuiz.length} questions</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}><Button title="Ouvrir le cours" onPress={() => void openPack(item)} /></View>
          <View style={{ flex: 1 }}><Button title="Supprimer" variant="secondary" onPress={() => removePack(item)} /></View>
        </View>
      </Card>
    )) : <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 26 }}>
      <Text style={{ color: C.primary, fontSize: 28 }}>▤</Text>
      <Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Ta bibliothèque est vide</Text>
      <Text style={{ color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>Génère un pack à partir de tes notes ou d'un sujet. Il sera automatiquement enregistré ici.</Text>
      <Button title="Créer mon premier cours" onPress={() => router.replace('/(tabs)')} />
    </Card>}
    <Button title="Retour à l'accueil" variant="secondary" onPress={() => router.replace('/(tabs)')} />
  </Page>;
}
