import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Ellipsis, MapPin, MessageCircle, Navigation, Pause, Phone, Play, Share2, Siren } from 'lucide-react-native';
import { canReporterCancel, canTakeMeToAnimal, isProfessionalActive, statusTone } from '@animal/shared';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, PressableScale, ScreenHeader, SheetDialog, StatusChip } from '@/src/ui';
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
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingBottom: space[8], gap: space[4] }}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / photoW))} scrollEventThrottle={32} style={{ borderRadius: radius.lg }}>
            {Array.from({ length: Math.max(1, c.evidence) }).map((_, i) => (
              <AnimalPhoto key={i} species={c.species} photo={casePhoto(c, i)} sensitive={c.sensitive} revealed={revealed} onReveal={() => setRevealed(true)} iconSize={72} style={{ width: photoW, height: 250, borderRadius: radius.lg }} />
            ))}
          </ScrollView>
          {c.evidence > 1 ? (
            <View style={styles.dots}>
              {Array.from({ length: c.evidence }).map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotOn]} />)}
            </View>
          ) : null}
          {c.noMedia ? <Text style={[type.caption, { marginTop: 6 }]}>No media: the reporter couldn&apos;t capture it safely.</Text> : null}
        </Animated.View>

        {c.voiceNoteSeconds ? <VoiceNote seconds={c.voiceNoteSeconds} /> : null}

        <Animated.View entering={FadeInDown.delay(80).duration(300)} style={{ gap: space[2] }}>
          <StatusChip c={c} />
          <Text style={type.display}>{c.title}</Text>
          <View style={styles.metaRow}>
            <MapPin size={15} color={color.inkSecondary} />
            <Text style={type.label}>{c.landmark ? `${c.landmark}, ` : ''}{c.area} · {distanceLabel(c.distanceM)}</Text>
          </View>
          <Text style={[type.section, { color: color.ink }]}>{problemText(c)}</Text>
          <Text style={type.body}>{c.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(300)} style={[styles.actionCard, { borderColor: tone.bg }]}>
          <StatusMessage />
          {c.status === 'NEW' ? <Button label="Take me to the animal" icon={Navigation} onPress={takeMe} /> : null}
          {isProfessionalActive(c) && canTakeMeToAnimal(c) ? <Button label="Take me to the animal (navigation only)" variant="outline" icon={Navigation} onPress={takeMe} /> : null}
          {mine && (c.status === 'ACCEPTED' || c.status === 'ON_THE_WAY') ? <Button label="Call the organisation" variant="link" icon={Phone} onPress={() => showToast(DEMO_CALL)} /> : null}
        </Animated.View>

        <View style={{ flexDirection: 'row', gap: space[2] }}>
          <Button label="Share" icon={Share2} variant="outline" onPress={() => shareCase(c, showToast)} style={{ flex: 1 }} full={false} />
          <Button label="Case chat" icon={MessageCircle} variant="quiet" onPress={() => router.push(`/case/chat/${c.id}`)} style={{ flex: 1 }} full={false} />
        </View>

        {official ? (
          <Animated.View entering={FadeInDown.delay(180)} style={styles.official}>
            <Text style={styles.officialLabel}>OFFICIAL UPDATE · {official.orgName?.toUpperCase()}</Text>
            <Text style={[type.label, { color: color.ink }]}>{official.text}</Text>
          </Animated.View>
        ) : null}

        <View style={{ gap: space[3] }}>
          <Text style={type.section}>Case history</Text>
          {c.events.map((e, i) => (
            <Animated.View key={`${e.at}-${i}`} entering={FadeInDown.delay(200 + i * 40)} style={styles.event}>
              <View style={[styles.eventDot, i === c.events.length - 1 && { backgroundColor: tone.marker }]} />
              <Text style={[type.label, { flex: 1, color: color.ink }]}>{e.label}</Text>
              <Text style={type.caption}>{timeAgo(e.at)}</Text>
            </Animated.View>
          ))}
        </View>
        <Text style={[type.caption, { color: color.inkMuted }]}>Case {c.id}</Text>
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
    let head = '';
    let body = '';
    if (c.deathReportedPending) { head = 'Passed away — awaiting confirmation'; body = 'Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm.'; }
    else switch (c.status) {
      case 'NEW': head = 'This animal needs help'; body = 'No rescue team has accepted yet. If it’s safe for you, you can go to the animal.'; break;
      case 'ACCEPTED': head = 'Professional help is on the way'; body = `Accepted by ${c.organisationName}. You can still share useful information.`; break;
      case 'ON_THE_WAY': head = `Help is approximately ${c.etaMinutes} min away`; body = `${c.organisationName} is on the way.`; break;
      case 'ON_SITE': head = 'The rescue team is with the animal'; break;
      case 'TO_HOSPITAL': head = 'The rescue team is taking the animal to hospital'; break;
      case 'RESPONDER_TO_HOSPITAL': head = 'This animal is being taken to a veterinary hospital'; body = c.hospitalName ? `To: ${c.hospitalName}` : ''; break;
      case 'AT_HOSPITAL': head = `The animal arrived at ${c.hospitalName ?? 'the hospital'}`; break;
      case 'IN_CARE': head = 'Under treatment'; break;
      case 'CLOSED': head = c.outcome === 'not_found' ? 'The team couldn’t find this animal' : 'This case is closed'; body = c.outcome === 'not_found' ? 'If you see it, share where in the case chat.' : 'Thank you for stopping to help.'; break;
      case 'CANCELLED': head = 'This report was cancelled'; body = 'Rescue teams are no longer being alerted.'; break;
    }
    return (
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {c.status === 'NEW' ? <Siren size={18} color={color.urgent} /> : null}
          <Text style={[type.section, c.status === 'NEW' && { color: color.urgent }]}>{head}</Text>
        </View>
        {body ? <Text style={type.label}>{body}</Text> : null}
        <Text style={type.caption}>Reported {timeAgo(c.reportedAt)}</Text>
      </View>
    );
  }
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
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space[2] },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.line },
  dotOn: { width: 18, backgroundColor: color.primary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCard: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: space[3], borderWidth: 1.5, ...shadow.card },
  official: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4], gap: 4 },
  officialLabel: { fontFamily: font.extrabold, fontSize: 11, letterSpacing: 0.6, color: color.infoInk },
  event: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  eventDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.line },
  voice: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.pill, padding: 6, paddingRight: space[4], ...shadow.card },
  play: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.action, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: color.surfaceTint, overflow: 'hidden' },
  trackFill: { height: 6, backgroundColor: color.primary },
});
