import { useId } from 'react';
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

/** Gradient (two or more evenly spaced stops) filling its (rounded, overflow-hidden) parent. Diagonal by default. */
export function GradientFill({ colors, id: base, horizontal, vertical }: { colors: readonly [string, string] | readonly string[]; id: string; horizontal?: boolean; vertical?: boolean }) {
  // Always unique: on web, a duplicate id (the same page open twice in the stack, or a hidden tab)
  // makes the browser use the first, possibly hidden, gradient and this one stops painting.
  const id = `${base}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={horizontal ? 0 : 1}>
            {colors.map((c, i) => <Stop key={i} offset={colors.length > 1 ? i / (colors.length - 1) : 0} stopColor={c} />)}
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
