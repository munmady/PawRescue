import { useEffect, type ComponentType, type ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle, type TextStyle, type AccessibilityRole, type AccessibilityState, type ImageSourcePropType } from 'react-native';
import Animated, {
  FadeIn, FadeInDown, FadeOut, FadeOutDown, SlideInDown, SlideOutDown, useAnimatedStyle, useReducedMotion,
  useSharedValue, withSequence, withTiming, withRepeat, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Ambulance, Cat, ChevronLeft, CircleCheck, Clock, Dog, EyeOff, Images, MapPinCheck, PawPrint, Route, Siren, type LucideIcon,
} from 'lucide-react-native';
import { statusLabel, statusTone, type CaseLike, type Species } from '@animal/shared';
import { color, font, radius, shadow, space, toneColors, type } from './theme';
import { useStore } from './store';

/* ---------- Pressable with a gentle scale on press ---------- */
export function PressableScale({
  onPress, children, style, disabled, accessibilityLabel, accessibilityRole = 'button', accessibilityState, scaleTo = 0.97, hitSlop,
}: {
  onPress?: () => void; children: ReactNode; style?: StyleProp<ViewStyle>; disabled?: boolean;
  accessibilityLabel?: string; accessibilityRole?: AccessibilityRole; accessibilityState?: AccessibilityState; scaleTo?: number; hitSlop?: number;
}) {
  const s = useSharedValue(1);
  const reduce = useReducedMotion();
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  // Layout props must sit on the outer Pressable so flex rows size correctly.
  const flat = (StyleSheet.flatten(style) ?? {}) as ViewStyle;
  const outer: ViewStyle = { flex: flat.flex, flexGrow: flat.flexGrow, flexBasis: flat.flexBasis, alignSelf: flat.alignSelf, width: flat.width, height: flat.height, minHeight: flat.minHeight };
  return (
    <Pressable
      style={outer}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={hitSlop}
      onPress={onPress}
      onPressIn={() => { if (!reduce) s.value = withTiming(scaleTo, { duration: 90 }); }}
      onPressOut={() => { s.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) }); }}
    >
      <Animated.View style={[style, flat.flex != null && { flex: 1, alignSelf: 'stretch' }, a, disabled && { opacity: 0.45 }]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Buttons ---------- */
type BtnVariant = 'primary' | 'urgent' | 'outline' | 'link' | 'quiet';
export function Button({
  label, onPress, variant = 'primary', icon: Icon, style, disabled, full = true,
}: { label: string; onPress?: () => void; variant?: BtnVariant; icon?: LucideIcon | ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; style?: StyleProp<ViewStyle>; disabled?: boolean; full?: boolean }) {
  const v = btnStyles[variant];
  const fg = variant === 'primary' ? color.onAction : variant === 'urgent' ? color.ink : variant === 'link' ? color.action : color.ink;
  return (
    <PressableScale onPress={onPress} disabled={disabled} accessibilityLabel={label} style={[styles.btn, v, full && { alignSelf: 'stretch' }, style]}>
      {Icon ? <Icon size={18} color={fg} strokeWidth={2.2} /> : null}
      <Text style={[type.button, { color: fg }, variant === 'link' && { textDecorationLine: 'underline' }]}>{label}</Text>
    </PressableScale>
  );
}
const btnStyles: Record<BtnVariant, ViewStyle> = {
  primary: { backgroundColor: color.action, ...shadow.float },
  /** Report an animal in distress only: lemon yellow with dark ink, distinct from the blue actions. */
  urgent: { backgroundColor: '#ffe14d', boxShadow: '0 10px 24px rgba(230, 185, 0, 0.32)' },
  outline: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  link: { backgroundColor: 'transparent', paddingHorizontal: 4, minHeight: 44 },
  quiet: { backgroundColor: color.surfaceTint },
};

/* ---------- Status ---------- */
export function statusIcon(c: CaseLike): LucideIcon {
  switch (c.status) {
    case 'NEW': return Siren;
    case 'ACCEPTED': return CircleCheck;
    case 'ON_THE_WAY': return Clock;
    case 'ON_SITE': return MapPinCheck;
    case 'TO_HOSPITAL': return Ambulance;
    case 'RESPONDER_TO_HOSPITAL': return Route;
    case 'AT_HOSPITAL': case 'IN_CARE': return CircleCheck;
    default: return PawPrint;
  }
}

export function StatusChip({ c, size = 'md', label }: { c: CaseLike; size?: 'sm' | 'md'; label?: string }) {
  const tone = toneColors[statusTone(c)];
  const Icon = statusIcon(c);
  const sm = size === 'sm';
  return (
    <Animated.View key={c.status} entering={FadeIn.duration(250)} style={[styles.chip, { backgroundColor: tone.bg, paddingVertical: sm ? 3 : 5 }]}>
      <Icon size={sm ? 13 : 15} color={tone.fg} strokeWidth={2.2} />
      <Text numberOfLines={2} style={[styles.chipText, { color: tone.fg, fontSize: sm ? 11.5 : 12.5 }]}>{label ?? statusLabel(c)}</Text>
    </Animated.View>
  );
}

/* ---------- Photo placeholder (real evidence photos come from reports) ---------- */
export function AnimalPhoto({
  species, photo, count, sensitive, style, iconSize = 34, onReveal, revealed = false,
}: { species: Species; photo?: ImageSourcePropType; count?: number; sensitive?: boolean; style?: StyleProp<ViewStyle>; iconSize?: number; onReveal?: () => void; revealed?: boolean }) {
  const Icon = species === 'cat' ? Cat : species === 'dog' ? Dog : PawPrint;
  const hidden = !!sensitive && !revealed;
  const small = iconSize < 40;
  return (
    <View style={[styles.photo, style]}>
      {photo ? (
        <Image source={photo} resizeMode="cover" blurRadius={hidden ? 22 : 0} style={styles.photoImg} accessibilityIgnoresInvertColors />
      ) : (
        <>
          <View style={styles.photoHalo} />
          <Icon size={iconSize} color={color.primary} strokeWidth={1.5} />
        </>
      )}
      {count && count > 1 ? (
        <View style={styles.photoCount}>
          <Images size={11} color={color.ink} />
          <Text style={styles.photoCountText}>{count}</Text>
        </View>
      ) : null}
      {/* Sensitive images render blurred until tapped (docs/07). Thumbnails just stay blurred. */}
      {hidden ? (
        onReveal ? (
          <Pressable onPress={onReveal} style={[styles.blur, !!photo && styles.blurOnPhoto]} accessibilityRole="button" accessibilityLabel="Show sensitive photo">
            {/* Frosted glass: light wash over the blurred photo, a glassy pill on top. */}
            <View style={small ? styles.glassDot : styles.glassPill}>
              <EyeOff size={small ? 15 : 17} color={color.ink} />
              {!small ? <Text style={styles.glassText}>Sensitive photo · Tap to view</Text> : null}
            </View>
          </Pressable>
        ) : (
          <View pointerEvents="none" style={[styles.blur, !!photo && styles.blurOnPhoto]} accessibilityLabel="Sensitive photo">
            <View style={styles.glassDot}><EyeOff size={15} color={color.ink} /></View>
          </View>
        )
      ) : null}
    </View>
  );
}

/* ---------- Header ---------- */
export function ScreenHeader({ title, right, onBack }: { title?: string; right?: ReactNode; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <PressableScale
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        accessibilityLabel="Back" style={styles.iconBtn} scaleTo={0.9}
      >
        <ChevronLeft size={24} color={color.ink} />
      </PressableScale>
      <Text numberOfLines={1} style={[type.section, { flex: 1, textAlign: 'center' }]}>{title}</Text>
      <View style={{ width: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/* ---------- Card ---------- */
export function Card({ children, style, delay = 0 }: { children: ReactNode; style?: StyleProp<ViewStyle>; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View entering={reduce ? undefined : FadeInDown.delay(delay).duration(320)} style={[styles.card, style]}>
      {children}
    </Animated.View>
  );
}

/* ---------- Bottom sheet dialog ---------- */
/**
 * Bottom sheet rendered in a Modal so it always sits above the floating tab bar.
 * Tall content scrolls; on wide web windows it keeps the app's 440 px column.
 */
export function SheetDialog({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.modalRoot}>
        {visible ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalFrame}>
            <Animated.View entering={FadeIn.duration(180)} style={[StyleSheet.absoluteFill, { backgroundColor: color.scrim }]}>
              <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" />
            </Animated.View>
            <Animated.View entering={SlideInDown.springify().damping(20)} style={styles.dialog}>
              <View style={styles.grab} />
              <ScrollView
                style={{ flexGrow: 0 }}
                contentContainerStyle={[styles.dialogBody, { paddingBottom: Math.max(insets.bottom, space[6]) }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        ) : null}
      </View>
    </Modal>
  );
}

/* ---------- Toast ---------- */
export function ToastHost() {
  const { toast } = useStore();
  const show = useSharedValue(0);
  useEffect(() => {
    if (!toast) return;
    show.value = withSequence(withTiming(1, { duration: 200 }), withTiming(1, { duration: 2600 }), withTiming(0, { duration: 220 }));
  }, [toast, show]);
  const a = useAnimatedStyle(() => ({ opacity: show.value, transform: [{ translateY: (1 - show.value) * 16 }] }));
  if (!toast) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.toast, a]} accessibilityLiveRegion="polite">
      <Text style={[type.label, { color: '#fff' }]}>{toast.text}</Text>
    </Animated.View>
  );
}

/* ---------- Small pieces ---------- */
export function Pill({ label, selected, onPress, icon: Icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: LucideIcon }) {
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} style={[styles.pill, selected && styles.pillOn]}>
      {Icon ? <Icon size={15} color={selected ? color.action : color.inkSecondary} /> : null}
      <Text style={[type.label, { color: selected ? color.action : color.ink }]}>{label}</Text>
    </PressableScale>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: color.line }, style]} />;
}

