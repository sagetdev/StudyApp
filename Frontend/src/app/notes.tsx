import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Button, C, Card, Field, Heading, Page, Pill } from '@/components/study-ui';
import { deleteNote, getNotes, saveNote, type StudyNote } from '@/lib/local-storage';

export default function NotesScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => { setNotes(await getNotes()); }, []);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const save = async () => {
    if (!title.trim() || !body.trim()) { setError('Ajoute un titre et le contenu de ta note.'); return; }
    setBusy(true);
    try {
      await saveNote(title.trim(), body.trim());
      setTitle(''); setBody(''); setError('');
      await refresh();
    } catch { setError('Impossible d’enregistrer la note sur cet appareil. Réessaie.'); }
    finally { setBusy(false); }
  };

  const remove = (note: StudyNote) => Alert.alert('Supprimer la note ?', note.title, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteNote(note.id); await refresh(); } },
  ]);

  return <Page>
    <Heading eyebrow="Espace personnel" title="Mes notes" subtitle="Tes notes sont enregistrées sur cet appareil et restent disponibles après fermeture de l'application." />
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
    </Card>) : <Card style={{ alignItems: 'center', paddingVertical: 24 }}><Text style={{ color: C.primary, fontSize: 24, fontWeight: '800' }}>✎</Text><Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Pas encore de notes</Text><Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', lineHeight: 19 }}>Ajoute une note ci-dessus pour la retrouver ici plus tard.</Text></Card>}
  </Page>;
}
