import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  Check, CircleCheck, Hospital as HospitalIcon, Lock, Map as MapIcon, MapPin, MessageCircle, Navigation, Phone,
  ShieldCheck, Smartphone, Square, SquareCheck, type LucideIcon,
} from 'lucide-react-native';
import { isProfessionalActive } from '@animal/shared';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, FadeSlide, PressableScale, ScreenHeader, SheetDialog, StatusChip, Tag } from '@/src/ui';
import { distanceLabel, mobileLabel, useCase, useStore } from '@/src/store';
import { DEMO_CALL, problemText } from '@/src/actions';
import { HOSPITALS, type Hospital } from '@/src/data';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';

type Step = 'go' | 'at' | 'transport' | 'nav2';

const STAGES = ['Go to the animal', 'At the animal', 'Arrange transport', 'To the hospital'] as const;
const STAGE_OF: Record<Step, number> = { go: 0, at: 1, transport: 2, nav2: 3 };

/**
 * Community responder flow (wireframes/02). Only "Start transport" changes the
 * status, and only from Looking for help. N10 (can't continue, handover) is deferred.
 * Layout per step: step tracker → animal card → step card → actions pinned at the bottom.
 */
export default function Respond() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useCase(id);
  const insets = useSafeAreaInsets();
  const { account, startTransport, markArrived, showToast } = useStore();
  const [step, setStep] = useState<Step>('go');
  const [notAble, setNotAble] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [informed, setInformed] = useState(false);
  const [arrived, setArrived] = useState(false);

  if (!c) return null;
  const pro = isProfessionalActive(c);
  const maps = () => showToast('Opens your maps app (demo)');
  const stage = STAGE_OF[step];
  const done = step === 'nav2' && c.status === 'AT_HOSPITAL';

  // ---- step content + pinned actions ----
  let body: ReactNode = null;
  let footer: ReactNode = null;

  if (step === 'go') {
    body = (
      <>
        <View style={styles.safetyCard}>
          <View style={styles.safetyHead}>
            <ShieldCheck size={18} color={color.successInk} />
            <Text style={[type.section, { fontSize: 15 }]}>Before you go</Text>
          </View>
          <Bullet text="Only approach if it is safe for you and the animal." />
          <Bullet text="Injured or frightened animals may behave unpredictably. Keep a calm distance." />
          <Bullet text="If it feels unsafe, wait for a trained rescuer." />
          <Button label="Read Help and safety" variant="link" onPress={() => router.push('/help')} full={false} style={{ alignSelf: 'flex-start' }} />
        </View>
        <StepCard icon={Navigation} title="Going to the animal">
          {pro ? (
            <Animated.View entering={FadeInDown} style={styles.banner}>
              <Text style={[type.label, { color: color.infoInk }]}>Professional help is on the way. You can continue to the animal and share what you see.</Text>
            </Animated.View>
          ) : null}
          <View style={styles.distanceBox}>
            <Text style={styles.distanceN}>{distanceLabel(c.distanceM)}</Text>
            <Text style={type.label}>away · exact location shared by the reporter</Text>
          </View>
          <InfoRow icon={MapPin} title={c.landmark ?? c.area} sub={c.landmark ? c.area : 'Location from the report'} />
          <Button label="Open in Maps" icon={MapIcon} variant="outline" onPress={maps} />
          <PrivacyNote text="Your location is never shared with anyone." />
        </StepCard>
      </>
    );
    footer = (
      <>
        <Button label="I've reached the animal" icon={MapPin} onPress={() => setStep('at')} />
        <Button label="Not now" variant="outline" onPress={() => router.back()} />
      </>
    );
  }

  if (step === 'at') {
    const open = c.status === 'NEW';
    body = (
      <StepCard icon={CircleCheck} title="You've reached the animal">
        <StatusChip c={c} />
        <Text style={styles.lead}>
          {open
            ? 'No rescue team has accepted yet. Keep a safe distance while you check the animal.'
            : pro
              ? `Professional help is already on the way.${c.organisationName ? ` Accepted by ${c.organisationName}.` : ''} You can share what you see in the case chat.`
              : 'This case is already being handled. You can share what you see in the case chat.'}
        </Text>
        {open ? (
          <View style={styles.question}>
            <HospitalIcon size={20} color={color.action} />
            <Text style={[type.section, { flex: 1, fontSize: 15 }]}>Can you safely take this animal to a veterinary hospital?</Text>
          </View>
        ) : null}
      </StepCard>
    );
    // "Not able to" always has equal weight.
    footer = open ? (
      <View style={{ flexDirection: 'row', gap: space[2] }}>
        <Button label="Yes, I can" onPress={() => setStep('transport')} style={{ flex: 1 }} full={false} />
        <Button label="Not able to" variant="outline" onPress={() => setNotAble(true)} style={{ flex: 1 }} full={false} />
      </View>
    ) : (
      <>
        <Button label="Case chat" icon={MessageCircle} onPress={() => router.push(`/case/chat/${c.id}`)} />
        <Button label="Back to case" variant="outline" onPress={() => router.replace(`/case/${c.id}`)} />
      </>
    );
  }

  if (step === 'transport') {
    body = (
      <StepCard icon={HospitalIcon} title="Arrange transport">
        <Text style={styles.groupLabel}>1 · Your mobile number</Text>
        <View style={styles.mobileRow}>
          <Smartphone size={18} color={color.inkSecondary} />
          <Text style={styles.mobile}>{mobileLabel(account?.mobile)}</Text>
        </View>
        <Text style={type.label}>Your mobile number is required so the veterinary hospital can contact you during transport.</Text>
        <PrivacyNote text="Only the hospital you choose will see it, once you start transport." />
        <View style={styles.divider} />
        <Text style={styles.groupLabel}>2 · Choose a veterinary hospital</Text>
        <View style={{ gap: space[2] }}>
          {HOSPITALS.map((h, i) => {
            const on = hospital?.id === h.id;
            return (
              <Animated.View key={h.id} entering={FadeInDown.delay(i * 60)}>
                <PressableScale onPress={() => { setHospital(h); setInformed(false); }} accessibilityLabel={`Select ${h.name}`} accessibilityRole="radio" accessibilityState={{ selected: on }} style={[styles.hospital, on && styles.checkOn]}>
                  <View style={styles.hIcon}><HospitalIcon size={20} color={color.action} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.section, { fontSize: 14 }]}>{h.name}</Text>
                    <Text style={type.caption}>{h.distanceKm} km · about {h.etaMin} min</Text>
                  </View>
                  <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
                </PressableScale>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.divider} />
        <Text style={styles.groupLabel}>3 · Let the hospital know</Text>
        <Button label="Call hospital" icon={Phone} variant="outline" disabled={!hospital} onPress={() => showToast(DEMO_CALL)} />
        <PressableScale onPress={() => { if (hospital) setInformed((x) => !x); }} accessibilityLabel="I have informed the hospital" accessibilityRole="checkbox" accessibilityState={{ checked: informed, disabled: !hospital }} style={[styles.check, informed && styles.checkOn, !hospital && { opacity: 0.5 }]} scaleTo={0.98}>
          {informed ? <SquareCheck size={22} color={color.action} /> : <Square size={22} color={color.inkMuted} />}
          <Text style={[type.section, { fontFamily: font.semibold, fontSize: 14 }]}>I have informed the hospital</Text>
        </PressableScale>

      </StepCard>
    );
    footer = (
      <>
        <Button label="Confirm and start transport" icon={Navigation} disabled={!hospital || !informed} onPress={() => {
          if (!hospital) return;
          if (c.status !== 'NEW') { setStep('at'); return; }
          startTransport(c.id, hospital.name);
          setStep('nav2');
        }} />
        {!hospital || !informed ? <Text style={[type.caption, { textAlign: 'center' }]}>Choose a hospital and let them know to continue</Text> : null}
      </>
    );
  }

  if (step === 'nav2') {
    if (done) {
      body = (
        <StepCard icon={CircleCheck} tone="success" title="Hospital reached">
          <Text style={styles.lead}>{c.hospitalName} confirmed the animal arrived. Thank you for helping. You&apos;ll get updates as the animal gets care.</Text>
        </StepCard>
      );
      footer = <Button label="View case" onPress={() => router.replace(`/case/${c.id}`)} />;
    } else {
      body = (
        <StepCard icon={Navigation} title={`To ${c.hospitalName}`}>
          <StatusChip c={c} />
          <Button label="Open in Maps" icon={MapIcon} variant="outline" onPress={maps} />
          {arrived ? (
            <Animated.View entering={FadeIn} style={styles.banner}>
              <Text style={[type.label, { color: color.infoInk }]}>Waiting for the hospital to confirm the animal arrived.</Text>
            </Animated.View>
          ) : null}
        </StepCard>
      );
      footer = (
        <>
          {!arrived ? <Button label="I've arrived" icon={MapPin} onPress={() => { setArrived(true); markArrived(c.id); }} /> : null}
          <Button label="Case chat" icon={MessageCircle} variant="link" onPress={() => router.push(`/case/chat/${c.id}`)} />
        </>
      );
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={step === 'nav2' ? 'Taking the animal to hospital' : 'Help this animal'} />
      <StepTracker stage={stage} complete={done} />
      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[3], gap: space[3], paddingBottom: space[6] }} showsVerticalScrollIndicator={false}>
          <View style={styles.caseCard}>
            <AnimalPhoto species={c.species} photo={casePhoto(c)} sensitive={c.sensitive} style={{ width: 56, height: 56, borderRadius: radius.sm }} iconSize={24} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.section, { fontSize: 15 }]} numberOfLines={1}>{c.title}</Text>
              <View style={styles.tags}>
                <Tag label={problemText(c)} tone="info" lines={1} />
                <Tag label={c.area} tone="neutral" icon={MapPin} lines={1} />
              </View>
            </View>
          </View>
          {body}
        </ScrollView>
      </FadeSlide>
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>{footer}</View> : null}

      <SheetDialog visible={notAble} onClose={() => setNotAble(false)}>
        <Text style={type.title}>That&apos;s okay. The case stays open for rescue teams.</Text>
        <Button label="Back to case" onPress={() => { setNotAble(false); router.replace(`/case/${c.id}`); }} />
        <Button label="Case chat" variant="link" onPress={() => { setNotAble(false); router.push(`/case/chat/${c.id}`); }} />
      </SheetDialog>
    </View>
  );
}

