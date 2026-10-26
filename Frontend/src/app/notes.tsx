import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Button, C, Card, Field, Heading, Page, Pill } from '@/components/study-ui';
import { createNote, listNotes, removeNote, type StudyNote } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function NotesScreen() {
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.token) { setNotes([]); return; }
    try { setNotes(await listNotes(session.token)); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de charger les notes.'); }
  }, [session?.token]);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const save = async () => {
    if (!session?.token) { setError('Connecte-toi pour enregistrer tes notes.'); return; }
    if (!title.trim() || !body.trim()) { setError('Ajoute un titre et le contenu de ta note.'); return; }
    setBusy(true);
    try {
      await createNote(title.trim(), body.trim(), session.token);
      setTitle(''); setBody(''); setError('');
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Impossible d’enregistrer la note.'); }
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

  return <Page>
    <Heading eyebrow="Espace personnel" title="Mes notes" subtitle="Tes notes sont enregistrées dans la base de données de ton compte et disponibles sur tes appareils." />
    <Card>
      <Field label="Titre de la note" value={title} onChangeText={setTitle} placeholder="Ex. : À retenir sur le chapitre 2" />
      <Field label="Contenu" value={body} onChangeText={setBody} placeholder="Écris les notions importantes…" multiline numberOfLines={4} />
      {error ? <Text style={{ color: C.danger, fontSize: 12 }}>{error}</Text> : null}
      <Button title="Enregistrer la note" onPress={() => void save()} loading={busy} />
    </Card>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Notes enregistrées</Text><Pill>{notes.length} NOTE{notes.length === 1 ? '' : 'S'}</Pill></View>
    {notes.length ? notes.map((note) => <Card key={note.id} style={{ gap: 8 }}>
      <Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>{note.title}</Text>
      <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>{note.body}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: C.muted, fontSize: 10 }}>{new Date(note.createdAt).toLocaleDateString()}</Text>
        <Button title="Supprimer" variant="secondary" onPress={() => remove(note)} />
      </View>
    </Card>) : <Card style={{ alignItems: 'center', paddingVertical: 24 }}><Text style={{ color: C.primary, fontSize: 24, fontWeight: '800' }}>✎</Text><Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Pas encore de notes</Text><Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', lineHeight: 19 }}>Ajoute une note ci-dessus pour la retrouver sur tous tes appareils.</Text></Card>}
  </Page>;
}
