import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Hospital as HospitalIcon, Map as MapIcon, MapPin, MessageCircle, Navigation, Phone,
  ShieldCheck, Square, SquareCheck, type LucideIcon,
} from 'lucide-react-native';
import { isProfessionalActive } from '@animal/shared';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, FadeSlide, PressableScale, ScreenHeader, SheetDialog, StatusChip, Tag, SelectCheck } from '@/src/ui';
import { distanceLabel, useCase, useStore } from '@/src/store';
import { DEMO_CALL, problemText } from '@/src/actions';
import { HOSPITALS, type Hospital } from '@/src/data';
import { color, font, radius, shadow, space, type } from '@/src/theme';
import { Bullet, Divider, GroupLabel, PrivacyNote, StepCard, StepTracker, stepStyles } from '@/src/StepFlow';

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
  const { startTransport, markArrived, showToast } = useStore();
  const [step, setStep] = useState<Step>('go');
  const [notAble, setNotAble] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [informed, setInformed] = useState(false);
  const [arrived, setArrived] = useState(false);

  if (!c) return null;
  const pro = isProfessionalActive(c);
  const maps = () => showToast('Opens your maps app', { tone: 'demo', sub: 'Demo: maps open on a real phone' });
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
            <ShieldCheck size={16} color={color.successInk} />
            <Text style={[type.section, { fontSize: 14, flex: 1 }]}>Before you go</Text>
            <PressableScale onPress={() => router.push('/help')} accessibilityLabel="Read Help and safety" hitSlop={10} scaleTo={0.95}>
              <Text style={styles.safetyLink}>Safety tips</Text>
            </PressableScale>
          </View>
          <Bullet compact text="Approach only if it's safe for you and the animal." />
          <Bullet compact text="Keep a calm distance. Scared or injured animals can react suddenly." />
          <Bullet compact text="If it feels unsafe, wait for a trained rescuer." />
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
      <StepCard title="You've reached the animal">
        <StatusChip c={c} />
        <Text style={stepStyles.lead}>
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
      <StepCard title="Arrange transport">
        <GroupLabel>1 · Choose a veterinary hospital</GroupLabel>
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
                  <SelectCheck selected={on} />
                </PressableScale>
              </Animated.View>
            );
          })}
        </View>

        <Divider />
        <GroupLabel>2 · Let the hospital know</GroupLabel>
        <Button label="Call hospital" icon={Phone} variant="outline" disabled={!hospital} onPress={() => showToast(DEMO_CALL)} />
        <PressableScale onPress={() => { if (hospital) setInformed((x) => !x); }} accessibilityLabel="I have informed the hospital" accessibilityRole="checkbox" accessibilityState={{ checked: informed, disabled: !hospital }} style={[styles.check, informed && styles.checkOn, !hospital && { opacity: 0.5 }]} scaleTo={0.98}>
          {informed ? <SquareCheck size={22} color={color.action} /> : <Square size={22} color={color.inkMuted} />}
          <Text style={[type.section, { fontFamily: font.semibold, fontSize: 14 }]}>I have informed the hospital</Text>
        </PressableScale>

      </StepCard>
    );
    footer = (
      <>
        <Button label="Start transport" icon={Navigation} disabled={!hospital || !informed} onPress={() => {
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
        <StepCard tone="success" title="Hospital reached">
          <Text style={stepStyles.lead}>{c.hospitalName} confirmed the animal arrived. Thank you for helping. You&apos;ll get updates as the animal gets care.</Text>
        </StepCard>
      );
      footer = <Button label="View case" onPress={() => router.replace(`/case/${c.id}`)} />;
    } else {
      body = (
        <StepCard title={`To ${c.hospitalName}`}>
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
      <StepTracker stages={STAGES} stage={stage} complete={done} />
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
      {footer ? <View style={[stepStyles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>{footer}</View> : null}

      <SheetDialog visible={notAble} onClose={() => setNotAble(false)}>
        <Text style={type.title}>That&apos;s okay. The case stays open for rescue teams.</Text>
        <Button label="Back to case" onPress={() => { setNotAble(false); router.replace(`/case/${c.id}`); }} />
        <Button label="Case chat" variant="link" onPress={() => { setNotAble(false); router.push(`/case/chat/${c.id}`); }} />
      </SheetDialog>
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

const styles = StyleSheet.create({
  caseCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: 18, padding: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  banner: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[3] },
  distanceBox: { backgroundColor: color.fill, borderRadius: radius.md, padding: space[4], gap: 2 },
  distanceN: { fontFamily: font.extrabold, fontSize: 34, color: color.ink, letterSpacing: -1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  safetyCard: { backgroundColor: color.successTint, borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[4], gap: space[2] },
  safetyLink: { fontFamily: font.bold, fontSize: 13, color: color.action, textDecorationLine: 'underline' },
  safetyHead: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  question: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4] },
  hospital: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], borderWidth: 1, borderColor: color.line },
  hIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  check: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52, paddingHorizontal: space[3], borderRadius: radius.md, borderWidth: 1, borderColor: color.line },
  checkOn: { borderColor: color.primary, backgroundColor: color.surfaceTint },
});
