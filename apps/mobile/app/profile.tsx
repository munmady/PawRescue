import type { ComponentType } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell, ChevronRight, ClipboardList, FileText, HeartPulse, LifeBuoy, LogOut, Lock, Mail, PawPrint, Smartphone, type LucideIcon,
} from 'lucide-react-native';
import { Button, PressableScale, ScreenHeader } from '@/src/ui';
import { mobileLabel, useStore } from '@/src/store';
import { color, font, pastel, radius, shadow, space, type, type PastelName } from '@/src/theme';
import { PastelBackdrop } from '@/src/PastelBackdrop';
import { FoodPacketIcon } from '@/src/FoodPacketIcon';
import { PROMO_PHOTOS } from '@/src/photos';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { account, requireAccount, reportedIds, transportedIds, adoptions, donations, signOut } = useStore();

  if (!account) {
    return (
      <ScrollView style={{ backgroundColor: color.page }} contentContainerStyle={[styles.screen, { paddingTop: insets.top, paddingBottom: space[8] }]}>
        <PastelBackdrop variant="profile" />
        <View style={styles.headerBleed}><ScreenHeader title="Profile" /></View>
        <Animated.View entering={FadeInDown.duration(350)} style={[styles.card, styles.welcome]}>
          <Image source={PROMO_PHOTOS.pawBadge} style={styles.badge} resizeMode="contain" accessibilityIgnoresInvertColors />
          <Text style={[type.title, styles.center]}>Your profile</Text>
          <Text style={[type.body, styles.center]}>Set up your account to see your reports, adoption listings and food donations.</Text>
          <View style={{ alignSelf: 'stretch', marginTop: space[2] }}>
            <Button label="Set up your account" onPress={() => requireAccount('Set up your account', () => {})} />
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  const myListings = adoptions.filter((a) => a.mine).length;
  return (
    <ScrollView style={{ backgroundColor: color.page }} contentContainerStyle={[styles.screen, { paddingTop: insets.top, paddingBottom: space[8] }]}>
      <PastelBackdrop variant="profile" />
      <View style={styles.headerBleed}><ScreenHeader title="Profile" /></View>

      {/* 1 · Who you are */}
      <Animated.View entering={FadeInDown.duration(320)} style={[styles.card, styles.idCard]}>
        <View style={styles.idTop}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{account.name[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={type.title}>{account.name}</Text>
            <Text style={type.caption}>Member of the Rescue Network</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Detail icon={Mail} value={account.email} />
        <Detail icon={Smartphone} value={mobileLabel(account.mobile)} />
        {/* Responsible Reporter ✓ appears here only when the platform has verified the user (D82). */}
      </Animated.View>

      {/* 2 · Your impact */}
      <Section label="Your impact" delay={80} plain>
        <View style={styles.impact}>
          <Stat n={reportedIds.length} label="Cases reported" icon={ClipboardList} tone="sky" href="/my-reports?show=reported" />
          <Stat n={transportedIds.length} label="Taken to care" icon={HeartPulse} tone="green" href="/my-reports?show=transported" />
          <Stat n={myListings} label="Adoption listings" icon={PawPrint} tone="lavender" href="/my-adoptions" />
          <Stat n={donations.length} label="Food donations" icon={FoodPacketIcon} tone="butter" href="/my-donations" />
        </View>
      </Section>

      {/* 3 · Settings and support (My reports, adoption listings and food donations open from the Your impact tiles) */}
      <Section label="Settings and support" delay={200}>
        <Row icon={Bell} label="Notification settings" tone="aqua" onPress={() => router.push('/notifications')} />
        <Row icon={LifeBuoy} label="Help and safety" tone="mint" onPress={() => router.push('/help')} />
        <Row icon={Lock} label="Privacy" tone="sky" onPress={() => router.push('/privacy')} />
        <Row icon={FileText} label="Terms" tone="lavender" onPress={() => router.push('/terms')} last />
      </Section>

      {/* 4 · Log out, on its own */}
      <Animated.View entering={FadeInDown.delay(260).duration(320)} style={styles.listCard}>
        <Row icon={LogOut} label="Log out" onPress={signOut} last />
      </Animated.View>
    </ScrollView>
  );
}

/** A labelled group: small heading above a white card (or a bare area when `plain`). */
function Section({ label, delay, plain, children }: { label: string; delay: number; plain?: boolean; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(320)} style={{ gap: space[2] }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {plain ? children : <View style={styles.listCard}>{children}</View>}
    </Animated.View>
  );
}

function Detail({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <View style={styles.detail}>
      <Icon size={16} color={color.inkSecondary} />
      <Text style={[type.label, { color: color.ink, flex: 1 }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

/** One impact tile; tapping it opens the matching list (My reports, listings, donations). */
function Stat({ n, label, icon: Icon, tone, href }: { n: number; label: string; icon: LucideIcon | ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; tone: PastelName; href: '/my-reports?show=reported' | '/my-reports?show=transported' | '/my-adoptions' | '/my-donations' }) {
  const p = pastel[tone];
  return (
    <PressableScale onPress={() => router.push(href)} accessibilityLabel={`${label}: ${n}. Open`} style={[styles.stat, { backgroundColor: p.bg }]} scaleTo={0.96}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.statN, { color: p.ink }]}>{n}</Text>
        <Text style={[type.caption, { color: p.ink, fontFamily: font.semibold }]} numberOfLines={2}>{label}</Text>
      </View>
      <View style={styles.statIcon}><Icon size={18} color={p.ink} /></View>
    </PressableScale>
  );
}

function Row({ icon: Icon, label, onPress, last, tone }: { icon: LucideIcon | ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string; onPress: () => void; last?: boolean; tone?: PastelName }) {
  const p = tone ? pastel[tone] : null;
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} style={[styles.row, !last && styles.rowLine]} scaleTo={0.985}>
      <View style={[styles.rowIcon, { backgroundColor: p ? p.bg : '#eef1f5' }]}><Icon size={18} color={p ? p.ink : color.inkSecondary} /></View>
      <Text style={[type.section, { flex: 1, fontFamily: font.semibold }]}>{label}</Text>
      <ChevronRight size={18} color={color.inkMuted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: space[5], gap: space[5], backgroundColor: color.page, flexGrow: 1 },
  // The page has side padding; the header brings its own, so cancel it to keep the back button at 20 px like every page.
  headerBleed: { marginHorizontal: -space[5], marginBottom: -space[3] },
  card: { backgroundColor: color.surface, borderRadius: 20, borderWidth: 1, borderColor: color.line, ...shadow.card },
  center: { textAlign: 'center' },
  welcome: { alignItems: 'center', gap: space[3], padding: space[5] },
  badge: { width: 84, height: 84, borderRadius: 42, boxShadow: '0 8px 20px rgba(214, 120, 40, 0.22)' },
  idCard: { padding: space[4], gap: space[3] },
  idTop: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: pastel.lavender.soft, borderWidth: 3, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(91, 69, 196, 0.18)' },
  avatarText: { fontFamily: font.extrabold, fontSize: 24, color: pastel.lavender.ink },
  divider: { height: 1, backgroundColor: color.line },
  detail: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  sectionLabel: { fontFamily: font.bold, fontSize: 13, color: color.inkSecondary, letterSpacing: 0.3, textTransform: 'uppercase', paddingHorizontal: space[1] },
  impact: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  stat: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: space[2], borderRadius: radius.md, paddingVertical: space[3], paddingLeft: space[4], paddingRight: space[3] },
  statIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.75)', alignItems: 'center', justifyContent: 'center' },
  statN: { fontFamily: font.extrabold, fontSize: 26, lineHeight: 30, color: color.ink },
  listCard: { backgroundColor: color.surface, borderRadius: 20, paddingHorizontal: space[4], borderWidth: 1, borderColor: color.line, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 56 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: color.line },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
});
