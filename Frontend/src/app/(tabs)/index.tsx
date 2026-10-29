import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Button, C, Card, Field, Heading, Page, Pill, SectionTitle, uiStyles, useThemeMode } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';
import { generateStudyPack, createStudyPack } from '@/lib/api';
import { setCurrentStudyPack } from '@/lib/study-pack-store';

const suggestions = [
  { icon: '⌁', title: 'Sciences', prompt: 'Explique les bases de la biologie cellulaire avec des exemples.' },
  { icon: '∑', title: 'Mathématiques', prompt: 'Crée un pack de révision sur les équations du second degré.' },
  { icon: '◷', title: 'Histoire', prompt: 'Prépare un pack de révision sur les grandes étapes de la Révolution française.' },
];

export default function HomeScreen() {
  useThemeMode();
  const { width: screenWidth } = useWindowDimensions();
  const wideLayout = screenWidth >= 1050;
  const extraWideLayout = screenWidth >= 1400;
  const { session } = useAuth();
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const createPack = async (text = course) => {
    if (!session?.token) { router.replace('/login'); return; }
    if (text.trim().length < 10) { setError('Ajoute un sujet ou colle un extrait de cours (10 caractères minimum).'); return; }
    setError(''); setBusy(true);
    try {
      const pack = await generateStudyPack(text.trim(), session.token);
      await createStudyPack(pack, text.trim(), session.token);
      await setCurrentStudyPack(pack);
      router.push('/study-pack');
    } catch (e) { setError(e instanceof Error ? e.message : 'La génération a échoué. Réessaie.'); }
    finally { setBusy(false); }
  };

  return <Page>
    <View style={uiStyles.spread}>
      <View style={{ gap: 4, flex: 1 }}>
        <Text style={{ color: C.primary, fontWeight: '800', letterSpacing: 1, fontSize: 11 }}>STUDYAPP</Text>
        <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>Salut, {session?.user.email.split('@')[0] || 'toi'} 👋</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir le profil" onPress={() => router.push('/(tabs)/profile')} style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.primary, fontSize: 19, fontWeight: '800' }}>{(session?.user.email[0] || 'S').toUpperCase()}</Text>
      </Pressable>
    </View>

    <View style={{ backgroundColor: C.primary, borderRadius: 24, padding: 22, gap: 12, overflow: 'hidden' }}>
      <Pill tone="green">TON ESPACE D'APPRENTISSAGE</Pill>
      <Text style={{ color: '#FFFFFF', fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.6 }}>Comprends mieux.{"\n"}Retiens plus longtemps.</Text>
      <Text style={{ color: '#E6E1FF', fontSize: 14, lineHeight: 21 }}>Transforme tes notes en cours détaillé, exemples guidés, images de référence existantes, flashcards et quiz.</Text>
      <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>✦  Un seul cours, plusieurs façons de réviser</Text>
      </View>
    </View>

    <View style={{ flexDirection: wideLayout ? 'row' : 'column', alignItems: 'stretch', gap: 20 }}>
      <View style={{ flex: wideLayout ? (extraWideLayout ? 1 : 0.95) : undefined, minWidth: 0, gap: 12 }}>
        <Heading eyebrow="Commencer" title="Crée ton pack de révision" subtitle="Saisis un thème ou colle tes notes. Tu peux aussi inclure des URL directes d’images de référence déjà existantes dans ton contenu : elles seront affichées dans les pages si elles sont fournies et exploitables. Chaque pack est enregistré dans ton compte." />
        <Card>
          <Field label="Ton cours ou ton sujet" value={course} onChangeText={setCourse} placeholder={"Ex. : la photosynthèse, chapitre 4…\n\nColle ici tes notes et, si tu en as, les URL d’images de référence existantes avec leur source."} multiline numberOfLines={7} />
          {error ? <Text accessibilityRole="alert" style={{ color: C.danger, fontSize: 12, lineHeight: 18 }}>{error}</Text> : null}
          <Button title="Générer mon pack  →" onPress={() => createPack()} loading={busy} />
          <Button title="Ouvrir mes cours enregistrés" variant="secondary" onPress={() => router.push('/library')} />
          <Text style={{ color: C.muted, fontSize: 11, lineHeight: 16 }}>Tes cours sont synchronisés avec ton compte. La génération IA nécessite une connexion au serveur.</Text>
        </Card>
      </View>

      <View style={{ flex: wideLayout ? (extraWideLayout ? 1 : 1.05) : undefined, minWidth: 0, gap: 12 }}>
        <SectionTitle title="Besoin d'une idée ?" action="Exemples" />
        <View style={{ flexDirection: wideLayout ? 'column' : 'row', flexWrap: 'wrap', gap: 14 }}>
          {suggestions.map((item, i) => <Pressable key={item.title} onPress={() => { setCourse(item.prompt); void createPack(item.prompt); }} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, flexGrow: 1, flexBasis: wideLayout ? 'auto' : 245, minWidth: 0 }]}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: wideLayout ? 20 : 14, paddingHorizontal: wideLayout ? 20 : 14, minHeight: wideLayout ? 104 : undefined, height: '100%' }}>
              <View style={{ width: wideLayout ? 58 : 46, height: wideLayout ? 58 : 46, borderRadius: 18, backgroundColor: [C.primarySoft, C.blue, C.mint][i], alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: [C.primary, '#2865A8', C.green][i], fontSize: wideLayout ? 29 : 24, fontWeight: '700' }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: C.ink, fontWeight: '800', fontSize: wideLayout ? 17 : 14 }}>{item.title}</Text>
                <Text style={{ color: C.muted, fontSize: wideLayout ? 14 : 12, lineHeight: wideLayout ? 20 : 16 }}>Générer un exemple de pack</Text>
              </View>
              <Text style={{ color: C.muted, fontSize: wideLayout ? 28 : 22 }}>›</Text>
            </Card>
          </Pressable>)}
        </View>
      </View>
    </View>
  </Page>;
}
