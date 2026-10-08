import { useEffect, useId, useRef, type ComponentType } from 'react';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { CircleHelp, House, PawPrint } from 'lucide-react-native';
import { FoodPacketIcon } from './FoodPacketIcon';

type IconType = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
import { color, font } from './theme';
import { useStore } from './store';
import { ReportBadge } from './ReportBadge';
import { BlurView } from 'expo-blur';
import { GradientFill } from './PastelBackdrop';
import { PressableScale } from './ui';

/**
 * Navigation: Home | Adoption | [Report] | Donation | FAQs (D139, D140, D142).
 * Profile opens from the top-right button on each tab (D142).
 * The raised centre circle is an action, not a tab: it opens the report flow.
 */
const ITEMS: Record<NavName, { label: string; Icon: IconType }> = {
  index: { label: 'Home', Icon: House },
  adoption: { label: 'Adopt', Icon: PawPrint },
  donations: { label: 'Donate', Icon: FoodPacketIcon },
  faqs: { label: 'FAQs', Icon: CircleHelp },
};

const PAD = 6;

/** Order of the bottom bar; the Report action sits between Adopt and Donate. */
export type NavName = 'index' | 'adoption' | 'donations' | 'faqs';
const ORDER: NavName[] = ['index', 'adoption', 'donations', 'faqs'];

/**
 * The bottom navigation bar. Used by the tabs layout (with the active tab) and by
 * pages outside the tabs, such as Vets and organisations or Help and safety (no tab active).
 */
export function NavBar({ active, onSelect }: { active: NavName | null; onSelect: (name: NavName) => void }) {
  const insets = useSafeAreaInsets();
  // Unique gradient ids: on web a duplicate id (e.g. a hidden tab bar) would stop the gradient painting.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {/* Dark blue glass: content behind is blurred (iOS/web) under a deep-blue tint.
            Clipped in its own layer so the raised Report circle isn't cut off. */}
        <View pointerEvents="none" style={styles.barBg}>
          <GlassBlur />
          <View style={styles.barTint}>
            <GradientFill colors={['#121c46', '#33459c']} id={`tabbar-glass-${uid}`} horizontal />
          </View>
          <View style={styles.barSheen}>
            <GradientFill colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']} id={`tabbar-sheen-${uid}`} vertical />
          </View>
        </View>
        {ORDER.map((name) => {
          const item = ITEMS[name];
          return [
            name === 'donations' ? <ReportButton key="report" /> : null,
            <Tab key={name} label={item.label} Icon={item.Icon} focused={active === name} onPress={() => onSelect(name)} />,
          ];
        })}
      </View>
    </View>
  );
}

/** Bottom bar for pages outside the tabs: tapping an item goes to that tab. */
export function StandaloneNavBar() {
  return <NavBar active={null} onSelect={(name) => router.navigate(name === 'index' ? '/' : `/${name}`)} />;
}

function Tab({ label, Icon, focused, onPress }: { label: string; Icon: IconType; focused: boolean; onPress: () => void }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  useEffect(() => {
    if (focused && !reduce) s.value = withSequence(withTiming(0.82, { duration: 90 }), withSpring(1, { damping: 9, stiffness: 260 }));
  }, [focused, reduce, s]);
  const pop = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  // The selected tab is shown by colour only (icon + label), no background.
  const fg = focused ? '#ffffff' : 'rgba(255,255,255,0.62)';
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

/**
 * Background blur for the glass bar. Native: expo-blur's BlurView. Web: the
 * browser's backdrop-filter set on the DOM node (react-native-web drops it as a style).
 */
function GlassBlur() {
  const ref = useRef<View>(null);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = ref.current as unknown as HTMLElement | null;
    if (!el) return;
    el.style.setProperty('backdrop-filter', 'blur(18px) saturate(160%)');
    el.style.setProperty('-webkit-backdrop-filter', 'blur(18px) saturate(160%)');
  }, []);
  if (Platform.OS === 'web') return <View ref={ref} style={StyleSheet.absoluteFill} />;
  return <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />;
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
          <ReportBadge size={54} />
        </PressableScale>
      </View>
      {/* Same stack as a tab (icon-sized spacer + label) so "Report" shares their baseline. */}
      <View style={styles.iconSpacer} />
      <Text style={[styles.label, styles.reportLabel]} numberOfLines={1}>Report</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 8 },
  bar: {
    flexDirection: 'row', padding: PAD, borderRadius: 30,
    boxShadow: '0 16px 36px rgba(32,44,120,0.38), 0 3px 8px rgba(18,28,70,0.22)',
  },
  barTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.88 },
  barSheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  barBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 30, overflow: 'hidden' },
  tab: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontFamily: font.semibold, fontSize: 11.5, letterSpacing: 0.1 },
  labelOn: { fontFamily: font.bold },
  reportSlot: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconSpacer: { width: 21, height: 21 },
  reportLift: { position: 'absolute', top: -36, alignSelf: 'center' },
  reportBtn: {
    width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    backgroundColor: '#ffe14d', borderWidth: 4, borderColor: '#ffffff', boxShadow: '0 8px 20px rgba(230, 185, 0, 0.40)',
  },
  reportLabel: { color: '#ffffff', fontFamily: font.bold },
});