/** "Step 2 of 4 · At the animal" with a segmented progress bar. */
function StepTracker({ stage, complete }: { stage: number; complete: boolean }) {
  return (
    <View style={styles.tracker}>
      <View style={styles.trackerText}>
        <Text style={styles.trackerStep}>{complete ? 'Done' : `Step ${stage + 1} of ${STAGES.length}`}</Text>
        <Text style={styles.trackerLabel} numberOfLines={1}>{STAGES[stage]}</Text>
      </View>
      <View style={styles.segments}>
        {STAGES.map((s, i) => <Segment key={s} filled={complete || i <= stage} />)}
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
function StepCard({ icon: Icon, title, tone = 'sky', children }: { icon: LucideIcon; title: string; tone?: 'sky' | 'success'; children: ReactNode }) {
  const t = tone === 'success' ? { bg: color.successTint, fg: color.successInk } : { bg: pastel.sky.bg, fg: color.action };
  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.stepCard}>
      <View style={[styles.stepIcon, { backgroundColor: t.bg }]}><Icon size={22} color={t.fg} strokeWidth={2.1} /></View>
      <Text style={type.title}>{title}</Text>
      {children}
    </Animated.View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot}><Check size={12} color={color.successInk} strokeWidth={3} /></View>
      <Text style={[type.body, { flex: 1, color: color.ink }]}>{text}</Text>
    </View>
  );
}

