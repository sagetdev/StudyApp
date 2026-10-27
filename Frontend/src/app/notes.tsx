import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Button, Card, EmptyState, ErrorText, Field, Heading, Page, Pill, SectionTitle } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { createNote, listNotes, removeNote, type StudyNote } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function NotesScreen() {
  const c = useColors();
  const { session } = useAuth();
  const token = session?.token;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) { setNotes([]); return; }
    try { setNotes(await listNotes(token)); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de charger les notes.'); }
  }, [token]);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const save = async () => {
    if (!session?.token) { setError('Connecte-toi pour enregistrer tes notes.'); return; }
    if (!title.trim() || !body.trim()) { setError('Ajoute un titre et le contenu de ta note.'); return; }
    setBusy(true);
    try { await createNote(title.trim(), body.trim(), session.token); setTitle(''); setBody(''); setError(''); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Impossible d'enregistrer la note."); }
    finally { setBusy(false); }
  };

  const remove = (note: StudyNote) => Alert.alert('Supprimer la note ?', note.title, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => {
      if (!session?.token) return;
      try { await removeNote(note.id, session.token); await refresh(); }
      catch (e) { setError(e instanceof Error ? e.message : 'Impossible de supprimer la note.'); }
    } },
  ]);

  return <Page back>
    <Heading eyebrow="Espace personnel" title="Mes notes" subtitle="Synchronisées avec ton compte sur tous tes appareils." />
    <Card>
      <Field label="Titre de la note" value={title} onChangeText={setTitle} placeholder="Ex. : À retenir sur le chapitre 2" returnKeyType="next" />
      <Field label="Contenu" value={body} onChangeText={setBody} placeholder="Écris les notions importantes…" multiline numberOfLines={4} style={{ minHeight: 110 }} />
      <ErrorText>{error}</ErrorText>
      <Button title="Enregistrer la note" onPress={() => void save()} loading={busy} />
    </Card>
    <SectionTitle title="Notes enregistrées" right={<Pill>{notes.length} NOTE{notes.length > 1 ? 'S' : ''}</Pill>} />
    {notes.length ? notes.map((note) => <Card key={note.id}>
      <Text style={[type.heading, { color: c.ink }]}>{note.title}</Text>
      <Text style={[type.body, { color: c.muted }]}>{note.body}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md }}>
        <Text style={[type.caption, { color: c.faint }]}>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</Text>
        <View style={{ minWidth: 130 }}><Button title="Supprimer" variant="danger" onPress={() => remove(note)} /></View>
      </View>
    </Card>) : <EmptyState icon="notes" title="Pas encore de notes" text="Ajoute une note ci-dessus pour la retrouver partout." />}
  </Page>;
}
