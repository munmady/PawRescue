import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  Building2, Check, CircleCheck, Hospital as HospitalIcon, Map as MapIcon, MapPin, MessageCircle, Navigation, Phone, ShieldCheck, Square, SquareCheck,
} from 'lucide-react-native';
import { isProfessionalActive } from '@animal/shared';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Button, FadeSlide, PressableScale, ScreenHeader, SheetDialog, StatusChip } from '@/src/ui';
import { distanceLabel, mobileLabel, useCase, useStore } from '@/src/store';
import { DEMO_CALL, problemText } from '@/src/actions';
import { HOSPITALS, type Hospital } from '@/src/data';
import { color, font, radius, shadow, space, type } from '@/src/theme';

type Step = 'safety' | 'nav1' | 'check' | 'decision' | 'mobile' | 'hospital' | 'inform' | 'nav2';

/**
 * Community responder flow (wireframes/02). Only "Start transport" changes the
 * status, and only from Looking for help. N10 (can't continue, handover) is deferred.
 */
export default function Respond() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useCase(id);
  const insets = useSafeAreaInsets();
  const { account, startTransport, markArrived, showToast } = useStore();
  const [step, setStep] = useState<Step>('safety');
  const [notAble, setNotAble] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [informed, setInformed] = useState(false);
  const [arrived, setArrived] = useState(false);

  if (!c) return null;
  const pro = isProfessionalActive(c);
  const maps = () => showToast('Opens your maps app (demo)');

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={step === 'nav2' ? 'Taking the animal to hospital' : 'Help this animal'} />
      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ padding: space[5], gap: space[4], paddingBottom: space[8] }}>
          {step !== 'safety' ? (
            <View style={styles.caseCard}>
              <AnimalPhoto species={c.species} photo={casePhoto(c)} sensitive={c.sensitive} style={{ width: 64, height: 64 }} iconSize={28} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={type.section}>{c.title}</Text>
                <Text style={type.caption}>{problemText(c)}</Text>
                <Text style={type.caption}>{c.landmark ? `${c.landmark}, ` : ''}{c.area}</Text>
              </View>
            </View>
          ) : null}

          {step === 'safety' ? (
            <View style={{ gap: space[4] }}>
              <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.bigIcon}><ShieldCheck size={36} color={color.action} /></Animated.View>
              <Text style={type.display}>Before you go</Text>
              <Text style={[type.body, { color: color.ink }]}>Please only approach if it is safe for you and the animal. Injured or frightened animals may behave unpredictably. If the situation is unsafe, wait for a trained rescuer.</Text>
              <Button label="I can safely help" onPress={() => setStep('nav1')} />
              <Button label="Not now" variant="outline" onPress={() => router.back()} />
              <Button label="Read Help and safety" variant="link" onPress={() => router.push('/help')} />
            </View>
          ) : null}

          {step === 'nav1' ? (
            <View style={{ gap: space[4] }}>
              {pro ? (
                <Animated.View entering={FadeInDown} style={styles.banner}>
                  <Text style={[type.label, { color: color.infoInk }]}>Professional help is on the way. You can continue to the animal and share what you see.</Text>
                </Animated.View>
              ) : null}
              <Text style={type.display}>Going to the animal</Text>
              <View style={styles.distance}>
                <Text style={styles.distanceN}>{distanceLabel(c.distanceM)}</Text>
                <Text style={type.label}>away · exact location shared by the reporter</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}>
                <Text style={type.caption}>Status</Text><StatusChip c={c} size="sm" />
              </View>
              <Button label="Open in Maps" icon={MapIcon} variant="outline" onPress={maps} />
              <Button label="I've reached the animal" icon={MapPin} onPress={() => setStep('check')} />
              <Button label="Case chat" icon={MessageCircle} variant="link" onPress={() => router.push(`/case/chat/${c.id}`)} />
              <Text style={type.caption}>Your location is never shared with anyone.</Text>
            </View>
          ) : null}

          {step === 'check' ? (
            c.status === 'NEW' ? (
              <View style={{ gap: space[4] }}>
                <Text style={type.display}>You&apos;ve reached the animal</Text>
                <StatusChip c={c} />
                <Text style={type.body}>No rescue team has accepted yet. Keep a safe distance while you check the animal.</Text>
                <Button label="Continue" onPress={() => setStep('decision')} />
              </View>
            ) : (
              <View style={{ gap: space[4] }}>
                <Text style={type.display}>You&apos;ve reached the animal</Text>
                <StatusChip c={c} />
                <Text style={type.body}>
                  {pro ? `Professional help is already on the way.${c.organisationName ? ` Accepted by ${c.organisationName}.` : ''} You can share what you see in the case chat.` : 'This case is already being handled. You can share what you see in the case chat.'}
                </Text>
                <Button label="Case chat" icon={MessageCircle} onPress={() => router.push(`/case/chat/${c.id}`)} />
                <Button label="Back to case" variant="outline" onPress={() => router.replace(`/case/${c.id}`)} />
              </View>
            )
          ) : null}

          {step === 'decision' ? (
            <View style={{ gap: space[4] }}>
              <Text style={type.display}>Can you safely take this animal to a veterinary hospital?</Text>
              <Text style={type.body}>Only if you&apos;re able and it&apos;s safe for you and the animal.</Text>
              <View style={{ flexDirection: 'row', gap: space[2] }}>
                <Button label="Yes, I can" onPress={() => setStep('mobile')} style={{ flex: 1 }} full={false} />
                <Button label="Not able to" variant="outline" onPress={() => setNotAble(true)} style={{ flex: 1 }} full={false} />
              </View>
            </View>
          ) : null}

          {step === 'mobile' ? (
            <View style={{ gap: space[4] }}>
              <Text style={type.display}>Your mobile number</Text>
              <View style={styles.readonly}>
                <Text style={[type.section, { fontFamily: font.bold }]}>{mobileLabel(account?.mobile)}</Text>
              </View>
              <Text style={[type.body, { color: color.ink }]}>Your mobile number is required so the veterinary hospital can contact you during transport.</Text>
              <Text style={type.caption}>Only the hospital you choose will see it, once you start transport.</Text>
              <Button label="Confirm and continue" icon={Check} onPress={() => setStep('hospital')} />
            </View>
          ) : null}

          {step === 'hospital' ? (
            <View style={{ gap: space[3] }}>
              <Text style={type.display}>Choose a veterinary hospital</Text>
              <Text style={type.label}>Registered veterinary hospitals near you</Text>
              {HOSPITALS.map((h, i) => (
                <Animated.View key={h.id} entering={FadeInDown.delay(i * 60)}>
                  <PressableScale onPress={() => { setHospital(h); setStep('inform'); }} accessibilityLabel={`Select ${h.name}`} style={styles.hospital}>
                    <View style={styles.hIcon}><HospitalIcon size={20} color={color.action} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={type.section}>{h.name}</Text>
                      <Text style={type.caption}>{h.distanceKm} km · about {h.etaMin} min</Text>
                    </View>
                    <Text style={styles.select}>Select</Text>
                  </PressableScale>
                </Animated.View>
              ))}
            </View>
          ) : null}

          {step === 'inform' && hospital ? (
            <View style={{ gap: space[4] }}>
              <Text style={type.label}>You&apos;re taking this animal to:</Text>
              <View style={styles.hospital}>
                <View style={styles.hIcon}><Building2 size={20} color={color.action} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={type.section}>{hospital.name}</Text>
                  <Text style={type.caption}>{hospital.distanceKm} km · about {hospital.etaMin} min</Text>
                </View>
              </View>
              <Button label="Call hospital" icon={Phone} variant="outline" onPress={() => showToast(DEMO_CALL)} />
              <PressableScale onPress={() => setInformed((x) => !x)} accessibilityLabel="I have informed the hospital" style={styles.check} scaleTo={0.98}>
                {informed ? <SquareCheck size={22} color={color.action} /> : <Square size={22} color={color.inkMuted} />}
                <Text style={[type.section, { fontFamily: font.semibold }]}>I have informed the hospital</Text>
              </PressableScale>
              <Button label="Start transport" icon={Navigation} disabled={!informed} onPress={() => {
                if (c.status !== 'NEW') { setStep('check'); return; }
                startTransport(c.id, hospital.name);
                setStep('nav2');
              }} />
            </View>
          ) : null}

          {step === 'nav2' ? (
            c.status === 'AT_HOSPITAL' ? (
              <View style={{ gap: space[4], alignItems: 'flex-start' }}>
                <Animated.View entering={ZoomIn.springify().damping(11)} style={[styles.bigIcon, { backgroundColor: color.successTint }]}><CircleCheck size={40} color={color.successInk} /></Animated.View>
                <Text style={type.display}>Hospital reached</Text>
                <Text style={type.body}>{c.hospitalName} confirmed the animal arrived. Thank you for helping. You&apos;ll get updates as the animal gets care.</Text>
                <Button label="View case" onPress={() => router.replace(`/case/${c.id}`)} />
              </View>
            ) : (
              <View style={{ gap: space[4] }}>
                <StatusChip c={c} />
                <Text style={type.display}>To {c.hospitalName}</Text>
                <Button label="Open in Maps" icon={MapIcon} variant="outline" onPress={maps} />
                {arrived ? (
                  <Animated.View entering={FadeIn} style={styles.banner}>
                    <Text style={[type.label, { color: color.infoInk }]}>Waiting for the hospital to confirm the animal arrived.</Text>
                  </Animated.View>
                ) : (
                  <Button label="I've arrived" icon={MapPin} onPress={() => { setArrived(true); markArrived(c.id); }} />
                )}
                <Button label="Case chat" icon={MessageCircle} variant="link" onPress={() => router.push(`/case/chat/${c.id}`)} />
              </View>
            )
          ) : null}
        </ScrollView>
      </FadeSlide>

      <SheetDialog visible={notAble} onClose={() => setNotAble(false)}>
        <Text style={type.title}>That&apos;s okay. The case stays open for rescue teams.</Text>
        <Button label="Back to case" onPress={() => { setNotAble(false); router.replace(`/case/${c.id}`); }} />
        <Button label="Case chat" variant="link" onPress={() => { setNotAble(false); router.push(`/case/chat/${c.id}`); }} />
      </SheetDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  caseCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], ...shadow.card },
  bigIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  banner: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4] },
  distance: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], flexWrap: 'wrap' },
  distanceN: { fontFamily: font.extrabold, fontSize: 40, color: color.ink, letterSpacing: -1 },
  readonly: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4] },
  hospital: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], ...shadow.card },
  hIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  select: { fontFamily: font.bold, fontSize: 14, color: color.action },
  check: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 48 },
});
