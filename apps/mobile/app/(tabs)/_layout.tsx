import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { color } from '@/src/theme';
import { NavBar, type NavName } from '@/src/BottomNav';

/**
 * Navigation: Home | Adoption | [Report] | Donation | FAQs (D139, D140, D142).
 * Profile opens from the top-right button on each tab (D142). The bar itself lives in src/BottomNav.tsx.
 */
function TabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index]?.name as NavName;
  return (
    <NavBar
      active={active}
      onSelect={(name) => {
        const route = state.routes.find((r) => r.name === name);
        if (!route) return;
        const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (active !== name && !e.defaultPrevented) navigation.navigate(name);
      }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.page } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="adoption" options={{ title: 'Adopt' }} />
      <Tabs.Screen name="donations" options={{ title: 'Donate' }} />
      <Tabs.Screen name="faqs" options={{ title: 'FAQs' }} />
    </Tabs>
  );
}

