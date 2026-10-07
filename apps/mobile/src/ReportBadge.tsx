import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';

const DOG = require('../assets/promo/report-dog.png');
const CAT = require('../assets/promo/report-cat.png');

/** Small badge sized like a button icon (lucide-style props); grows a touch without changing the button height. */
export function ReportBadgeIcon({ size = 18 }: { size?: number; color?: string; strokeWidth?: number }) {
  const s = size + 8;
  return <View style={{ marginVertical: -4 }}><ReportBadge size={s} /></View>;
}

/**
 * 3D dog and cat badges for the centre Report button, taking turns with a soft
 * crossfade and a small tilt every couple of seconds. Static dog with reduce motion.
 */
export function ReportBadge({ size }: { size: number }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(0); // 0 = dog, 1 = cat

  useEffect(() => {
    if (reduce) return;
    const ease = Easing.inOut(Easing.quad);
    t.value = withRepeat(
      withSequence(
        withDelay(2000, withTiming(1, { duration: 450, easing: ease })),
        withDelay(2000, withTiming(0, { duration: 450, easing: ease })),
      ),
      -1, false,
    );
  }, [t, reduce]);

  const dog = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ scale: 1 - t.value * 0.12 }, { rotate: `${t.value * -10}deg` }] }));
  const cat = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: 0.88 + t.value * 0.12 }, { rotate: `${(1 - t.value) * 10}deg` }] }));
  const img = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={{ width: size, height: size }} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, dog]}>
        <Image source={DOG} style={img} accessibilityIgnoresInvertColors />
      </Animated.View>
      {!reduce ? (
        <Animated.View style={[StyleSheet.absoluteFill, cat]}>
          <Image source={CAT} style={img} accessibilityIgnoresInvertColors />
        </Animated.View>
      ) : null}
    </View>
  );
}
