import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop, Text as SvgText, LinearGradient } from 'react-native-svg';
import Animated, {
  Easing, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { statusLabel, statusTone } from '@animal/shared';
import type { Case } from './data';
import { distanceLabel } from './store';
import { color, font, toneColors } from './theme';
import { statusIcon } from './ui';

/**
 * Illustrative vector map (no map provider decided yet, docs/08). Markers sit at
 * the animal's location; the only person shown is "you" (never responders).
 * Drawn in a fixed 360×460 space with "slice" so shapes keep their proportions.
 */
export const MapCanvas = memo(function MapCanvas({
  cases, selectedId, onSelect, onBackgroundPress,
}: { cases: Case[]; selectedId?: string | null; onSelect: (id: string) => void; onBackgroundPress?: () => void }) {
  return (
    <View style={styles.map}>
      <Svg width="100%" height="100%" viewBox="0 0 360 460" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="radius" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#5bbef6" stopOpacity="0.16" />
            <Stop offset="0.75" stopColor="#5bbef6" stopOpacity="0.07" />
            <Stop offset="1" stopColor="#5bbef6" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="sea" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#bfdcf2" />
            <Stop offset="1" stopColor="#d4e8f7" />
          </LinearGradient>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#f3f6fa" stopOpacity="0.9" />
            <Stop offset="0.18" stopColor="#f3f6fa" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* land */}
        <Rect width="360" height="460" fill="#eef2f7" />

        {/* sea on the west, lake to the north-east */}
        <Path d="M0 0 H34 C26 60 44 110 30 170 C18 230 40 290 26 350 C18 400 30 430 24 460 H0 Z" fill="url(#sea)" />
        <Path d="M262 38 C290 22 334 30 342 58 C350 88 318 104 292 98 C266 92 246 58 262 38 Z" fill="#cfe5f6" />

        {/* parks */}
        <Path d="M60 150 C78 132 120 138 126 160 C132 184 104 198 82 194 C60 190 46 168 60 150 Z" fill="#dcecd7" />
        <Path d="M224 300 C244 288 284 296 288 318 C292 340 262 352 240 346 C220 340 210 312 224 300 Z" fill="#dcecd7" />
        <Path d="M300 380 C318 372 344 380 344 398 C344 416 322 424 306 418 C292 412 288 388 300 380 Z" fill="#dcecd7" />

        {/* city blocks */}
        <G fill="#e6ecf3">
          {BLOCKS.map(([x, y, w, h], i) => <Rect key={i} x={x} y={y} width={w} height={h} rx={5} />)}
        </G>

        {/* minor roads */}
        <G stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round">
          <Path d="M40 92 H350" /><Path d="M40 262 H210" /><Path d="M150 400 H350" />
          <Path d="M110 20 V230" /><Path d="M200 120 V300" /><Path d="M300 120 V440" />
          <Path d="M50 340 C120 330 160 360 230 350" />
        </G>

        {/* arterial roads: casing + fill */}
        <G fill="none" strokeLinecap="round">
          <Path d={ARTERIAL_A} stroke="#dde4ec" strokeWidth={11} />
          <Path d={ARTERIAL_B} stroke="#dde4ec" strokeWidth={11} />
          <Path d={ARTERIAL_A} stroke="#ffffff" strokeWidth={8} />
          <Path d={ARTERIAL_B} stroke="#ffffff" strokeWidth={8} />
        </G>
        {/* highway */}
        <G fill="none" strokeLinecap="round">
          <Path d={HIGHWAY} stroke="#ead9a8" strokeWidth={13} />
          <Path d={HIGHWAY} stroke="#fbf0cf" strokeWidth={10} />
        </G>

        {/* area labels */}
        <G>
          {LABELS.map(([t, x, y]) => (
            <SvgText key={t} x={x} y={y} fill="#9aa6b6" fontSize={9.5} fontFamily={font.bold} letterSpacing={1.6} textAnchor="middle">{t}</SvgText>
          ))}
          <SvgText x={18} y={240} fill="#7fa6c6" fontSize={9} fontFamily={font.semibold} letterSpacing={1.4} transform="rotate(-90 18 240)" textAnchor="middle">ARABIAN SEA</SvgText>
        </G>

        {/* 5 km search radius */}
        <Circle cx="180" cy="230" r="160" fill="url(#radius)" />
        <Circle cx="180" cy="230" r="160" fill="none" stroke="#5bbef6" strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="5 6" />
        <Rect x="162" y="62" width="36" height="16" rx="8" fill="#ffffff" fillOpacity={0.95} stroke="#5bbef6" strokeOpacity={0.5} />
        <SvgText x="180" y="73.5" fill={color.infoInk} fontSize={9.5} fontFamily={font.bold} textAnchor="middle">5 km</SvgText>

        <Rect width="360" height="460" fill="url(#fade)" />
      </Svg>

      <Pressable style={StyleSheet.absoluteFill} onPress={onBackgroundPress} accessibilityLabel="Map background" />

      <You />
      {cases.map((c, i) => (
        <Pin key={c.id} c={c} i={i} selected={c.id === selectedId} onPress={() => onSelect(c.id)} />
      ))}
    </View>
  );
});

