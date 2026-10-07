import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, type LayoutChangeEvent } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn, FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSpring,
} from 'react-native-reanimated';
import {
  Bell, Camera, Check, ChevronLeft, ChevronRight, CircleCheck, HeartHandshake, ImagePlus, LocateFixed, Lock, MapPin, Mic, Pencil, Square, Trash2, RotateCcw, X, Play,
  ShieldAlert, ShieldCheck, Stethoscope,
} from 'lucide-react-native';
import { PROBLEMS, type ProblemCode, type Species } from '@animal/shared';
import { AnimalPhoto, Button, FadeSlide, Pill, PressableScale, SheetDialog, StatusChip } from '@/src/ui';
import { MapCanvas } from '@/src/MapCanvas';
import { caseTitle } from '@/src/actions';
import { Bullet, Divider, GroupLabel, StepCard, StepTracker, stepStyles } from '@/src/StepFlow';
import { PHOTOS, type PhotoKey } from '@/src/photos';

// SIMULATED DEMO: the camera and gallery hand back these sample photos in turn.
const DEMO_CAPTURES: PhotoKey[] = ['dog-net', 'dog-lying', 'kitten-drain', 'puppy-trapped'];
import { mobileLabel, useStore } from '@/src/store';
import { color, font, radius, shadow, space, type } from '@/src/theme';

type Step = 0 | 1 | 2 | 3 | 4;
const STEP_TITLES = ['Add evidence', "What's wrong?", 'Where is it?', 'Review and send'] as const;

