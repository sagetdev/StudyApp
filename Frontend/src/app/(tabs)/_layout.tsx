import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { C } from '@/components/study-ui';

const icons: Record<string, string> = { index: '⌂', explore: '✧', profile: '◉' };

export default function TabLayout() {
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    sceneStyle: { backgroundColor: C.bg },
    tabBarActiveTintColor: C.primary,
    tabBarInactiveTintColor: C.muted,
    tabBarStyle: { height: 66, paddingTop: 7, paddingBottom: 8, backgroundColor: '#FFFFFF', borderTopColor: C.line },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23, lineHeight: 27 }}>{icons[route.name] || '•'}</Text>,
  })}>
    <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
    <Tabs.Screen name="explore" options={{ title: 'Explorer' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
  </Tabs>;
}
