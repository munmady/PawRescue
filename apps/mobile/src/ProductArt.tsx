import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Cat, Dog, PawPrint } from 'lucide-react-native';
import { font } from './theme';
import { FOOD_PHOTOS, type FoodPhotoKey } from './photos';

export type ProductKind = 'dry-cat' | 'dry-dog' | 'wet';

/**
 * Unbranded product pack for food donations (demo art; no real brands, so no
 * implied partnership). Dry food is a crimp-top bag, wet food a pouch.
 * `fill` (0–1) scales the pack inside its tile so bigger sizes read bigger.
 */
const KIND = {
  'dry-cat': { body: '#6d83f2', dark: '#4f63cf', tint: '#eef1ff', Icon: Cat, word: 'DRY FOOD' },
  'dry-dog': { body: '#f5a623', dark: '#d4870b', tint: '#fef3e2', Icon: Dog, word: 'DRY FOOD' },
  wet: { body: '#2bb3a3', dark: '#1d8f82', tint: '#e3f6f3', Icon: PawPrint, word: 'WET FOOD' },
} as const;

export function ProductArt({
  kind, size = 64, label, fill = 1, photo, style,
}: { kind: ProductKind; size?: number; label?: string; fill?: number; photo?: FoodPhotoKey; style?: StyleProp<ViewStyle> }) {
  const k = KIND[kind];
  const S = size;
  if (photo) {
    return (
      <View style={[styles.tile, styles.photoTile, { width: S, height: S, borderRadius: S * 0.22 }, style]} accessible accessibilityLabel={`Product image${label ? `, ${label}` : ''}`}>
        <Image source={FOOD_PHOTOS[photo]} resizeMode="contain" style={{ width: S * 0.86, height: S * 0.86 }} />
      </View>
    );
  }
  const pack = S * (0.62 + 0.26 * fill);
  const showText = S >= 56;
  const id = `${kind}-${Math.round(S)}`;
  return (
    <View style={[styles.tile, { width: S, height: S, borderRadius: S * 0.22, backgroundColor: k.tint }, style]} accessible accessibilityLabel={`${k.word.toLowerCase()} pack${label ? `, ${label}` : ''}`}>
      <View style={{ width: pack, height: pack }}>
        <Svg width={pack} height={pack} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={k.body} />
              <Stop offset="1" stopColor={k.dark} />
            </LinearGradient>
          </Defs>
          {/* soft floor shadow */}
          <Rect x="22" y="93" width="56" height="5" rx="2.5" fill="#1f2937" opacity={0.12} />
          {kind === 'wet' ? (
            <>
              <Path d="M24 14 H76 V20 Q81 52 76 88 Q75.5 93 70 93 H30 Q24.5 93 24 88 Q19 52 24 20 Z" fill={`url(#g${id})`} />
              <Path d="M24 14 H76 V20 H24 Z" fill={k.dark} />
              <Path d="M70 14 l3 4 l3 -4" fill="#ffffff" opacity={0.6} />
            </>
          ) : (
            <>
              <Path d="M23 22 H77 L80 88 Q80 93 75 93 H25 Q20 93 20 88 Z" fill={`url(#g${id})`} />
              <Rect x="21" y="10" width="58" height="14" rx="3" fill={k.dark} />
              {[28, 36, 44, 52, 60, 68].map((x) => <Rect key={x} x={x} y="12" width="2" height="10" rx="1" fill="#ffffff" opacity={0.18} />)}
            </>
          )}
          {/* shine */}
          <Path d="M29 28 Q27 58 30 86" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={4} strokeLinecap="round" fill="none" />
          {/* label disc */}
          <Circle cx="52" cy="50" r="17" fill="#ffffff" />
          {/* kibble */}
          {kind !== 'wet' ? (
            <>
              <Circle cx="42" cy="86" r="2.8" fill="#8a5a2b" opacity={0.85} />
              <Circle cx="50" cy="87.5" r="2.8" fill="#a06a35" opacity={0.85} />
              <Circle cx="58" cy="86" r="2.8" fill="#8a5a2b" opacity={0.85} />
            </>
          ) : null}
        </Svg>
        <View pointerEvents="none" style={[styles.icon, { top: pack * 0.5 - pack * 0.1, left: pack * 0.52 - pack * 0.1, width: pack * 0.2, height: pack * 0.2 }]}>
          <k.Icon size={pack * 0.2} color={k.dark} strokeWidth={2.2} />
        </View>
        {showText ? (
          <Text pointerEvents="none" numberOfLines={1} style={[styles.word, { top: pack * 0.69, fontSize: Math.max(7, pack * 0.085) }]}>{label ?? k.word}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoTile: { backgroundColor: '#ffffff' },
  icon: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  word: { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: font.extrabold, color: '#ffffff', letterSpacing: 0.3 },
});