export default function Report() {
  const insets = useSafeAreaInsets();
  const { account, submitReport, cases } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [media, setMedia] = useState<{ id: number; kind: 'photo' | 'video'; photo: PhotoKey }[]>([]);
  const [noMedia, setNoMedia] = useState(false);
  const [species, setSpecies] = useState<Species | null>(null);
  const [problems, setProblems] = useState<ProblemCode[]>([]);
  const [details, setDetails] = useState('');
  const [voice, setVoice] = useState<number | null>(null);
  const [located, setLocated] = useState(false);
  const [landmark, setLandmark] = useState('');
  const [sheet, setSheet] = useState<null | 'safety' | 'discard' | 'duplicate'>(null);
  const [newId, setNewId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  // Once the review step has been reached, editing a section returns straight to it.
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => { if (step === 3) setReviewed(true); }, [step]);

  const close = () => (media.length || noMedia) && step < 4 ? setSheet('discard') : router.back();
  const back = () => (step > 0 && step < 4 ? setStep((s) => (s - 1) as Step) : close());
  const canContinue = [media.length > 0 || noMedia, !!species && problems.length > 0, located, true][step] ?? true;

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      const dup = species === 'dog' && problems.includes('hit_by_vehicle') && cases.some((c) => c.id === 'AR-10245' && c.status !== 'CLOSED');
      if (dup) setSheet('duplicate');
      else finish();
    }, 900);
  };
  const finish = () => {
    const id = submitReport({
      species: species ?? 'other', problems, description: details, area: 'Andheri East', landmark: landmark || 'Near Hill Road',
      evidence: media.length, photos: media.map((m) => m.photo), voiceNoteSeconds: voice ?? undefined, noMedia,
    });
    setNewId(id);
    setSheet(null);
    setStep(4);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {step < 4 ? (
        <>
          <View style={styles.top}>
            <PressableScale onPress={back} accessibilityLabel={step === 0 ? 'Close' : 'Back'} style={styles.iconBtn} scaleTo={0.9}>
              {step === 0 ? <X size={22} color={color.ink} /> : <ChevronLeft size={24} color={color.ink} />}
            </PressableScale>
            <Text style={styles.topTitle}>Report an animal</Text>
            <View style={{ width: 44 }} />
          </View>
          <StepTracker stages={STEP_TITLES} stage={step} />
        </>
      ) : null}

      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[3], gap: space[3], paddingBottom: 140 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <StepCard icon={Camera} title="Add photos or videos">
              <Text style={stepStyles.lead}>Add 1 to 4 photos or videos. Stay safe and keep your distance.</Text>
              <View style={styles.addRow}>
                <PressableScale onPress={() => { setNoMedia(false); setMedia((x) => [...x, { id: Date.now(), kind: 'photo', photo: DEMO_CAPTURES[x.length % DEMO_CAPTURES.length] }]); }} accessibilityLabel="Take a photo" disabled={media.length >= 4} style={[styles.addTile, media.length >= 4 && { opacity: 0.4 }]}>
                  <Camera size={22} color={color.action} />
                  <Text style={styles.addText}>Camera</Text>
                </PressableScale>
                <PressableScale onPress={() => { setNoMedia(false); setMedia((x) => [...x, { id: Date.now(), kind: x.length % 2 ? 'video' : 'photo', photo: DEMO_CAPTURES[x.length % DEMO_CAPTURES.length] }]); }} accessibilityLabel="Choose from gallery" disabled={media.length >= 4} style={[styles.addTile, media.length >= 4 && { opacity: 0.4 }]}>
                  <ImagePlus size={22} color={color.action} />
                  <Text style={styles.addText}>Gallery</Text>
                </PressableScale>
              </View>
              {media.length ? (
                <View style={styles.tray}>
                  {media.map((m) => (
                    <Animated.View key={m.id} entering={ZoomIn.springify().damping(14)} style={styles.thumb}>
                      <AnimalPhoto species="dog" photo={PHOTOS[m.photo]} style={StyleSheet.absoluteFill} iconSize={28} />
                      {m.kind === 'video' ? <View style={styles.videoTag}><Play size={10} color="#fff" /><Text style={styles.videoText}>0:12</Text></View> : null}
                      <PressableScale onPress={() => setMedia((x) => x.filter((y) => y.id !== m.id))} accessibilityLabel="Remove" style={styles.remove} scaleTo={0.85}>
                        <X size={14} color={color.ink} />
                      </PressableScale>
                    </Animated.View>
                  ))}
                </View>
              ) : null}
              <Text style={type.caption}>{media.length} / 4{media.length === 4 ? ' · Maximum reached. Remove one to add another.' : ''}</Text>
              <Divider />
              {noMedia ? (
                <Animated.View entering={FadeIn} style={styles.note}>
                  <ShieldAlert size={18} color={color.amberInk} />
                  <Text style={[type.label, { color: color.amberInk, flex: 1 }]}>No media: you couldn&apos;t capture it safely. Details and an exact location will help the team most.</Text>
                </Animated.View>
              ) : (
                <PressableScale onPress={() => setSheet('safety')} accessibilityLabel="I can't safely take a photo or video" style={styles.safeRow} scaleTo={0.98}>
                  <ShieldAlert size={18} color={color.inkSecondary} />
                  <Text style={[type.label, { flex: 1, color: color.ink }]}>I can&apos;t safely take a photo or video</Text>
                  <ChevronRight size={18} color={color.inkMuted} />
                </PressableScale>
              )}
            </StepCard>
          ) : null}

          {step === 1 ? (
            <StepCard icon={Stethoscope} title="What's wrong?">
              <GroupLabel>Which animal?</GroupLabel>
              <View style={styles.wrap}>
                {(['dog', 'cat', 'other'] as Species[]).map((s) => (
                  <Pill key={s} label={s === 'dog' ? 'Dog' : s === 'cat' ? 'Cat' : 'Other'} selected={species === s} onPress={() => setSpecies(s)} />
                ))}
              </View>
              <Divider />
              <GroupLabel>What&apos;s wrong? Pick any that fit.</GroupLabel>
              <View style={styles.wrap}>
                {PROBLEMS.map((p) => (
                  <Pill key={p.code} label={p.label} selected={problems.includes(p.code)}
                    onPress={() => setProblems((x) => (x.includes(p.code) ? x.filter((y) => y !== p.code) : [...x, p.code]))} />
                ))}
              </View>
              <Divider />
              <GroupLabel optional>Tell us what you saw</GroupLabel>
              <Text style={type.label}>Add any details that may help the rescue team.</Text>
              <Composer text={details} setText={setDetails} voice={voice} setVoice={setVoice} />
              {noMedia ? <Text style={type.caption}>Without a photo or video, details here help the team most.</Text> : null}
            </StepCard>
          ) : null}

          {step === 2 ? (
            <StepCard icon={MapPin} title="Where is it?">
              <Text style={stepStyles.lead}>Tap the map to drop the pin where the animal is.</Text>
              <View style={styles.miniMap}>
                <MapCanvas cases={[]} onSelect={() => {}} onBackgroundPress={() => setLocated(true)} />
                <DropPin show={located} />
              </View>
              {located ? (
                <Animated.View entering={FadeInDown} style={styles.addr}>
                  <View style={styles.addrIcon}><MapPin size={16} color={color.action} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.section, { fontSize: 14 }]}>Near Hill Road, Andheri East</Text>
                    <Text style={type.caption}>Pin set</Text>
                  </View>
                  <Check size={18} color={color.successInk} />
                </Animated.View>
              ) : (
                <Button label="Use current location" icon={LocateFixed} variant="outline" onPress={() => setLocated(true)} />
              )}
              <Divider />
              <GroupLabel optional>Landmark</GroupLabel>
              <TextInput value={landmark} onChangeText={(t) => setLandmark(t.slice(0, 100))} placeholder="Outside the chai stall" placeholderTextColor={color.inkSubtle} style={styles.field} accessibilityLabel="Landmark" />
            </StepCard>
          ) : null}

          {step === 3 ? (
            <ReviewListing
              media={media} noMedia={noMedia} species={species} problems={problems} details={details}
              voice={voice} landmark={landmark} mobile={account?.mobile} onEdit={(n) => setStep(n)}
            />
          ) : null}

          {step === 4 ? <Sent id={newId} /> : null}
        </ScrollView>
      </FadeSlide>

      {step < 4 ? (
        <View style={[stepStyles.footer, styles.footerPin, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>
          {step < 3 ? (
            <Button
              label={reviewed ? 'Back to review' : 'Continue'}
              icon={reviewed ? Check : undefined}
              onPress={() => setStep((s) => (reviewed ? 3 : ((s + 1) as Step)))}
              disabled={!canContinue}
            />
          ) : (
            <Button label={sending ? 'Sending your report…' : 'Send report'} onPress={send} disabled={sending} />
          )}
        </View>
      ) : null}

      <SheetDialog visible={sheet === 'safety'} onClose={() => setSheet(null)}>
        <Text style={type.title}>That&apos;s okay. Your safety comes first.</Text>
        <Text style={type.body}>You can still send a report without a photo or video. It will be marked &ldquo;No media: reporter couldn&apos;t capture safely&rdquo; for the rescue team.</Text>
        <Button label="Continue without media" onPress={() => { setNoMedia(true); setMedia([]); setSheet(null); setStep(1); }} />
        <Button label="Go back and add evidence" variant="outline" onPress={() => setSheet(null)} />
      </SheetDialog>

      <SheetDialog visible={sheet === 'discard'} onClose={() => setSheet(null)}>
        <Text style={type.title}>Discard this report?</Text>
        <Text style={type.body}>Your photos and details won&apos;t be sent.</Text>
        <Button label="Discard" onPress={() => { setSheet(null); router.back(); }} />
        <Button label="Keep reporting" variant="outline" onPress={() => setSheet(null)} />
      </SheetDialog>

      <SheetDialog visible={sheet === 'duplicate'} onClose={() => setSheet(null)}>
        <Text style={type.title}>We may already have this animal&apos;s case.</Text>
        <Text style={type.body}>Someone has reported an animal in this area and help may already be on the way.</Text>
        <View style={styles.dupCase}>
          <AnimalPhoto species="dog" photo={PHOTOS['dog-leg-wound']} style={{ width: 52, height: 52 }} iconSize={24} />
          <View style={{ flex: 1 }}>
            <Text style={type.section}>Injured dog · Andheri East</Text>
            <Text style={type.caption}>Looking for help · reported 12 min ago</Text>
          </View>
        </View>
        <Button label="View existing case" onPress={() => { setSheet(null); router.replace('/case/AR-10245'); }} />
        <Button label="I can take this animal to a hospital" variant="outline" onPress={() => { setSheet(null); router.replace('/case/AR-10245'); }} />
        <Button label="This is a different animal" variant="link" onPress={finish} />
      </SheetDialog>
    </View>
  );
}