export function SectionTitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.section, { marginBottom: space[3] }, style]}>{children}</Text>;
}

/** A slow halo for urgent markers; disabled when the user prefers reduced motion. */
export function Pulse({ size, tint }: { size: number; tint: string }) {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    p.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false);
  }, [p, reduce]);
  const a = useAnimatedStyle(() => ({ opacity: reduce ? 0.25 : 0.45 * (1 - p.value), transform: [{ scale: 1 + p.value * 0.9 }] }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: tint }, a]} />;
}

export function FadeSlide({ children, k }: { children: ReactNode; k: string | number }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View key={k} style={{ flex: 1 }} entering={reduce ? undefined : FadeInDown.duration(260)} exiting={reduce ? undefined : FadeOutDown.duration(120)}>
      {children}
    </Animated.View>
  );
}

export const styles = StyleSheet.create({
  btn: { minHeight: 50, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2], paddingHorizontal: space[5] },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, borderRadius: radius.pill, maxWidth: '100%' },
  chipText: { fontFamily: font.bold, lineHeight: 16, flexShrink: 1 },
  photo: { backgroundColor: color.surfaceTint, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoHalo: { position: 'absolute', width: '70%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#ffffff', opacity: 0.55 },
  photoCount: { position: 'absolute', right: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  photoCountText: { fontFamily: font.bold, fontSize: 11, color: color.ink },
  photoImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  blurOnPhoto: { backgroundColor: 'rgba(255,255,255,0.12)' },
  glassPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 14px rgba(47,58,76,0.12)' },
  glassDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)' },
  glassText: { fontFamily: font.bold, fontSize: 12, color: color.ink },
  blur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(234,246,254,0.94)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[3], height: 56 },
  iconBtn: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], ...shadow.card },
  modalRoot: { flex: 1, alignItems: 'center' },
  modalFrame: { flex: 1, width: '100%', maxWidth: 440, justifyContent: 'flex-end' },
  dialog: { maxHeight: '88%', backgroundColor: color.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: space[3], ...shadow.sheet },
  dialogBody: { paddingHorizontal: space[5], paddingTop: space[2], gap: space[3] },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: color.line, alignSelf: 'center', marginBottom: space[2] },
  toast: { position: 'absolute', left: space[5], right: space[5], bottom: 108, backgroundColor: color.ink, borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[4], alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: radius.pill, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  pillOn: { backgroundColor: color.surfaceTint, borderColor: color.primary },
});
