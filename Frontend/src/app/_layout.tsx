import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/lib/auth-context';
import { C } from '@/components/study-ui';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={C.bg} />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.bg },
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="study-pack" />
        <Stack.Screen name="revision" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="glossary" />
        <Stack.Screen name="recall" />
        <Stack.Screen name="exam-practice" />
        <Stack.Screen name="tutor" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="ranking" />
        <Stack.Screen name="notes" />
        <Stack.Screen name="settings" />
      </Stack>
    </AuthProvider>
  );
}