const ARTERIAL_A = 'M30 210 C110 196 170 236 240 220 S330 196 360 204';
const ARTERIAL_B = 'M160 0 C170 90 150 160 176 240 S168 380 190 460';
const HIGHWAY = 'M250 0 C232 70 262 150 236 230 C214 300 250 380 236 460';
const BLOCKS: [number, number, number, number][] = [
  [48, 30, 52, 50], [122, 30, 30, 50], [210, 104, 80, 74], [310, 104, 40, 60], [120, 104, 70, 34],
  [48, 102, 52, 30], [212, 250, 40, 40], [312, 250, 40, 110], [60, 280, 46, 40], [118, 280, 70, 46],
  [60, 360, 90, 34], [160, 372, 60, 22], [252, 410, 40, 40], [312, 420, 40, 30], [130, 150, 54, 40],
];
const LABELS: [string, number, number][] = [
  ['ANDHERI EAST', 120, 132], ['POWAI', 300, 120], ['MAROL', 80, 300], ['JOGESHWARI', 270, 372], ['SAKI NAKA', 150, 430], ['CHAKALA', 222, 196],
];

/** You: blue dot, white ring, soft heading cone and a slow halo. */
function You() {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    p.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1, false);
  }, [p, reduce]);
  const halo = useAnimatedStyle(() => ({ opacity: 0.35 * (1 - p.value), transform: [{ scale: 0.6 + p.value * 1.6 }] }));
  return (
    <View pointerEvents="none" style={[styles.anchor, { left: '50%', top: '50%' }]}>
      <Animated.View style={[styles.youHalo, halo]} />
      <Svg width={60} height={60} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="cone" cx="50%" cy="100%" r="100%">
            <Stop offset="0" stopColor="#0c74b6" stopOpacity="0.35" />
            <Stop offset="1" stopColor="#0c74b6" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Path d="M30 30 L18 4 A28 28 0 0 1 42 4 Z" fill="url(#cone)" />
      </Svg>
      <View style={styles.you} />
    </View>
  );
}