function Progress({ value }: { value: number }) {
  const a = useAnimatedStyle(() => ({ width: withTiming(`${value * 100}%`, { duration: 300 }) }));
  return <View style={styles.progress}><Animated.View style={[styles.progressFill, a]} /></View>;
}

function DropPin({ show }: { show: boolean }) {
  const y = useSharedValue(-40);
  const o = useSharedValue(0);
  useEffect(() => {
    if (show) { o.value = withTiming(1, { duration: 150 }); y.value = withSpring(0, { damping: 9, stiffness: 160 }); }
  }, [show, o, y]);
  const a = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  return (
    <Animated.View pointerEvents="none" style={[styles.pin, a]}>
      <MapPin size={40} color={color.urgent} fill={color.coral} strokeWidth={1.6} />
    </Animated.View>
  );
}

function Composer({ text, setText, voice, setVoice }: { text: string; setText: (t: string) => void; voice: number | null; setVoice: (v: number | null) => void }) {
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (!rec) return;
    pulse.value = withRepeat(withTiming(1.25, { duration: 600 }), -1, true);
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => { clearInterval(t); pulse.value = 1; };
  }, [rec, pulse]);
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  return (
    <View style={styles.composer}>
      {rec ? (
        <View style={styles.recRow}>
          <Animated.View style={[styles.recDot, dot]} />
          <Text style={[type.label, { color: color.ink, flex: 1 }]}>Recording 0:{String(secs).padStart(2, '0')}</Text>
          <PressableScale onPress={() => { setRec(false); setSecs(0); }} accessibilityLabel="Cancel recording" style={styles.smallBtn}><X size={16} color={color.ink} /></PressableScale>
          <PressableScale onPress={() => { setRec(false); setVoice(Math.max(1, secs)); setSecs(0); }} accessibilityLabel="Stop recording" style={[styles.smallBtn, { backgroundColor: color.action }]}><Square size={14} color="#fff" /></PressableScale>
        </View>
      ) : (
        <View style={styles.recRow}>
          <TextInput value={text} onChangeText={setText} placeholder="Type here" placeholderTextColor={color.inkSubtle} multiline style={styles.composerInput} accessibilityLabel="Tell us what you saw" />
          {!voice ? (
            <PressableScale onPress={() => setRec(true)} accessibilityLabel="Record a voice note" style={styles.smallBtn}><Mic size={18} color={color.action} /></PressableScale>
          ) : null}
        </View>
      )}
      {voice ? (
        <Animated.View entering={FadeInDown} style={styles.voiceRow}>
          <Play size={14} color={color.action} />
          <View style={styles.wave} />
          <Text style={type.caption}>0:{String(voice).padStart(2, '0')}</Text>
          <PressableScale onPress={() => setVoice(null)} accessibilityLabel="Delete voice note" style={styles.smallBtn}><Trash2 size={15} color={color.inkSecondary} /></PressableScale>
          <PressableScale onPress={() => { setVoice(null); setRec(true); }} accessibilityLabel="Re-record" style={styles.smallBtn}><RotateCcw size={15} color={color.inkSecondary} /></PressableScale>
        </Animated.View>
      ) : null}
    </View>
  );
}

