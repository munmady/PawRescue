import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { color, font, shadow } from './theme';

/** "Kabir is typing…" with three bouncing dots, shown as an incoming bubble. */
export function TypingIndicator({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.wrap} accessibilityLabel={`${name} is typing`}>
      <Text style={styles.who}>{name} is typing…</Text>
      <View style={styles.bubble}>
        {[0, 1, 2].map((i) => <Dot key={i} delay={i * 150} />)}
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(withSequence(withTiming(-4, { duration: 260 }), withTiming(0, { duration: 260 })), -1));
  }, [delay, y]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], opacity: 0.45 + (-y.value / 4) * 0.55 }));
  return <Animated.View style={[styles.dot, st]} />;
}

const styles = StyleSheet.create({
  wrap: { gap: 4, alignItems: 'flex-start', marginTop: 12 },
  who: { fontFamily: font.semibold, fontSize: 12, color: color.inkMuted },
  bubble: { flexDirection: 'row', gap: 5, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 18, borderBottomLeftRadius: 6, backgroundColor: color.surface, ...shadow.card },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.inkSecondary },
});
