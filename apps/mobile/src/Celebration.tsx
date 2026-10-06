import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { color, pastel } from './theme';

/**
 * Quiet success moment: the check pops in once with a single soft ripple.
 * Static when reduce motion is on.
 */
export function Celebration({ tint = color.successTint, ink = color.successInk }: { tint?: string; ink?: string }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(reduce ? 1 : 0.6);
  const o = useSharedValue(reduce ? 1 : 0);
  const ring = useSharedValue(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) return;
    o.value = withTiming(1, { duration: 200 });
    s.value = withSpring(1, { damping: 14, stiffness: 180 });
    ring.value = withDelay(200, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [s, o, ring, reduce]);

  const badge = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: s.value }] }));
  const ripple = useAnimatedStyle(() => ({ opacity: 0.4 * (1 - ring.value), transform: [{ scale: 1 + ring.value * 0.5 }] }));

  return (
    <View style={styles.stage} pointerEvents="none">
      {!reduce ? <Animated.View style={[styles.ring, ripple]} /> : null}
      <Animated.View style={[styles.badge, { backgroundColor: tint }, badge]}>
        <View style={[styles.badgeInner, { backgroundColor: ink }]}>
          <Check size={34} color="#ffffff" strokeWidth={3} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { width: 140, height: 104, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  badge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  badgeInner: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: pastel.mint.ink },
});