/** Teardrop pin. Icon + label carry the status; colour is never the only signal. */
function Pin({ c, i, selected, onPress }: { c: Case; i: number; selected: boolean; onPress: () => void }) {
  const tone = statusTone(c);
  const t = toneColors[tone];
  const Icon = statusIcon(c);
  const urgent = tone === 'urgent';
  const muted = c.status === 'CLOSED';
  const fill = muted ? color.inkSubtle : t.marker;
  const size = urgent ? 40 : 34;
  const reduce = useReducedMotion();

  // Drop-in on load, spring on select.
  const y = useSharedValue(reduce ? 0 : -18);
  const o = useSharedValue(reduce ? 1 : 0);
  const s = useSharedValue(1);
  useEffect(() => {
    if (reduce) return;
    o.value = withDelay(120 + i * 70, withTiming(1, { duration: 220 }));
    y.value = withDelay(120 + i * 70, withSpring(0, { damping: 11, stiffness: 170 }));
  }, [o, y, i, reduce]);
  useEffect(() => {
    s.value = reduce ? 1 : withSpring(selected ? 1.15 : 1, { damping: 12, stiffness: 200 });
  }, [selected, s, reduce]);
  const pin = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }, { scale: s.value }] }));

  // Urgent: a ring that breathes at the pin's tip.
  const r = useSharedValue(0);
  useEffect(() => {
    if (!urgent || reduce) return;
    r.value = withRepeat(withSequence(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 0 })), -1, false);
  }, [r, urgent, reduce]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.5 * (1 - r.value), transform: [{ scaleX: 1 + r.value * 1.8 }, { scaleY: 0.45 + r.value * 0.8 }] }));

  return (
    <View style={[styles.pinAnchor, { left: `${c.x}%`, top: `${c.y}%` }]} pointerEvents="box-none">
      {urgent ? <Animated.View pointerEvents="none" style={[styles.tipRing, { backgroundColor: fill }, ring]} /> : null}
      <View pointerEvents="none" style={styles.tipShadow} />
      {selected ? (
        <Animated.View entering={FadeInDown.duration(200)} pointerEvents="none" style={[styles.callout, { bottom: size * 1.42 + 12 }]}>
          <Text style={styles.calloutText} numberOfLines={1}>{c.title} · {distanceLabel(c.distanceM)}</Text>
        </Animated.View>
      ) : null}
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${c.title}, ${statusLabel(c)}`} hitSlop={10} style={[styles.pinHit, { width: size + 12, height: size * 1.42 + 6 }]}>
        <Animated.View style={[styles.pinBody, pin]}>
          <View style={[styles.drop, { width: size, height: size, borderRadius: size / 2, borderBottomRightRadius: 3, backgroundColor: fill }, selected && styles.dropSelected]}>
            <View style={[styles.dropInner, { width: size - 10, height: size - 10, borderRadius: (size - 10) / 2 }]}>
              <Icon size={urgent ? 17 : 15} color={fill} strokeWidth={2.5} />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, overflow: 'hidden', borderRadius: 28, backgroundColor: '#eef2f7', borderWidth: 1, borderColor: '#e3e9f1' },
  anchor: { position: 'absolute', width: 60, height: 60, marginLeft: -30, marginTop: -30, alignItems: 'center', justifyContent: 'center' },
  you: { width: 18, height: 18, borderRadius: 9, backgroundColor: color.action, borderWidth: 3.5, borderColor: '#ffffff', boxShadow: '0 2px 8px rgba(12,116,182,0.45)' },
  youHalo: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: color.primary },
  // The pin's tip sits exactly on the animal's location.
  pinAnchor: { position: 'absolute', width: 0, height: 0, alignItems: 'center' },
  pinHit: { position: 'absolute', bottom: -3, alignItems: 'center', justifyContent: 'flex-end' },
  pinBody: { alignItems: 'center', justifyContent: 'flex-end' },
  drop: { transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: '#ffffff', boxShadow: '0 6px 14px rgba(47,58,76,0.28)', marginBottom: 6 },
  dropSelected: { borderColor: color.ink },
  dropInner: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-45deg' }] },
  tipShadow: { position: 'absolute', top: -3, width: 14, height: 6, borderRadius: 7, backgroundColor: 'rgba(47,58,76,0.22)' },
  tipRing: { position: 'absolute', top: -6, width: 22, height: 12, borderRadius: 11 },
  callout: { position: 'absolute', backgroundColor: color.ink, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, minWidth: 120, alignItems: 'center' },
  calloutText: { fontFamily: font.bold, fontSize: 11.5, color: '#ffffff' },
});

