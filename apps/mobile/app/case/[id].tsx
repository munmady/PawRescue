import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { BadgeCheck, Ellipsis, MapPin, MessageCircle, Navigation, Pause, Phone, Play, Share2, type LucideIcon } from 'lucide-react-native';
import { canReporterCancel, canTakeMeToAnimal, isProfessionalActive, statusLabel, statusTone } from '@animal/shared';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, PressableScale, ScreenHeader, SheetDialog, StatusChip, statusIcon } from '@/src/ui';
import { MapCanvas } from '@/src/MapCanvas';
import { distanceLabel, timeAgo, useCase, useStore } from '@/src/store';
import { DEMO_CALL, problemText, shareCase } from '@/src/actions';
import { SEED_USER_ID } from '@/src/data';
import { color, font, radius, shadow, space, toneColors, type } from '@/src/theme';

export default function CaseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useCase(id);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { chats, requireAccount, showToast, reportedIds, transportedIds, cancelReport, reportPassedAway } = useStore();
  const [page, setPage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState<null | 'cancel' | 'passed'>(null);

  if (!c) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <ScreenHeader title="Case" />
        <Text style={[type.body, { padding: space[6] }]}>We couldn&apos;t load this case.</Text>
      </View>
    );
  }

  const mine = c.reporterId === SEED_USER_ID || reportedIds.includes(c.id);
  const transporter = transportedIds.includes(c.id);
  const official = [...chats].reverse().find((m) => m.caseId === c.id && m.official);
  const messageCount = chats.filter((m) => m.caseId === c.id && !m.official).length;
  const photoW = Math.min(width, 440) - space[5] * 2;
  const tone = toneColors[statusTone(c)];
  const takeMe = () => requireAccount('Sign in to help this animal', () => router.push(`/respond/${c.id}`));

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader
        title="Animal in distress"
        right={(mine || transporter) && c.status !== 'CLOSED' && c.status !== 'CANCELLED' ? (
          <PressableScale onPress={() => setMenu(true)} accessibilityLabel="More options" style={styles.iconBtn} scaleTo={0.9}>
            <Ellipsis size={22} color={color.ink} />
          </PressableScale>
        ) : undefined}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingBottom: space[8], gap: space[3] }} showsVerticalScrollIndicator={false}>
        {/* 1 · Evidence */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.gallery}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / photoW))} scrollEventThrottle={32}>
            {Array.from({ length: Math.max(1, c.evidence) }).map((_, i) => (
              <AnimalPhoto key={i} species={c.species} photo={casePhoto(c, i)} sensitive={c.sensitive} revealed={revealed} onReveal={() => setRevealed(true)} iconSize={72} style={{ width: photoW, height: 260, borderRadius: 0 }} />
            ))}
          </ScrollView>
          {c.evidence > 1 ? (
            <View style={styles.dots} pointerEvents="none">
              {Array.from({ length: c.evidence }).map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotOn]} />)}
            </View>
          ) : null}
        </Animated.View>

        {/* 2 · Summary (overlaps the photo slightly) */}
        <Animated.View entering={FadeInDown.delay(60).duration(300)} style={[styles.card, styles.summary]}>
          <StatusChip c={c} />
          <View style={{ gap: 2 }}>
            <Text style={type.display}>{c.title}</Text>
            <Text style={type.caption}>Reported {timeAgo(c.reportedAt)} · Case {c.id}</Text>
          </View>
          <View style={styles.tags}>
            <View style={styles.tag}><Text style={styles.tagText}>{problemText(c)}</Text></View>
            <View style={[styles.tag, styles.tagQuiet]}>
              <MapPin size={13} color={color.inkSecondary} />
              <Text style={[styles.tagText, { color: color.inkSecondary }]}>{c.area} · {distanceLabel(c.distanceM)}</Text>
            </View>
          </View>
          {c.noMedia ? <Text style={type.caption}>No media: the reporter couldn&apos;t capture it safely.</Text> : null}
        </Animated.View>

        {/* 3 · Status and action */}
        <Animated.View entering={FadeInDown.delay(110).duration(300)} style={[styles.card, { borderWidth: 1.5, borderColor: tone.bg }]}>
          <StatusMessage />
          {c.status === 'NEW' ? <Button label="Take me to the animal" icon={Navigation} onPress={takeMe} /> : null}
          {isProfessionalActive(c) && canTakeMeToAnimal(c) ? <Button label="Take me to the animal (navigation only)" variant="outline" icon={Navigation} onPress={takeMe} /> : null}
          {mine && (c.status === 'ACCEPTED' || c.status === 'ON_THE_WAY') ? <Button label="Call the organisation" variant="link" icon={Phone} onPress={() => showToast(DEMO_CALL)} /> : null}
        </Animated.View>

        {/* 4 · Quick actions */}
        <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.quickRow}>
          <QuickTile icon={Share2} label="Share" sub="Send link" onPress={() => shareCase(c, showToast)} />
          <QuickTile icon={MessageCircle} label="Case chat" sub={messageCount ? `${messageCount} message${messageCount === 1 ? '' : 's'}` : 'Start the conversation'} onPress={() => router.push(`/case/chat/${c.id}`)} />
        </Animated.View>

        {/* 5 · What the reporter saw */}
        <Animated.View entering={FadeInDown.delay(190).duration(300)} style={styles.card}>
          <Text style={styles.cardTitle}>What the reporter saw</Text>
          <Text style={[type.body, { color: color.ink }]}>{c.description}</Text>
          {c.voiceNoteSeconds ? <VoiceNote seconds={c.voiceNoteSeconds} /> : null}
        </Animated.View>

        {/* 6 · Location */}
        <Animated.View entering={FadeInDown.delay(230).duration(300)} style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>
          <View style={styles.miniMap} pointerEvents="none">
            {/* Keep the pin fully inside this small map (it's an illustration, not to scale). */}
            <MapCanvas cases={[{ ...c, x: Math.min(82, Math.max(18, c.x)), y: Math.min(85, Math.max(60, c.y)) }]} onSelect={() => {}} />
          </View>
          <View style={styles.addrRow}>
            <View style={styles.addrIcon}><MapPin size={16} color={color.action} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[type.section, { fontSize: 14 }]}>{c.landmark ?? c.area}</Text>
              <Text style={type.caption}>{c.landmark ? `${c.area} · ` : ''}{distanceLabel(c.distanceM)} from you</Text>
            </View>
          </View>
        </Animated.View>

        {/* 7 · Official update */}
        {official ? (
          <Animated.View entering={FadeInDown.delay(260)} style={styles.official}>
            <View style={styles.officialIcon}><BadgeCheck size={16} color={color.infoInk} /></View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.officialLabel}>Official update · {official.orgName}</Text>
              <Text style={[type.label, { color: color.ink }]}>{official.text}</Text>
            </View>
          </Animated.View>
        ) : null}

        {/* 8 · Case history timeline */}
        <Animated.View entering={FadeInDown.delay(290).duration(300)} style={styles.card}>
          <Text style={styles.cardTitle}>Case history</Text>
          <View>
            {[...c.events].reverse().map((e, i, arr) => {
              const latest = i === 0;
              return (
                <View key={`${e.at}-${i}`} style={styles.tlRow}>
                  <View style={styles.tlRail}>
                    <View style={[styles.tlDot, latest && { backgroundColor: tone.marker, borderColor: tone.bg }]} />
                    {i < arr.length - 1 ? <View style={styles.tlLine} /> : null}
                  </View>
                  <View style={styles.tlBody}>
                    <Text style={[type.label, { color: color.ink }, latest && { fontFamily: font.bold }]}>{e.label}</Text>
                    <Text style={type.caption}>{timeAgo(e.at)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <SheetDialog visible={menu} onClose={() => setMenu(false)}>
        {mine && canReporterCancel(c) ? <Button label="Cancel report" variant="outline" onPress={() => { setMenu(false); setConfirm('cancel'); }} /> : null}
        {!c.deathReportedPending ? <Button label="Report that the animal has passed away" variant="outline" onPress={() => { setMenu(false); setConfirm('passed'); }} /> : null}
        <Button label="Close" variant="link" onPress={() => setMenu(false)} />
      </SheetDialog>

      <SheetDialog visible={confirm === 'cancel'} onClose={() => setConfirm(null)}>
        <Text style={type.title}>Cancel this report?</Text>
        <Text style={type.body}>Rescue teams will stop being alerted about this animal. The report stays in your history.</Text>
        <Button label="Cancel report" onPress={() => { cancelReport(c.id); setConfirm(null); }} />
        <Button label="Keep report" variant="outline" onPress={() => setConfirm(null)} />
      </SheetDialog>

      <SheetDialog visible={confirm === 'passed'} onClose={() => setConfirm(null)}>
        <Text style={type.title}>Has the animal passed away?</Text>
        <Text style={type.body}>We&apos;re sorry. We&apos;ll let a veterinary hospital or rescue organisation know so they can confirm it.</Text>
        <Button label="Yes, it has passed away" onPress={() => { reportPassedAway(c.id); setConfirm(null); }} />
        <Button label="Back" variant="outline" onPress={() => setConfirm(null)} />
      </SheetDialog>
    </View>
  );

  function StatusMessage() {
    if (!c) return null;
    // Headline uses the exact status wording from packages/shared (same as the chips on Home).
    const head = c.deathReportedPending ? 'Passed away — awaiting confirmation' : statusLabel(c);
    let body = '';
    if (c.deathReportedPending) body = 'Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm.';
    else switch (c.status) {
      case 'NEW': body = 'No rescue team has accepted yet. If it’s safe for you, you can go to the animal.'; break;
      case 'ACCEPTED': body = 'Professional help is on the way. You can still share useful information in the case chat.'; break;
      case 'ON_THE_WAY': body = `${c.organisationName ?? 'The rescue team'} is on the way.`; break;
      case 'ON_SITE': body = 'The rescue team is with the animal.'; break;
      case 'TO_HOSPITAL': body = 'The rescue team is taking the animal to hospital.'; break;
      case 'RESPONDER_TO_HOSPITAL': body = c.hospitalName ? `A community responder is taking this animal to ${c.hospitalName}.` : 'A community responder is taking this animal to a veterinary hospital.'; break;
      case 'AT_HOSPITAL': body = `The animal arrived at ${c.hospitalName ?? 'the hospital'}.`; break;
      case 'IN_CARE': body = 'The animal is being treated.'; break;
      case 'CLOSED': body = c.outcome === 'not_found' ? 'The team couldn’t find this animal. If you see it, share where in the case chat.' : 'Thank you for stopping to help.'; break;
      case 'CANCELLED': body = 'Rescue teams are no longer being alerted.'; break;
    }
    const StatusIcon = statusIcon(c);
    return (
      <View style={styles.statusRow}>
        <View style={[styles.statusIcon, { backgroundColor: tone.bg }]}><StatusIcon size={18} color={tone.fg} strokeWidth={2.2} /></View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[type.section, { color: c.status === 'NEW' ? color.urgent : color.ink }]}>{head}</Text>
          {body ? <Text style={type.label}>{body}</Text> : null}
        </View>
      </View>
    );
  }
}

function QuickTile({ icon: Icon, label, sub, onPress }: { icon: LucideIcon; label: string; sub: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} style={styles.quick} scaleTo={0.97}>
      <View style={styles.quickIcon}><Icon size={18} color={color.action} /></View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[type.section, { fontSize: 14 }]} numberOfLines={1}>{label}</Text>
        <Text style={type.caption} numberOfLines={1}>{sub}</Text>
      </View>
    </PressableScale>
  );
}

