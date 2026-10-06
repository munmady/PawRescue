import type { ComponentType } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  BadgeCheck, Bell, ChevronRight, ClipboardList, FileText, HandHeart, LifeBuoy, LogOut, PawPrint, Lock, type LucideIcon,
} from 'lucide-react-native';
import { Button, Card, PressableScale } from '@/src/ui';
import { mobileLabel, useStore } from '@/src/store';
import { color, font, pastel, radius, shadow, space, type, type PastelName } from '@/src/theme';
import { PastelBackdrop } from '@/src/PastelBackdrop';
import { FoodPacketIcon } from '@/src/FoodPacketIcon';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { account, requireAccount, reportedIds, transportedIds, adoptions, donations, signOut } = useStore();

  if (!account) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + space[6] }]}>
        <PastelBackdrop variant="profile" />
        <Animated.View entering={FadeInDown.duration(350)} style={{ gap: space[3] }}>
          <View style={styles.bigIcon}><PawPrint size={34} color={color.action} /></View>
          <Text style={type.display}>Your profile</Text>
          <Text style={type.body}>Set up your account to see your reports, adoption listings and food donations.</Text>
          <Button label="Set up your account" onPress={() => requireAccount('Set up your account', () => {})} />
        </Animated.View>
        <View style={{ marginTop: space[6] }}>
          <Row icon={LifeBuoy} label="Help and safety" onPress={() => router.push('/help')} />
        </View>
      </View>
    );
  }

  const myListings = adoptions.filter((a) => a.mine).length;
  return (
    <ScrollView style={{ backgroundColor: color.page }} contentContainerStyle={[styles.screen, { paddingTop: insets.top + space[5], paddingBottom: 130 }]}>
      <PastelBackdrop variant="profile" />
      <Animated.View entering={FadeInDown.duration(350)} style={styles.head}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{account.name[0]?.toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={type.title}>{account.name}</Text>
          <Text style={type.caption}>{account.email}</Text>
          <Text style={type.caption}>{mobileLabel(account.mobile)}</Text>
        </View>
      </Animated.View>

      {/* Responsible Reporter ✓ appears here only when the platform has verified the user (D82). */}

      <Card delay={110}>
        <Text style={[type.section, { marginBottom: space[3] }]}>Your impact</Text>
        <View style={styles.impact}>
          <Stat n={reportedIds.length} label="Cases reported" tone="sky" />
          <Stat n={transportedIds.length} label="Taken to care" tone="green" />
          <Stat n={myListings} label="Adoption listings" tone="lavender" />
          <Stat n={donations.length} label="Food donations" tone="butter" />
        </View>
      </Card>

      <Animated.View entering={FadeInDown.delay(160)} style={styles.list}>
        <Row icon={ClipboardList} label="My reports" tone="sky" onPress={() => router.push('/my-reports')} />
        <Row icon={PawPrint} label="My adoption listings" tone="lavender" onPress={() => router.push('/my-adoptions')} />
        <Row icon={FoodPacketIcon} label="My food donations" tone="butter" onPress={() => router.push('/my-donations')} />
        <Row icon={Bell} label="Notification settings" tone="aqua" onPress={() => router.push('/help')} />
        <Row icon={LifeBuoy} label="Help and safety" tone="mint" onPress={() => router.push('/help')} />
        <Row icon={Lock} label="Privacy" tone="sky" onPress={() => router.push('/help')} />
        <Row icon={FileText} label="Terms" tone="lavender" onPress={() => router.push('/help')} />
        <Row icon={LogOut} label="Log out" onPress={signOut} last />
      </Animated.View>
      <Text style={[type.caption, { textAlign: 'center', marginTop: space[4] }]}>
        <HandHeart size={12} color={color.inkMuted} /> Portfolio prototype · all cases and organisations are fictional
      </Text>
    </ScrollView>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone: PastelName }) {
  const p = pastel[tone];
  return (
    <View style={[styles.stat, { backgroundColor: p.bg }]}>
      <Text style={[styles.statN, { color: p.ink }]}>{n}</Text>
      <Text style={[type.caption, { color: p.ink }]}>{label}</Text>
    </View>
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
  screen: { paddingHorizontal: space[5], gap: space[4], backgroundColor: color.page, flexGrow: 1 },
  bigIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: pastel.lavender.bg, alignItems: 'center', justifyContent: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: pastel.lavender.soft, borderWidth: 3, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(91, 69, 196, 0.18)' },
  avatarText: { fontFamily: font.extrabold, fontSize: 26, color: pastel.lavender.ink },
  tick: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  impact: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  stat: { flexBasis: '47%', flexGrow: 1, backgroundColor: color.page, borderRadius: radius.md, padding: space[3] },
  statN: { fontFamily: font.extrabold, fontSize: 24, color: color.ink },
  list: { backgroundColor: color.surface, borderRadius: radius.md, paddingHorizontal: space[4], ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 56 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: color.line },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
});
