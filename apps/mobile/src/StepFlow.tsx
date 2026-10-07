import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Check, Lock, type LucideIcon } from 'lucide-react-native';
import { color, font, pastel, shadow, space, type } from './theme';

/**
 * Shared layout for step-by-step flows (Report, Help this animal):
 * step tracker → step card(s) → actions pinned in a footer.
 */

/** "Step 2 of 4 · Label" with a segmented progress bar. */
export function StepTracker({ stages, stage, complete }: { stages: readonly string[]; stage: number; complete?: boolean }) {
  return (
    <View style={styles.tracker}>
      <View style={styles.trackerText}>
        <Text style={styles.trackerStep}>{complete ? 'Done' : `Step ${stage + 1} of ${stages.length}`}</Text>
        <Text style={styles.trackerLabel} numberOfLines={1}>{stages[stage]}</Text>
      </View>
      <View style={styles.segments}>
        {stages.map((s, i) => <Segment key={s} filled={!!complete || i <= stage} />)}
      </View>
    </View>
  );
}

function Segment({ filled }: { filled: boolean }) {
  const st = useAnimatedStyle(() => ({ opacity: withTiming(filled ? 1 : 0, { duration: 260 }) }));
  return (
    <View style={styles.segment}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.segmentFill, st]} />
    </View>
  );
}

/** The one card each step lives in: icon, title, then the step's content. */
export function StepCard({ icon: Icon, title, tone = 'sky', children }: { icon: LucideIcon; title: string; tone?: 'sky' | 'success'; children?: ReactNode }) {
  const t = tone === 'success' ? { bg: color.successTint, fg: color.successInk } : { bg: pastel.sky.bg, fg: color.action };
  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.stepCard}>
      <View style={[styles.stepIcon, { backgroundColor: t.bg }]}><Icon size={22} color={t.fg} strokeWidth={2.1} /></View>
      <Text style={type.title}>{title}</Text>
      {children}
    </Animated.View>
  );
}

/** Small bold label that heads a group inside a step card. */
export function GroupLabel({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <Text style={styles.groupLabel}>
      {children}{optional ? <Text style={styles.optional}>  Optional</Text> : null}
    </Text>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot}><Check size={12} color={color.successInk} strokeWidth={3} /></View>
      <Text style={[type.body, { flex: 1, color: color.ink }]}>{text}</Text>
    </View>
  );
}

export function PrivacyNote({ text }: { text: string }) {
  return (
    <View style={styles.privacy}>
      <Lock size={13} color={color.inkMuted} />
      <Text style={[type.caption, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

export const stepStyles = StyleSheet.create({
  lead: { fontFamily: font.regular, fontSize: 15, lineHeight: 22, color: color.ink },
  footer: { paddingHorizontal: space[5], paddingTop: space[3], gap: space[2], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});

const styles = StyleSheet.create({
  tracker: { paddingHorizontal: space[5], paddingTop: space[1], paddingBottom: space[2], gap: space[2] },
  trackerText: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  trackerStep: { fontFamily: font.bold, fontSize: 12, color: color.action },
  trackerLabel: { flex: 1, fontFamily: font.semibold, fontSize: 12, color: color.inkSecondary },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: color.line, overflow: 'hidden' },
  segmentFill: { backgroundColor: color.action, borderRadius: 3 },
  stepCard: { backgroundColor: color.surface, borderRadius: 20, padding: space[5], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  stepIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { fontFamily: font.bold, fontSize: 13, color: color.inkSecondary, letterSpacing: 0.2 },
  optional: { fontFamily: font.semibold, fontSize: 12, color: color.inkMuted },
  divider: { height: 1, backgroundColor: color.line, marginVertical: space[1] },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  bulletDot: { width: 20, height: 20, borderRadius: 10, marginTop: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.successTint },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
