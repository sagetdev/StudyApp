import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, C, Card, Field, Heading, Page, Pill } from '@/components/study-ui';

export default function NotesScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notes, setNotes] = useState<Array<{ title: string; body: string }>>([]);
  const [error, setError] = useState('');
  const save = () => {
    if (!title.trim() || !body.trim()) { setError('Ajoute un titre et le contenu de ta note.'); return; }
    setNotes([{ title: title.trim(), body: body.trim() }, ...notes]);
    setTitle(''); setBody(''); setError('');
  };
  return <Page>
    <Heading eyebrow="Espace personnel" title="Mes notes" subtitle="Capture les idées importantes pendant tes révisions." />
    <Card>
      <Field label="Titre de la note" value={title} onChangeText={setTitle} placeholder="Ex. : À retenir sur le chapitre 2" />
      <Field label="Contenu" value={body} onChangeText={setBody} placeholder="Écris les notions importantes…" multiline numberOfLines={4} />
      {error ? <Text style={{ color: C.danger, fontSize: 12 }}>{error}</Text> : null}
      <Button title="Ajouter la note" onPress={save} />
      <Text style={{ color: C.muted, fontSize: 11, lineHeight: 16 }}>Les notes sont conservées uniquement tant que cet écran reste ouvert. La synchronisation nécessite une API backend dédiée.</Text>
    </Card>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ color: C.ink, fontSize: 16, fontWeight: '800' }}>Notes récentes</Text><Pill>{notes.length} NOTE{notes.length === 1 ? '' : 'S'}</Pill></View>
    {notes.length ? notes.map((note, i) => <Card key={`${note.title}-${i}`}><Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>{note.title}</Text><Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>{note.body}</Text></Card>) : <Card style={{ alignItems: 'center', paddingVertical: 24 }}><Text style={{ color: C.primary, fontSize: 24, fontWeight: '800' }}>✎</Text><Text style={{ color: C.ink, fontSize: 15, fontWeight: '800' }}>Pas encore de notes</Text><Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', lineHeight: 19 }}>Tes idées importantes apparaîtront ici pendant cette session.</Text></Card>}
  </Page>;
}
