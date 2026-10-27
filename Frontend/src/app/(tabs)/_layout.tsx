import { Tabs } from 'expo-router';
import { Icon, type IconName } from '@/components/icon';
import { useColors } from '@/hooks/use-colors';

const icons: Record<string, IconName> = { index: 'home', explore: 'explore', profile: 'profile' };

export default function TabLayout() {
  const c = useColors();
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    sceneStyle: { backgroundColor: c.bg },
    tabBarActiveTintColor: c.primary,
    tabBarInactiveTintColor: c.muted,
    tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
    tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
    tabBarIcon: ({ color }) => <Icon name={icons[route.name] ?? 'home'} color={color} size={22} />,
  })}>
    <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
    <Tabs.Screen name="explore" options={{ title: 'Explorer' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
  </Tabs>;
}
