import React, { useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, C, Card, Field, Heading, Page, useThemeMode } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  useThemeMode();
  const { session, loading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <Page><Text style={{ color: C.muted }}>Chargement…</Text></Page>;
  if (session) return <Redirect href="/(tabs)" />;

  const submit = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Tous les champs sont requis.'); return; }
    if (password.length < 8) { setError('Choisis un mot de passe de 8 caractères minimum.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setBusy(true);
    try { await signUp(email, password); router.replace('/(tabs)'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Création du compte impossible.'); }
    finally { setBusy(false); }
  };

  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Page style={{ justifyContent: 'center', paddingTop: 40 }}>
      <View style={{ alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ color: C.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1 }}>STUDYAPP</Text>
        <Heading title="Ton prochain chapitre commence ici." subtitle="Crée ton compte et prépare ton premier pack de révision." />
      </View>
      <Card>
        <Field label="Adresse email" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="8 caractères minimum" secureTextEntry autoComplete="new-password" />
        <Field label="Confirmer le mot de passe" value={confirm} onChangeText={setConfirm} placeholder="Retape ton mot de passe" secureTextEntry onSubmitEditing={submit} />
        {error ? <Text accessibilityRole="alert" style={{ color: C.danger, fontSize: 13, lineHeight: 19 }}>{error}</Text> : null}
        <Button title="Créer mon compte" onPress={submit} loading={busy} />
      </Card>
      <Text style={{ textAlign: 'center', color: C.muted, fontSize: 14 }}>Déjà inscrit·e ? <Link href="/login" style={{ color: C.primary, fontWeight: '800' }}>Se connecter</Link></Text>
    </Page>
  </KeyboardAvoidingView>;
}
