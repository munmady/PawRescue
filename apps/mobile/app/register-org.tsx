import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { CircleCheck, HeartHandshake, Square, SquareCheck } from 'lucide-react-native';
import { Button, Pill, PressableScale, ScreenHeader } from '@/src/ui';
import { Divider, GroupLabel, PrivacyNote, StepCard, stepStyles } from '@/src/StepFlow';
import { color, font, radius, space, type } from '@/src/theme';
import { DEMO_MOBILE } from '@/src/store';

const TYPES = ['Veterinary hospital', 'Rescue organisation / NGO', 'Shelter home'] as const;
// Demo mode: the form arrives filled in with fictional details. The masked mobile can't be a real number.
const DEMO = {
  kind: 'Shelter home', name: 'Gentle Paws Shelter (demo)', regNo: 'MH/TRUST/0000/2024', address: 'Near Marol Naka, Andheri East, Mumbai',
  services: 'Rescue, shelter and recovery care for street dogs and cats', contact: 'Ritu', email: 'hello@gentlepaws.example', mobile: DEMO_MOBILE,
};

/**
 * Organisation registration application (D145, amends D105/D118). Organisations that help street
 * animals free of cost apply here; the platform admin reviews and decides. SIMULATED DEMO: nothing
 * is sent, there is no admin review screen yet, and the applicant gets no in-app status.
 */
