import { useMemo, useState, type ComponentType } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeIn, FadeInDown, FadeOut, SlideInDown, SlideOutDown, useAnimatedStyle, useReducedMotion, withSpring, withTiming,
} from 'react-native-reanimated';
import {
  ArrowUpRight, ChevronRight, LifeBuoy, List, LocateFixed, Map as MapIcon, MapPin, Navigation, PawPrint, Share2, Stethoscope, X, type LucideIcon,
} from 'lucide-react-native';
import { canTakeMeToAnimal, isProfessionalActive, isVisibleOnHome, primaryAction, statusTone } from '@animal/shared';
import { MapCanvas } from '@/src/MapCanvas';
import { AnimalFacesIcon } from '@/src/AnimalFacesIcon';
import { FoodPacketIcon } from '@/src/FoodPacketIcon';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, PressableScale, StatusChip } from '@/src/ui';
import { distanceLabel, timeAgo, useStore } from '@/src/store';
import { problemText, shareCase } from '@/src/actions';
import { ORGANISATIONS, type Case } from '@/src/data';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';
import { GradientFill, PastelBackdrop } from '@/src/PastelBackdrop';

type View_ = 'map' | 'list';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { cases, requireAccount, showToast } = useStore();
  const [view, setView] = useState<View_>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const now = Date.now();
  // The map keeps a real height on short screens; the tiles scroll below it.
  const { height: winH } = useWindowDimensions();
  const mapHeight = Math.max(340, Math.round(winH * 0.52));

  // One dataset for Map and List (D49, D83, D84).
  const visible = useMemo(
    () => cases.filter((c) => isVisibleOnHome(c, now)).sort((a, b) => (a.status === 'NEW' ? 0 : 1) - (b.status === 'NEW' ? 0 : 1) || a.distanceM - b.distanceM),
    [cases, now],
  );
  const selected = visible.find((c) => c.id === selectedId) ?? null;
  const needHelp = visible.filter((c) => c.status === 'NEW').length;

  const report = () => requireAccount('Sign in to report', () => router.push('/report'));
  const takeMe = (c: Case) => requireAccount('Sign in to help this animal', () => router.push(`/respond/${c.id}`));
  const open = (c: Case) => router.push(`/case/${c.id}`);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space[2] }]}>
      <PastelBackdrop variant="home" />
      <Animated.View entering={FadeIn.duration(400)} style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={type.display}>Animals near you</Text>
          <View style={styles.locRow}>
            <LocateFixed size={15} color={color.action} />
            <Text style={type.label}>Near Andheri East · within 5 km</Text>
          </View>
        </View>
        <View style={styles.demo}><Text style={styles.demoText}>Demo</Text></View>
      </Animated.View>

      <Toggle value={view} count={visible.length} onChange={(v) => { setView(v); setSelectedId(null); }} />

      {view === 'map' ? (
        <View style={{ flex: 1 }}>
          <ScrollView scrollEnabled={!selected} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.mapWrap, { height: selected ? undefined : mapHeight, flex: selected ? 1 : undefined }]}>
            <MapCanvas cases={visible} selectedId={selectedId} onSelect={setSelectedId} onBackgroundPress={() => setSelectedId(null)} />
            {visible.length === 0 ? <EmptyOverlay /> : (
              <Animated.View entering={FadeInDown.delay(250)} style={styles.countPill}>
                <View style={[styles.countDot, { backgroundColor: color.coral }]} />
                <Text style={styles.countText}>
                  {needHelp > 0 ? `${needHelp} need help now` : 'No one waiting for help'} · {visible.length} active nearby
                </Text>
              </Animated.View>
            )}
          </View>
          {!selected ? (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)} style={styles.mapFooter}>
              <ReportCta onPress={report} />
              <SecondaryBento compact />
            </Animated.View>
          ) : null}
          </ScrollView>
          {selected ? (
            <CaseSheet
              key={selected.id}
              c={selected}
              onClose={() => setSelectedId(null)}
              onTakeMe={() => takeMe(selected)}
              onView={() => open(selected)}
              onShare={() => shareCase(selected, showToast)}
            />
          ) : null}
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: space[5], gap: space[3] }} showsVerticalScrollIndicator={false}>
          <ReportCta onPress={report} />
          {visible.length === 0 ? <EmptyList /> : visible.map((c, i) => (
            <CaseRow key={c.id} c={c} i={i} onPress={() => open(c)} onTakeMe={() => takeMe(c)} onShare={() => shareCase(c, showToast)} />
          ))}
          <SecondaryBento />
        </ScrollView>
      )}
    </View>
  );
}

