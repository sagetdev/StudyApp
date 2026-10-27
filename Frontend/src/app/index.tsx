import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

export default function IndexRoute() {
  const c = useColors();
  const { session, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}><ActivityIndicator color={c.primary} /></View>;
  return <Redirect href={session ? '/(tabs)' : '/login'} />;
}
