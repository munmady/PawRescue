import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';

/**
 * Siren for the Report button. Light rays flash, the dome light blinks and the
 * siren gives a small wobble every few seconds. Static when reduce motion is on.
 * Same props as a lucide icon so it drops into Button.
 */
export function SirenIcon({ size = 18, color = '#ffffff', strokeWidth = 2.2 }: { size?: number; color?: string; strokeWidth?: number }) {
  const reduce = useReducedMotion();
  const flash = useSharedValue(1);
  const wobble = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    flash.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 380, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 380, easing: Easing.inOut(Easing.quad) })),
      -1, false,
    );
    wobble.value = withRepeat(
      withSequence(
        withDelay(2600, withTiming(-9, { duration: 90 })),
        withTiming(8, { duration: 110 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 120 }),
      ),
      -1, false,
    );
  }, [flash, wobble, reduce]);

  const rays = useAnimatedStyle(() => ({ opacity: flash.value, transform: [{ scale: 0.9 + flash.value * 0.1 }] }));
  const light = useAnimatedStyle(() => ({ opacity: 1.2 - flash.value }));
  const body = useAnimatedStyle(() => ({ transform: [{ rotate: `${wobble.value}deg` }] }));

  const sw = strokeWidth;
  return (
    <View style={{ width: size, height: size }} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, rays]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
          <Path d="M12 1.5v1.5" />
          <Path d="M4.6 4.6l1 1" />
          <Path d="M19.4 4.6l-1 1" />
          <Path d="M1.5 11.5H3" />
          <Path d="M21 11.5h1.5" />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, body]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M7 18v-6a5 5 0 0 1 10 0v6" />
          <Path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
        </Svg>
        <Animated.View style={[StyleSheet.absoluteFill, light]}>
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="13.5" r="2.4" fill={color} />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