function Toggle({ value, onChange, count }: { value: View_; onChange: (v: View_) => void; count: number }) {
  const [w, setW] = useState(0);
  const reduce = useReducedMotion();
  const thumb = useAnimatedStyle(() => {
    const x = value === 'list' ? 0 : w / 2;
    return { transform: [{ translateX: reduce ? x : withSpring(x, { damping: 18, stiffness: 220, mass: 0.8 }) }] };
  });
  return (
    <View style={styles.toggle} accessibilityRole="tablist" onLayout={(e) => setW(e.nativeEvent.layout.width - 6)}>
      <Animated.View style={[styles.thumb, { width: w / 2 }, thumb]} />
      {(['list', 'map'] as const).map((k) => {
        const Icon = k === 'map' ? MapIcon : List;
        const on = value === k;
        const fg = on ? '#ffffff' : color.inkSecondary;
        return (
          <PressableScale
            key={k}
            onPress={() => onChange(k)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={k === 'map' ? 'Map view' : 'List view'}
            style={styles.toggleItem}
            scaleTo={0.96}
            hitSlop={6}
          >
            <Icon size={15} color={fg} strokeWidth={on ? 2.4 : 2} />
            <Text style={[styles.toggleText, { color: fg }]}>{k === 'map' ? 'Map' : 'List'}</Text>
            {k === 'list' && count > 0 ? (
              <View style={[styles.toggleBadge, on ? styles.toggleBadgeOn : null]}>
                <Text style={[styles.toggleBadgeText, { color: on ? color.ink : color.inkSecondary }]}>{count}</Text>
              </View>
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

function ReportCta({ onPress }: { onPress: () => void }) {
  return <Button label="Report an animal in distress" icon={AnimalFacesIcon} variant="urgent" onPress={onPress} />;
}

/**
 * Secondary areas (D128, D129) as a quiet bento: adoption and food donations get
 * tiles; the directory and Help and safety stay lighter. Never louder than the cases.
 */
function SecondaryBento({ compact }: { compact?: boolean }) {
  const { adoptions, foodRequests } = useStore();
  const available = adoptions.filter((a) => a.status === 'Available').length;
  const open = foodRequests.filter((r) => r.status === 'Open').length;
  const reduce = useReducedMotion();

  const adopt = (
    <BentoTile
      icon={PawPrint}
      tone="peach"
      title="Adopt a pet"
      meta={`${available} waiting for a home`}
      onPress={() => router.push('/adoption')}
      deco={compact ? undefined : PawPrint}
    />
  );
  const vets = (
    <BentoTile icon={Stethoscope} tone="periwinkle" title="Vets and organisations" meta={`${ORGANISATIONS.length} near you`} onPress={() => router.push('/directory')} />
  );
  const help = (
    <BentoTile icon={LifeBuoy} tone="lemon" title="Help and safety" meta="Stay safe while helping" onPress={() => router.push('/help')} />
  );
  const food = (
    <BentoTile
      icon={FoodPacketIcon}
      tone="sage"
      title="Food donations"
      meta={`${open} open request${open === 1 ? '' : 's'}`}
      onPress={() => router.push('/donations')}
    />
  );

  return (
    <Animated.View entering={reduce ? undefined : FadeInDown.delay(120).duration(320)} style={{ gap: space[2] }}>
      {!compact ? <Text style={[type.section, { marginTop: space[3] }]}>More ways to help</Text> : null}
      <View style={styles.bentoRow}>
        <View style={styles.bentoCol}>{adopt}</View>
        <View style={styles.bentoCol}>{food}</View>
      </View>
      <View style={styles.bentoRow}>
        <View style={styles.bentoCol}>{vets}</View>
        <View style={styles.bentoCol}>{help}</View>
      </View>
    </Animated.View>
  );
}

function BentoTile({
  icon: Icon, tone, title, meta, onPress, tall, small, deco: Deco,
}: { icon: LucideIcon | ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; tone: keyof typeof pastel; title: string; meta?: string; onPress: () => void; tall?: boolean; small?: boolean; deco?: LucideIcon }) {
  const p = pastel[tone];
  return (
    <PressableScale onPress={onPress} accessibilityLabel={title} style={[styles.tile, { backgroundColor: p.bg, borderColor: p.soft }, tall && styles.tileTall, small && styles.tileSmall]} scaleTo={0.97}>
      {'grad' in p ? <GradientFill colors={p.grad} id={`tile-${tone}`} /> : null}
      {Deco ? <View style={styles.tileDeco} pointerEvents="none"><Deco size={96} color={p.soft} strokeWidth={1.4} /></View> : null}
      <View style={[styles.tileIcon, small && { width: 32, height: 32, borderRadius: 16 }]}>
        <Icon size={small ? 16 : 20} color={p.ink} strokeWidth={2.1} />
      </View>
      <View style={{ flex: tall || small ? 1 : undefined, minWidth: 0, justifyContent: tall ? 'flex-end' : 'center', gap: 2 }}>
        <Text style={[styles.tileTitle, small && { fontSize: 13.5 }]} numberOfLines={2}>{title}</Text>
        {meta ? <Text style={[type.caption, { color: p.ink }]} numberOfLines={1}>{meta}</Text> : null}
      </View>
      {!small ? <ArrowUpRight size={18} color={p.ink} style={styles.tileArrow} /> : null}
    </PressableScale>
  );
}

function CaseSheet({ c, onClose, onTakeMe, onView, onShare }: { c: Case; onClose: () => void; onTakeMe: () => void; onView: () => void; onShare: () => void }) {
  const [revealed, setRevealed] = useState(!c.sensitive);
  const action = primaryAction(c);
  return (
    <Animated.View entering={SlideInDown.springify().damping(19).stiffness(170)} exiting={SlideOutDown.duration(160)} style={styles.sheet}>
      <View style={styles.grab} />
      <PressableScale onPress={onClose} accessibilityLabel="Close" style={styles.close} scaleTo={0.9}>
        <X size={18} color={color.inkSecondary} />
      </PressableScale>
      <View style={{ flexDirection: 'row', gap: space[3] }}>
        <AnimalPhoto species={c.species} photo={casePhoto(c)} count={c.evidence} sensitive={c.sensitive} revealed={revealed} onReveal={() => setRevealed(true)} style={{ width: 88, height: 88 }} />
        <View style={{ flex: 1, gap: 4, paddingRight: 28 }}>
          <Text style={type.title}>{c.title}</Text>
          <Text style={type.label} numberOfLines={1}>{problemText(c)}</Text>
          <View style={styles.metaRow}>
            <MapPin size={13} color={color.inkSecondary} />
            <Text style={type.caption} numberOfLines={1}>{c.area} · {distanceLabel(c.distanceM)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusRow}>
        <StatusChip c={c} />
        <Text style={type.caption}>{timeAgo(c.reportedAt)}</Text>
      </View>
      <SheetNote c={c} />
      {action === 'take_me' ? (
        <Button label="Take me to the animal" icon={Navigation} onPress={onTakeMe} />
      ) : null}
      <View style={{ flexDirection: 'row', gap: space[2] }}>
        <Button label="View case" variant={action === 'view' ? 'primary' : 'outline'} onPress={onView} style={{ flex: 1 }} full={false} />
        <Button label="Share" icon={Share2} variant="outline" onPress={onShare} style={{ flex: 1 }} full={false} />
      </View>
      {isProfessionalActive(c) && canTakeMeToAnimal(c) ? (
        <Button label="Take me to the animal (navigation only)" variant="link" onPress={onTakeMe} />
      ) : null}
    </Animated.View>
  );
}

function SheetNote({ c }: { c: Case }) {
  let text: string | null = null;
  if (c.deathReportedPending) text = 'Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm.';
  else if (isProfessionalActive(c)) text = 'Professional help is on the way. You can still share useful information.';
  else if (c.status === 'RESPONDER_TO_HOSPITAL') text = `This animal is being taken to a veterinary hospital.${c.hospitalName ? ` To: ${c.hospitalName}` : ''}`;
  else if (c.status === 'ON_SITE') text = 'The rescue team is with the animal.';
  else if (c.status === 'TO_HOSPITAL') text = 'The rescue team is taking the animal to hospital.';
  else if (c.status === 'CLOSED' && c.outcome === 'not_found') text = "The rescue team couldn't find this animal. If you see it, share where in the case chat.";
  if (!text) return null;
  return <Text style={[type.label, { color: color.inkSecondary }]}>{text}</Text>;
}

function CaseRow({ c, i, onPress, onTakeMe, onShare }: { c: Case; i: number; onPress: () => void; onTakeMe: () => void; onShare: () => void }) {
  const reduce = useReducedMotion();
  const urgent = statusTone(c) === 'urgent';
  return (
    <Animated.View entering={reduce ? undefined : FadeInDown.delay(60 + i * 55).duration(320)} style={[styles.row, urgent && styles.rowUrgent]}>
      <PressableScale onPress={onPress} accessibilityLabel={`Open ${c.title}`} style={styles.rowMain} scaleTo={0.985}>
        <AnimalPhoto species={c.species} photo={casePhoto(c)} count={c.evidence} sensitive={c.sensitive} style={{ width: 76, height: 76 }} iconSize={30} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[type.section, { flex: 1 }]} numberOfLines={1}>{c.title}</Text>
            <Text style={styles.dist}>{distanceLabel(c.distanceM)}</Text>
          </View>
          <Text style={type.caption} numberOfLines={1}>{c.area} · {problemText(c)}</Text>
          <View style={{ marginTop: 4 }}><StatusChip c={c} size="sm" /></View>
        </View>
      </PressableScale>
          <View style={styles.rowActions}>
            {primaryAction(c) === 'take_me' ? (
              <PressableScale onPress={onTakeMe} accessibilityLabel="Take me to the animal" style={styles.miniPrimary}>
                <Navigation size={14} color="#fff" />
                <Text style={styles.miniPrimaryText}>Take me to the animal</Text>
              </PressableScale>
            ) : (
              <PressableScale onPress={onPress} accessibilityLabel="View case" style={styles.viewLink} scaleTo={0.95}>
                <Text style={styles.viewLinkText}>View case</Text>
                <ChevronRight size={15} color={color.action} />
              </PressableScale>
            )}
            <PressableScale onPress={onShare} accessibilityLabel="Share" style={styles.shareBtn} scaleTo={0.9}>
              <Share2 size={16} color={color.inkSecondary} />
            </PressableScale>
          </View>
    </Animated.View>
  );
}

function EmptyOverlay() {
  return (
    <View style={styles.emptyOverlay}>
      <Text style={[type.section, { textAlign: 'center' }]}>No animals near you need help right now.</Text>
      <Text style={[type.label, { textAlign: 'center' }]}>There are no active cases within 5 km of you.</Text>
    </View>
  );
}

function EmptyList() {
  return (
    <View style={{ paddingVertical: space[8], gap: space[2] }}>
      <Text style={[type.section, { textAlign: 'center' }]}>No animals near you need help right now.</Text>
      <Text style={[type.label, { textAlign: 'center' }]}>There are no active cases within 5 km of you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.page },
  head: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: space[5], marginBottom: space[3] },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  demo: { backgroundColor: color.amberTint, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  demoText: { fontFamily: font.bold, fontSize: 11, color: color.amberInk, letterSpacing: 0.4 },
  toggle: {
    flexDirection: 'row', marginHorizontal: space[5], marginBottom: space[3], padding: 3, borderRadius: radius.pill,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: color.line,
  },
  thumb: { position: 'absolute', top: 3, left: 3, bottom: 3, borderRadius: radius.pill, backgroundColor: color.ink, boxShadow: '0 2px 6px rgba(47,58,76,0.22)' },
  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 34, flex: 1, minWidth: 140 },
  toggleBadge: { minWidth: 18, height: 16, paddingHorizontal: 5, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef1f5' },
  toggleBadgeOn: { backgroundColor: '#ffffff' },
  toggleBadgeText: { fontFamily: font.extrabold, fontSize: 10 },
  toggleText: { fontFamily: font.bold, fontSize: 13.5, letterSpacing: 0.1 },
  mapWrap: { marginHorizontal: space[4] },
  countPill: { position: 'absolute', top: space[3], alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: color.surface, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, ...shadow.card },
  countDot: { width: 8, height: 8, borderRadius: 4 },
  countText: { fontFamily: font.bold, fontSize: 12.5, color: color.ink },
  mapFooter: { paddingHorizontal: space[5], paddingTop: space[3], paddingBottom: 104, gap: space[2] },
  secRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 4, rowGap: 0 },
  bentoRow: { flexDirection: 'row', gap: space[2] },
  bentoCol: { flex: 1, minWidth: 0 },
  tile: { flex: 1, borderRadius: radius.md, borderWidth: 1, padding: space[3], gap: space[2], overflow: 'hidden', minHeight: 132, boxShadow: '0 6px 18px rgba(110, 130, 170, 0.10)' },
  tileTall: { flex: 1, minHeight: 176, padding: space[4] },
  tileSmall: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingVertical: space[2] },
  tileIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  tileTitle: { fontFamily: font.headingBold, fontSize: 15, lineHeight: 20, color: color.ink },
  tileArrow: { position: 'absolute', top: space[3], right: space[3] },
  tileDeco: { position: 'absolute', right: -18, bottom: -18, opacity: 0.9 },
  secLink: { paddingHorizontal: 8, paddingVertical: 8, minHeight: 36, justifyContent: 'center' },
  secText: { fontFamily: font.semibold, fontSize: 13, color: color.inkSecondary, textDecorationLine: 'underline', textDecorationColor: color.line },
  sheet: { position: 'absolute', left: space[3], right: space[3], bottom: 92, backgroundColor: color.surface, borderRadius: radius.lg, padding: space[5], paddingTop: space[3], gap: space[3], ...shadow.sheet },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: color.line, alignSelf: 'center' },
  close: { position: 'absolute', right: space[3], top: space[3], width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: color.fill, zIndex: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  row: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], ...shadow.card },
  rowMain: { flexDirection: 'row', gap: space[3] },
  rowUrgent: { borderWidth: 1, borderColor: color.urgentTint },
  dist: { fontFamily: font.extrabold, fontSize: 14, color: color.ink },
  rowActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingLeft: 76 + space[3] },
  miniPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: color.action, borderRadius: radius.pill, paddingHorizontal: 14, height: 38 },
  miniPrimaryText: { fontFamily: font.bold, fontSize: 13, color: '#fff' },
  viewLink: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 38 },
  viewLinkText: { fontFamily: font.bold, fontSize: 13, color: color.action },
  shareBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: color.fill },
  emptyOverlay: { position: 'absolute', left: space[5], right: space[5], top: '58%', backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: 4, ...shadow.card },
});
