import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { Cat, Dog } from 'lucide-react-native';

/**
 * Dog and cat faces taking turns for the Report button: a soft crossfade with a
 * small head tilt every couple of seconds. Static dog when reduce motion is on.
 * Same props as a lucide icon so it drops into Button.
 */
export function AnimalFacesIcon({ size = 18, color = '#2f3a4c', strokeWidth = 2.2 }: { size?: number; color?: string; strokeWidth?: number }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(0); // 0 = dog, 1 = cat

  useEffect(() => {
    if (reduce) return;
    const ease = Easing.inOut(Easing.quad);
    t.value = withRepeat(
      withSequence(
        withDelay(1800, withTiming(1, { duration: 420, easing: ease })),
        withDelay(1800, withTiming(0, { duration: 420, easing: ease })),
      ),
      -1, false,
    );
  }, [t, reduce]);

  // Each face tilts slightly as it arrives and settles upright.
  const dog = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [{ scale: 1 - t.value * 0.35 }, { rotate: `${t.value * -14}deg` }],
  }));
  const cat = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 0.65 + t.value * 0.35 }, { rotate: `${(1 - t.value) * 14}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, dog]}>
        <Dog size={size} color={color} strokeWidth={strokeWidth} />
      </Animated.View>
      {!reduce ? (
        <Animated.View style={[StyleSheet.absoluteFill, cat]}>
          <Cat size={size} color={color} strokeWidth={strokeWidth} />
        </Animated.View>
      ) : null}
    </View>
  );
}
