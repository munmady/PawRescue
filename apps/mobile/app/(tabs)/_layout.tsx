import { useEffect, type ComponentType } from 'react';
import { router } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { House, PawPrint, User } from 'lucide-react-native';
import { FoodPacketIcon } from '@/src/FoodPacketIcon';

type IconType = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
import { color, font } from '@/src/theme';
import { useStore } from '@/src/store';
import { AnimalFacesIcon } from '@/src/AnimalFacesIcon';
import { PressableScale } from '@/src/ui';

/**
 * Navigation: Home | Adoption | [Report] | Donation | Profile (D139, D140).
 * The raised centre circle is an action, not a tab: it opens the report flow.
 */
const ITEMS: Record<string, { label: string; Icon: IconType }> = {
  index: { label: 'Home', Icon: House },
  adoption: { label: 'Adopt', Icon: PawPrint },
  donations: { label: 'Donate', Icon: FoodPacketIcon },
  profile: { label: 'Profile', Icon: User },
};

const PAD = 6;

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, i) => {
          const item = ITEMS[route.name];
          if (!item) return null;
          const focused = state.index === i;
          return [
            route.name === 'donations' ? <ReportButton key="report" /> : null,
            <Tab
              key={route.key}
              label={item.label}
              Icon={item.Icon}
              focused={focused}
              onPress={() => {
                const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
              }}
            />,
          ];
        })}
      </View>
    </View>
  );
}

function Tab({ label, Icon, focused, onPress }: { label: string; Icon: IconType; focused: boolean; onPress: () => void }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  useEffect(() => {
    if (focused && !reduce) s.value = withSequence(withTiming(0.82, { duration: 90 }), withSpring(1, { damping: 9, stiffness: 260 }));
  }, [focused, reduce, s]);
  const pop = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  // The selected tab is shown by colour only (icon + label), no background.
  const fg = focused ? color.action : color.inkMuted;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.tab}
    >
      <Animated.View style={pop}>
        <Icon size={21} color={fg} strokeWidth={focused ? 2.3 : 1.9} />
      </Animated.View>
      <Text style={[styles.label, { color: fg }, focused && styles.labelOn]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

/** Raised centre action (D140): opens Report an animal in distress from any tab. */
function ReportButton() {
  const { requireAccount } = useStore();
  return (
    <View style={styles.reportSlot}>
      <View style={styles.reportLift}>
        <PressableScale
          onPress={() => requireAccount('Sign in to report', () => router.push('/report'))}
          accessibilityLabel="Report an animal in distress"
          style={styles.reportBtn}
          scaleTo={0.92}
        >
          <AnimalFacesIcon size={26} color={color.ink} strokeWidth={2.2} />
        </PressableScale>
      </View>
      {/* Same stack as a tab (icon-sized spacer + label) so "Report" shares their baseline. */}
      <View style={styles.iconSpacer} />
      <Text style={[styles.label, styles.reportLabel]} numberOfLines={1}>Report</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.page } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="adoption" options={{ title: 'Adopt' }} />
      <Tabs.Screen name="donations" options={{ title: 'Donate' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 8 },
  bar: {
    flexDirection: 'row', padding: PAD, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.97)',
    borderWidth: 1, borderColor: color.line, boxShadow: '0 12px 32px rgba(47,58,76,0.16), 0 2px 6px rgba(47,58,76,0.06)',
  },
  tab: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontFamily: font.semibold, fontSize: 11.5, letterSpacing: 0.1 },
  labelOn: { fontFamily: font.bold },
  reportSlot: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconSpacer: { width: 21, height: 21 },
  reportLift: { position: 'absolute', top: -36, alignSelf: 'center' },
  reportBtn: {
    width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ffe14d', borderWidth: 4, borderColor: '#ffffff', boxShadow: '0 8px 20px rgba(230, 185, 0, 0.40)',
  },
  reportLabel: { color: color.ink, fontFamily: font.bold },
});