function InfoRow({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.hIcon}><Icon size={18} color={color.action} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[type.section, { fontSize: 14 }]}>{title}</Text>
        <Text style={type.caption}>{sub}</Text>
      </View>
    </View>
  );
}

function PrivacyNote({ text }: { text: string }) {
  return (
    <View style={styles.privacy}>
      <Lock size={13} color={color.inkMuted} />
      <Text style={[type.caption, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tracker: { paddingHorizontal: space[5], paddingTop: space[1], paddingBottom: space[2], gap: space[2] },
  trackerText: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  trackerStep: { fontFamily: font.bold, fontSize: 12, color: color.action },
  trackerLabel: { flex: 1, fontFamily: font.semibold, fontSize: 12, color: color.inkSecondary },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: color.line, overflow: 'hidden' },
  segmentFill: { backgroundColor: color.action, borderRadius: 3 },
  caseCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: 18, padding: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepCard: { backgroundColor: color.surface, borderRadius: 20, padding: space[5], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  stepIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  lead: { fontFamily: font.regular, fontSize: 15, lineHeight: 22, color: color.ink },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  bulletDot: { width: 20, height: 20, borderRadius: 10, marginTop: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.successTint },
  banner: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[3] },
  distanceBox: { backgroundColor: color.fill, borderRadius: radius.md, padding: space[4], gap: 2 },
  distanceN: { fontFamily: font.extrabold, fontSize: 34, color: color.ink, letterSpacing: -1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  safetyCard: { backgroundColor: color.successTint, borderRadius: 20, padding: space[4], gap: space[3] },
  safetyHead: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  question: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4] },
  groupLabel: { fontFamily: font.bold, fontSize: 13, color: color.inkSecondary, letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: color.line, marginVertical: space[1] },
  mobileRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.fill, borderRadius: radius.md, padding: space[4] },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: color.inkMuted, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: color.action },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: color.action },
  mobile: { fontFamily: font.bold, fontSize: 18, color: color.ink, letterSpacing: 0.3 },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hospital: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], borderWidth: 1, borderColor: color.line },
  hIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  check: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52, paddingHorizontal: space[3], borderRadius: radius.md, borderWidth: 1, borderColor: color.line },
  checkOn: { borderColor: color.primary, backgroundColor: color.surfaceTint },
  footer: { paddingHorizontal: space[5], paddingTop: space[3], gap: space[2], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});
