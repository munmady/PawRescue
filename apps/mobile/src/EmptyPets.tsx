import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { PawPrint } from 'lucide-react-native';
import { GradientFill } from './PastelBackdrop';
import { color, pastel, space, type } from './theme';

const DOG = require('../assets/promo/report-dog.png');
const CAT = require('../assets/promo/report-cat.png');

/**
 * Friendly empty state: the 3D dog and cat faces bobbing over a soft pastel disc,
 * with a few paw prints, above the (locked) message and an optional hint.
 */
export function EmptyPets({ title, hint }: { title: string; hint?: string }) {
  return (
    <Animated.View entering={FadeIn.duration(350)} style={styles.wrap}>
      <View style={styles.art}>
        <View style={styles.disc}>
          <GradientFill colors={[pastel.sky.bg, pastel.mint.bg]} id="empty-pets-disc" />
        </View>
        <Paw style={{ left: 6, top: 18, transform: [{ rotate: '-24deg' }] }} size={16} />
        <Paw style={{ right: 4, top: 4, transform: [{ rotate: '18deg' }] }} size={13} />
        <Paw style={{ right: 14, bottom: 10, transform: [{ rotate: '32deg' }] }} size={15} />
        <Bob delay={0} style={[styles.face, styles.cat]}><Image source={CAT} style={styles.img} /></Bob>
        <Bob delay={600} style={[styles.face, styles.dog]}><Image source={DOG} style={styles.img} /></Bob>
      </View>
      <Text style={[type.section, styles.center]}>{title}</Text>
      {hint ? <Text style={[type.label, styles.center, { maxWidth: 260 }]}>{hint}</Text> : null}
    </Animated.View>
  );
}

function Paw({ style, size }: { style: object; size: number }) {
  return <View pointerEvents="none" style={[styles.paw, style]}><PawPrint size={size} color={pastel.sky.ink} strokeWidth={2.2} /></View>;
}

/** Slow up-and-down float; still when the system asks for reduced motion. */
function Bob({ delay, style, children }: { delay: number; style: object; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    y.value = withDelay(delay, withRepeat(withSequence(
      withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
    ), -1));
  }, [delay, reduce, y]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[style, st]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space[2], marginTop: space[6], paddingHorizontal: space[4] },
  art: { width: 190, height: 150, marginBottom: space[2] },
  disc: { position: 'absolute', left: 25, top: 5, width: 140, height: 140, borderRadius: 70, overflow: 'hidden' },
  face: { position: 'absolute', width: 86, height: 86, borderRadius: 43, borderWidth: 4, borderColor: '#ffffff', overflow: 'hidden', boxShadow: '0 8px 18px rgba(47,58,76,0.16)' },
  cat: { left: 22, top: 38, transform: [{ rotate: '-8deg' }] },
  dog: { right: 22, top: 30, transform: [{ rotate: '8deg' }] },
  img: { width: '100%', height: '100%' },
  paw: { position: 'absolute', opacity: 0.7 },
  center: { textAlign: 'center', color: color.ink },
});
