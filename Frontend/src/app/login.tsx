import React, { useState } from 'react';
import { Link, Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, C, Card, Field, Heading, Page } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const { session, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <Page><Text style={{ color: C.muted }}>Chargement…</Text></Page>;
  if (session) return <Redirect href="/(tabs)" />;

  const submit = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Renseigne ton email et ton mot de passe.'); return; }
    setBusy(true);
    try { await signIn(email, password); router.replace('/(tabs)'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Connexion impossible.'); }
    finally { setBusy(false); }
  };

  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Page style={{ justifyContent: 'center', paddingTop: 42 }}>
      <View style={{ alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 30, fontWeight: '800' }}>S</Text>
        </View>
        <Text style={{ color: C.ink, fontSize: 17, fontWeight: '800' }}>StudyApp</Text>
      </View>
      <Heading eyebrow="Bon retour" title="Reprends là où tu en étais." subtitle="Connecte-toi pour transformer tes cours en supports de révision clairs." />
      <Card>
        <Field label="Adresse email" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="Ton mot de passe" secureTextEntry autoComplete="password" onSubmitEditing={submit} />
        {error ? <Text accessibilityRole="alert" style={{ color: C.danger, fontSize: 13, lineHeight: 19 }}>{error}</Text> : null}
        <Button title="Se connecter" onPress={submit} loading={busy} />
      </Card>
      <Text style={{ textAlign: 'center', color: C.muted, fontSize: 14, lineHeight: 22 }}>
        Pas encore de compte ? <Link href="/register" style={{ color: C.primary, fontWeight: '800' }}>Créer un compte</Link>
      </Text>
      <Text style={{ textAlign: 'center', color: '#9299AA', fontSize: 11, lineHeight: 17 }}>Un espace simple pour apprendre avec méthode.</Text>
    </Page>
  </KeyboardAvoidingView>;
}