/**
 * Step 4 (REPORT-07): the report shown the way rescue teams and people nearby
 * will see it, with Edit on each part. The mobile number stays private (D117, D137).
 */
function ReviewListing({
  media, noMedia, species, problems, details, voice, landmark, mobile, onEdit,
}: {
  media: { id: number; kind: 'photo' | 'video'; photo: PhotoKey }[]; noMedia: boolean; species: Species | null; problems: ProblemCode[];
  details: string; voice: number | null; landmark: string; mobile?: string; onEdit: (step: Step) => void;
}) {
  const [w, setW] = useState(0);
  const [page, setPage] = useState(0);
  const title = caseTitle(species, problems);
  const what = problems.map((p) => PROBLEMS.find((x) => x.code === p)?.label).filter(Boolean).join(' · ');
  return (
    <View style={{ gap: space[4] }}>
      <Animated.View entering={FadeInDown.duration(320)} style={styles.listing} onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
        <View style={styles.gallery}>
          {noMedia || media.length === 0 ? (
            <View style={styles.noMedia}>
              <ShieldAlert size={26} color={color.inkSecondary} />
              <Text style={[type.label, { textAlign: 'center' }]}>No media: the reporter couldn&apos;t capture it safely.</Text>
            </View>
          ) : w > 0 ? (
            <ScrollView
              horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEventThrottle={32}
              onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / w))}
            >
              {media.map((m) => (
                <View key={m.id} style={{ width: w, height: 220 }}>
                  <AnimalPhoto species={species ?? 'dog'} photo={PHOTOS[m.photo]} iconSize={60} style={{ width: w, height: 220, borderRadius: 0 }} />
                  {m.kind === 'video' ? <View style={styles.videoBadge}><Play size={11} color="#fff" /><Text style={styles.videoText}>0:12</Text></View> : null}
                </View>
              ))}
            </ScrollView>
          ) : null}
          {media.length > 1 ? (
            <View style={styles.galleryDots} pointerEvents="none">
              {media.map((m, i) => <View key={m.id} style={[styles.gDot, i === page && styles.gDotOn]} />)}
            </View>
          ) : null}
          <View style={styles.photoEdit}><EditChip onPress={() => onEdit(0)} label="Edit photos" dark /></View>
        </View>

        <View style={styles.listingBody}>
          <View style={styles.rowBetween}>
            <StatusChip c={{ status: 'NEW' }} />
            <Text style={type.caption}>Just now</Text>
          </View>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={type.title}>{title}</Text>
              <Text style={[type.label, { color: color.ink }]}>{what || 'Choose what’s wrong'}</Text>
            </View>
            <EditChip onPress={() => onEdit(1)} label="Edit what's wrong" />
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={type.section}>Location</Text>
            <EditChip onPress={() => onEdit(2)} label="Edit location" />
          </View>
          <View style={styles.reviewMap} pointerEvents="none">
            <MapCanvas cases={[]} onSelect={() => {}} />
            <DropPin show />
          </View>
          <View style={styles.addrRow}>
            <MapPin size={15} color={color.action} />
            <Text style={[type.label, { color: color.ink, flex: 1 }]}>Near Hill Road, Andheri East{landmark ? ` · ${landmark}` : ''}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={type.section}>What you saw</Text>
            <EditChip onPress={() => onEdit(1)} label="Edit details" />
          </View>
          {details ? (
            <Text style={type.body}>{details}</Text>
          ) : (
            <Text style={type.caption}>No details added. That&apos;s fine; the photos and location matter most.</Text>
          )}
          {voice ? (
            <View style={styles.reviewVoice}>
              <View style={styles.voicePlay}><Play size={14} color="#fff" /></View>
              <View style={styles.voiceTrack} />
              <Text style={type.caption}>0:{String(voice).padStart(2, '0')}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(320)} style={styles.privateCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Lock size={14} color={color.inkSecondary} />
          <Text style={type.section}>Your contact · private</Text>
        </View>
        <Text style={[type.title, { fontSize: 18 }]}>{mobileLabel(mobile)}</Text>
        <Text style={type.caption}>
          So the rescue team can reach you if they need help finding the animal. Only the registered hospital or organisation handling this case will see it; it never appears on the listing. This is your account number and can&apos;t be changed.
        </Text>
      </Animated.View>
    </View>
  );
}