function VoiceNote({ seconds }: { seconds: number }) {
  const [playing, setPlaying] = useState(false);
  const p = useSharedValue(0);
  useEffect(() => {
    if (playing) {
      p.value = 0;
      p.value = withTiming(1, { duration: seconds * 1000, easing: Easing.linear });
      const t = setTimeout(() => setPlaying(false), seconds * 1000);
      return () => clearTimeout(t);
    }
    p.value = withTiming(0, { duration: 200 });
  }, [playing, p, seconds]);
  const bar = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <PressableScale onPress={() => setPlaying((x) => !x)} accessibilityLabel={playing ? 'Pause voice note' : 'Play voice note'} style={styles.voice}>
      <View style={styles.play}>{playing ? <Pause size={16} color="#fff" /> : <Play size={16} color="#fff" />}</View>
      <View style={styles.track}><Animated.View style={[styles.trackFill, bar]} /></View>
      <Text style={type.caption}>0:{String(seconds).padStart(2, '0')}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  gallery: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: color.surfaceTint },
  dots: { position: 'absolute', bottom: 36, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.65)' },
  dotOn: { width: 18, backgroundColor: '#ffffff' },
  card: { backgroundColor: color.surface, borderRadius: 20, padding: space[4], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  summary: { marginTop: -28, marginHorizontal: space[2] },
  cardTitle: { fontFamily: font.headingBold, fontSize: 15, color: color.ink },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: color.surfaceTint },
  tagQuiet: { backgroundColor: color.fill },
  tagText: { fontFamily: font.semibold, fontSize: 12.5, color: color.infoInk },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  statusIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  quickRow: { flexDirection: 'row', gap: space[3] },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: 18, padding: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  quickIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surfaceTint },
  miniMap: { height: 140, borderRadius: radius.md, overflow: 'hidden' },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  addrIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surfaceTint },
  official: { flexDirection: 'row', gap: space[3], backgroundColor: color.surfaceTint, borderRadius: 20, padding: space[4], borderWidth: 1, borderColor: '#cfe7f8' },
  officialIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  officialLabel: { fontFamily: font.bold, fontSize: 12, color: color.infoInk },
  tlRow: { flexDirection: 'row', gap: space[3] },
  tlRail: { width: 14, alignItems: 'center' },
  tlDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3, backgroundColor: color.line, borderWidth: 2, borderColor: '#ffffff' },
  tlLine: { flex: 1, width: 2, backgroundColor: color.line, marginVertical: 2 },
  tlBody: { flex: 1, paddingBottom: space[3], gap: 1 },
  voice: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.fill, borderRadius: radius.pill, padding: 6, paddingRight: space[4] },
  play: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.action, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#dbe8f3', overflow: 'hidden' },
  trackFill: { height: 6, backgroundColor: color.primary },
});
