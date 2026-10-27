import React, { useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Card, ErrorText, Field, Heading, Page } from '@/components/study-ui';
import { space, type } from '@/constants/design';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const c = useColors();
  const { session, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <Page><Text style={[type.body, { color: c.muted }]}>Chargement…</Text></Page>;
  if (session) return <Redirect href="/(tabs)" />;

  const submit = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Renseigne ton email et ton mot de passe.'); return; }
    setBusy(true);
    try { await signIn(email, password); router.replace('/(tabs)'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Connexion impossible.'); }
    finally { setBusy(false); }
  };

  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Page style={{ justifyContent: 'center', gap: space.xl }}>
      <View style={{ alignItems: 'center', gap: space.md }}>
        <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: c.onPrimary, fontSize: 30, fontWeight: '800' }}>S</Text>
        </View>
        <Text style={[type.heading, { color: c.ink }]}>StudyApp</Text>
      </View>
      <Heading title="Content de te revoir." subtitle="Connecte-toi pour retrouver tes cours et tes supports de révision." />
      <Card>
        <Field label="Adresse email" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
        <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="Ton mot de passe" secureTextEntry autoComplete="password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} />
        <ErrorText>{error}</ErrorText>
        <Button title="Se connecter" onPress={submit} loading={busy} />
      </Card>
      <Text style={[type.body, { textAlign: 'center', color: c.muted }]}>
        Pas encore de compte ? <Link href="/register" style={{ color: c.primary, fontWeight: '700' }}>Créer un compte</Link>
      </Text>
    </Page>
  </KeyboardAvoidingView>;
}
