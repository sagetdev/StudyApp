import React, { useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Button, Card, ErrorText, Field, Heading, Page } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const c = useColors();
  const { session, loading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <Page><Text style={[type.body, { color: c.muted }]}>Chargement…</Text></Page>;
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

  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Page style={{ justifyContent: 'center', gap: space.xl }}>
      <Heading eyebrow="StudyApp" title="Ton prochain chapitre commence ici." subtitle="Crée ton compte et prépare ton premier pack de révision." />
      <Card>
        <Field label="Adresse email" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
        <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="8 caractères minimum" secureTextEntry autoComplete="new-password" textContentType="newPassword" returnKeyType="next" />
        <Field label="Confirmer le mot de passe" value={confirm} onChangeText={setConfirm} placeholder="Retape ton mot de passe" secureTextEntry textContentType="newPassword" returnKeyType="go" onSubmitEditing={submit} />
        <ErrorText>{error}</ErrorText>
        <Button title="Créer mon compte" onPress={submit} loading={busy} />
      </Card>
      <Text style={[type.body, { textAlign: 'center', color: c.muted }]}>Déjà inscrit·e ? <Link href="/login" style={{ color: c.primary, fontWeight: '700' }}>Se connecter</Link></Text>
    </Page>
  </KeyboardAvoidingView>;
}
