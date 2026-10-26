import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { C } from '@/components/study-ui';
import { useAuth } from '@/lib/auth-context';

export default function IndexRoute() {
  const { session, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}><ActivityIndicator color={C.primary} /></View>;
  return <Redirect href={session ? '/(tabs)' : '/login'} />;
}