function EditChip({ onPress, label, dark }: { onPress: () => void; label: string; dark?: boolean }) {
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} hitSlop={8} scaleTo={0.92} style={[styles.editChip, dark && styles.editChipDark]}>
      <Pencil size={15} color={dark ? '#ffffff' : color.action} strokeWidth={2.2} />
    </PressableScale>
  );
}

function Sent({ id }: { id: string | null }) {
  const [stay, setStay] = useState<string | null>(null);
  const [transport, setTransport] = useState<string | null>(null);
  return (
    <View style={{ gap: space[3], paddingTop: space[4] }}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.sentCard}>
        <Animated.View entering={ZoomIn.springify().damping(11)} style={styles.sentIcon}>
          <CircleCheck size={40} color={color.successInk} strokeWidth={2} />
        </Animated.View>
        <Text style={[type.display, { textAlign: 'center' }]}>Report sent.</Text>
        <Text style={[type.body, { textAlign: 'center' }]}>We&apos;re alerting rescue teams near you. You&apos;ve done the most important part. Reporting is free and doesn&apos;t make you responsible for the animal.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)}>
        <StepCard icon={Bell} title="What happens next">
          <Text style={type.label}>We&apos;ll update you when a team accepts and as the animal gets care. (Demo notifications)</Text>
        </StepCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <StepCard icon={ShieldCheck} tone="success" title="Stay safe">
          {['Keep a safe distance and don’t stand in traffic.', 'Bitten or scratched? Wash with soap and running water for 15 minutes and see a doctor today.', 'Children: ask an adult.'].map((t) => (
            <Bullet key={t} text={t} />
          ))}
        </StepCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(280)}>
        <StepCard icon={HeartHandshake} title="Optional ways you can help">
          <Text style={type.label}>Only if you&apos;re able. It&apos;s okay to leave.</Text>
          <Divider />
          <GroupLabel>Can you stay nearby for a while?</GroupLabel>
          <View style={styles.wrap}>{['Yes', 'About 15 min', 'Not able to'].map((o) => <Pill key={o} label={o} selected={stay === o} onPress={() => setStay(o)} />)}</View>
          <Divider />
          <GroupLabel>Could you help transport the animal, if the team asks?</GroupLabel>
          <View style={styles.wrap}>{['Yes', 'Not able to'].map((o) => <Pill key={o} label={o} selected={transport === o} onPress={() => setTransport(o)} />)}</View>
        </StepCard>
      </Animated.View>

      <View style={{ gap: space[2], marginTop: space[2] }}>
        <Button label="View your report" onPress={() => id && router.replace(`/case/${id}`)} />
        <Button label="Back to Home" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.page },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[3], paddingVertical: space[1], gap: space[2] },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: font.bold, fontSize: 16, color: color.ink },
  iconBtn: { minWidth: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  progress: { height: 6, borderRadius: 3, backgroundColor: color.line, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: color.primary },
  tray: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  thumb: { width: 64, height: 64, borderRadius: radius.md, overflow: 'hidden' },
  remove: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  videoTag: { position: 'absolute', left: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(47,58,76,0.75)', borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 2 },
  videoText: { fontFamily: font.bold, fontSize: 10, color: '#fff' },
  addRow: { flexDirection: 'row', gap: space[2] },
  addTile: { flex: 1, height: 88, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.primary, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center', gap: 6 },
  addText: { fontFamily: font.bold, fontSize: 13, color: color.action },
  note: { flexDirection: 'row', gap: space[2], backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3], alignItems: 'flex-start' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  composer: { backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, padding: space[2], gap: space[2] },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  composerInput: { flex: 1, minHeight: 44, paddingHorizontal: space[2], fontFamily: font.regular, fontSize: 15, color: color.ink },
  recDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: color.coral, marginLeft: space[2] },
  smallBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: color.fill },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.surfaceTint, borderRadius: radius.pill, paddingLeft: space[3] },
  wave: { flex: 1, height: 4, borderRadius: 2, backgroundColor: color.primary },
  miniMap: { height: 220, borderRadius: radius.md, overflow: 'hidden' },
  pin: { position: 'absolute', left: '50%', top: '50%', marginLeft: -20, marginTop: -40 },
  addr: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.fill, borderRadius: radius.md, padding: space[3] },
  addrIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center' },
  safeRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 48 },
  field: { backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, paddingHorizontal: space[4], minHeight: 50, fontFamily: font.regular, fontSize: 15, color: color.ink },
  readonly: { backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4] },
  summary: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: 2, ...shadow.card },
  listing: { backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  gallery: { height: 220, backgroundColor: color.surfaceTint },
  noMedia: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[2], padding: space[5] },
  galleryDots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  gDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  gDotOn: { width: 16, backgroundColor: '#ffffff' },
  videoBadge: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(31,41,55,0.7)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  listingBody: { padding: space[4], gap: space[3] },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  divider: { height: 1, backgroundColor: color.line },
  reviewMap: { height: 130, borderRadius: radius.md, overflow: 'hidden' },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reviewVoice: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surfaceTint, borderRadius: radius.pill, padding: 6, paddingRight: space[4] },
  voicePlay: { width: 32, height: 32, borderRadius: 16, backgroundColor: color.action, alignItems: 'center', justifyContent: 'center' },
  voiceTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: color.primary, opacity: 0.5 },
  privateCard: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: space[2], borderWidth: 1, borderColor: color.line },
  editChip: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surfaceTint },
  photoEdit: { position: 'absolute', top: 12, right: 12 },
  editChipDark: { backgroundColor: 'rgba(31,41,55,0.62)' },
  footerPin: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sentCard: { alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: 20, padding: space[5], borderWidth: 1, borderColor: color.line, ...shadow.card },
  dupCase: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.fill, borderRadius: radius.md, padding: space[3] },
  sentIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: color.successTint, alignItems: 'center', justifyContent: 'center' },
});
