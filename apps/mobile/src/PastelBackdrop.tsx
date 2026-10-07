import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

/**
 * One soft sky wash behind the top of each tab screen, fading into the page.
 * A single hue everywhere keeps the background calm; colour lives in the
 * content (tiles, stats). Decorative only: no pointer events, static.
 * `variant` is kept so screens can diverge later if needed.
 */
export function PastelBackdrop({ height = 300 }: { variant?: 'home' | 'adoption' | 'donation' | 'profile'; height?: number }) {
  return (
    <View pointerEvents="none" style={[styles.wrap, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="pastel-wash" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#dcefff" stopOpacity="1" />
            <Stop offset="0.55" stopColor="#eef7ff" stopOpacity="0.7" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#pastel-wash)" />
      </Svg>
    </View>
  );
}

/** Diagonal two-stop pastel gradient filling its (rounded, overflow-hidden) parent. */
export function GradientFill({ colors, id, horizontal, vertical }: { colors: readonly [string, string] | readonly string[]; id: string; horizontal?: boolean; vertical?: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={horizontal ? 0 : 1}>
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0 },
});