export default function RegisterOrg() {
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<string | null>(DEMO.kind);
  const [name, setName] = useState(DEMO.name);
  const [regNo, setRegNo] = useState(DEMO.regNo);
  const [address, setAddress] = useState(DEMO.address);
  const [contact, setContact] = useState(DEMO.contact);
  const [email, setEmail] = useState(DEMO.email);
  const [mobile, setMobile] = useState(DEMO.mobile);
  const [services, setServices] = useState(DEMO.services);
  const [free, setFree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!kind) e.kind = 'Choose the type of organisation.';
    if (!name.trim()) e.name = 'Enter the organisation name.';
    if (!address.trim()) e.address = 'Enter the address or area.';
    if (!contact.trim()) e.contact = 'Enter a contact person.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address.';
    const m = mobile.replace(/\s/g, '');
    if (m !== DEMO_MOBILE && !/^\d{10}$/.test(m)) e.mobile = 'Check the number. It should be 10 digits.';
    setErrors(e);
    if (Object.keys(e).length || !free) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
        <ScreenHeader title="" />
        <View style={styles.sent}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.sentIcon}>
            <CircleCheck size={40} color={color.successInk} strokeWidth={2} />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(150)} style={[type.display, styles.center]}>Application sent</Animated.Text>
          <Animated.Text entering={FadeIn.delay(220)} style={[type.body, styles.center]}>
            Thank you for caring for street animals. We’ll review your application and get in touch. Approved organisations appear in the app.
          </Animated.Text>
          <Text style={[type.caption, styles.center]}>Demo: nothing is sent in this prototype.</Text>
          <View style={{ alignSelf: 'stretch', marginTop: space[4] }}>
            <Button label="Done" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    );
  }

  const ready = !!kind && !!name.trim() && !!address.trim() && !!contact.trim() && !!email.trim() && !!mobile.trim() && free;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Register your organisation" right={<View style={styles.demo}><Text style={styles.demoText}>Demo</Text></View>} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[2], gap: space[3], paddingBottom: space[6] }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(280)} style={styles.intro}>
          <HeartHandshake size={22} color={color.successInk} />
          <Text style={[type.label, { flex: 1, color: color.ink }]}>
            For veterinary hospitals, NGOs, rescue organisations and shelter homes that help street animals <Text style={{ fontFamily: font.bold }}>free of cost</Text>. Our team reviews every application.
          </Text>
        </Animated.View>

        <StepCard title="About your organisation">
          <GroupLabel>Type of organisation</GroupLabel>
          <View style={styles.wrap}>
            {TYPES.map((t) => <Pill key={t} label={t} selected={kind === t} onPress={() => { setKind(t); setErrors((x) => ({ ...x, kind: '' })); }} />)}
          </View>
          {errors.kind ? <Text style={styles.error}>{errors.kind}</Text> : null}
          <Divider />
          <Field label="Organisation name" value={name} onChangeText={setName} placeholder="Name as registered" error={errors.name} />
          <Field label="Registration number" optional value={regNo} onChangeText={setRegNo} placeholder="Trust, society, NGO or clinic registration" />
          <Field label="Address or area" value={address} onChangeText={setAddress} placeholder="Street, area, city" error={errors.address} multiline />
          <Field label="Services you provide" optional value={services} onChangeText={setServices} placeholder="For example: emergency care, rescue, shelter" multiline />
        </StepCard>

        <StepCard title="Contact person">
          <Field label="Name" value={contact} onChangeText={setContact} placeholder="Who should we contact?" error={errors.contact} />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@organisation.org" error={errors.email} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Mobile number" value={mobile} onChangeText={setMobile} placeholder="10-digit mobile" error={errors.mobile} keyboardType="phone-pad" prefix="+91" />
          <PrivacyNote text="Used only by our team to review your application." />
        </StepCard>

        <PressableScale onPress={() => setFree((x) => !x)} accessibilityRole="checkbox" accessibilityState={{ checked: free }} accessibilityLabel="We provide our services free of cost and never charge reporters or responders" style={[styles.pledge, free && styles.pledgeOn]} scaleTo={0.99}>
          {free ? <SquareCheck size={22} color={color.successInk} /> : <Square size={22} color={color.inkMuted} />}
          <Text style={[type.section, { flex: 1, fontSize: 14.5 }]}>We provide our services free of cost and never charge reporters or responders.</Text>
        </PressableScale>
      </ScrollView>
      <View style={[stepStyles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>
        <Button label={sending ? 'Sending…' : 'Send application'} disabled={!ready || sending} onPress={submit} />
        {!ready ? <Text style={[type.caption, styles.center]}>Fill in the details and confirm free-of-cost service to continue</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, optional, error, prefix, multiline, ...p }: React.ComponentProps<typeof TextInput> & { label: string; optional?: boolean; error?: string; prefix?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <GroupLabel optional={optional}>{label}</GroupLabel>
      <View style={[styles.input, multiline && { minHeight: 76, alignItems: 'flex-start' }, focus && styles.inputFocus, !!error && styles.inputError]}>
        {prefix ? <Text style={[type.body, { color: color.ink, paddingTop: multiline ? 12 : 0 }]}>{prefix}</Text> : null}
        <TextInput
          {...p}
          multiline={multiline}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor={color.inkSubtle}
          style={[styles.inputText, multiline && { textAlignVertical: 'top' }]}
          accessibilityLabel={label}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], backgroundColor: color.successTint, borderRadius: radius.md, padding: space[4] },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  input: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.fill, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'transparent', paddingHorizontal: space[4], minHeight: 50 },
  inputFocus: { borderColor: color.action, backgroundColor: color.surface },
  inputError: { borderColor: color.urgent },
  inputText: { flex: 1, fontFamily: font.regular, fontSize: 15, color: color.ink, paddingVertical: 12, outlineStyle: 'none' } as never,
  demo: { backgroundColor: color.amberTint, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  demoText: { fontFamily: font.bold, fontSize: 11, color: color.amberInk, letterSpacing: 0.4 },
  error: { fontFamily: font.semibold, fontSize: 13, color: color.urgent },
  pledge: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderRadius: radius.md, borderWidth: 1.5, borderColor: color.line, backgroundColor: color.surface },
  pledgeOn: { borderColor: color.successInk, backgroundColor: color.successTint },
  sent: { flex: 1, alignItems: 'center', gap: space[3], paddingHorizontal: space[6], paddingTop: space[6] },
  sentIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: color.successTint, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});
