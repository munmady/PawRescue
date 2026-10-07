import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Check, Mail, MailCheck, ShieldCheck, Smartphone, UserRound, type LucideIcon } from 'lucide-react-native';
import { Button, FadeSlide, ScreenHeader } from '@/src/ui';
import { DEMO_MOBILE, useStore } from '@/src/store';
import { color, font, radius, space, type } from '@/src/theme';
import { Divider, GroupLabel, PrivacyNote, StepCard, StepTracker, stepStyles } from '@/src/StepFlow';

const STAGES = ['Your details', 'Verify email'] as const;

const DEMO_CODE = '246810';
// Demo mode: the form arrives filled in. Fictional values; Indian mobiles start 6–9, so this number can't be real.
const DEMO_ACCOUNT = { name: 'Asha', email: 'asha@example.com', mobile: DEMO_MOBILE };

/**
 * One-time account setup (D137): Name → Email → Mobile → Email OTP → signed in.
 * No password, no Google-only sign-in, no SMS code. Email delivery is simulated.
 */
export default function Auth() {
  const insets = useSafeAreaInsets();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { completeAccount } = useStore();
  const [step, setStep] = useState<'details' | 'code'>('details');
  const [name, setName] = useState(DEMO_ACCOUNT.name);
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [mobile, setMobile] = useState(DEMO_ACCOUNT.mobile);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const codeRef = useRef<TextInput>(null);

  const sendCode = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address.';
    const m = mobile.replace(/\s/g, '');
    if (m !== DEMO_MOBILE && !/^\d{10}$/.test(m)) e.mobile = 'Check the number. It should be 10 digits.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setCode(DEMO_CODE);
    setStep('code');
    setTimeout(() => codeRef.current?.focus(), 300);
  };

  const verify = () => {
    if (code !== DEMO_CODE) {
      setErrors({ code: 'That code isn’t right. Check it and try again.' });
      shake.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 50 }), withTiming(-5, { duration: 50 }), withTiming(0, { duration: 50 }));
      return;
    }
    completeAccount({ name: name.trim(), email: email.trim(), mobile: mobile.replace(/\s/g, '') });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={reason || 'Set up your account'} onBack={step === 'code' ? () => setStep('details') : undefined} />
      <StepTracker stages={STAGES} stage={step === 'details' ? 0 : 1} />
      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[3], gap: space[3], paddingBottom: space[6] }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 'details' ? (
            <StepCard icon={UserRound} title="Your details">
              <Text style={stepStyles.lead}>It takes a minute, once: your name, email and mobile, then a code we send to your email.</Text>
              <DemoNote text="Demo · filled in with sample details. Edit them or tap Send code." />
              <Divider />
              <Field label="Name" icon={UserRound} value={name} onChangeText={setName} placeholder="Priya" error={errors.name} autoComplete="name" />
              <Field label="Email" icon={Mail} value={email} onChangeText={setEmail} placeholder="you@example.com" error={errors.email} keyboardType="email-address" autoComplete="email" />
              <Field label="Mobile number" icon={Smartphone} value={mobile} onChangeText={setMobile} placeholder="98XXX XXXXX" error={errors.mobile} keyboardType="phone-pad" prefix="+91" autoComplete="tel"
                hint="Rescue teams use it to reach you. It can't be changed later." />
              <Divider />
              <PrivacyNote text="Your email and mobile are never shown publicly." />
            </StepCard>
          ) : (
            <StepCard icon={MailCheck} title="Check your email">
              <Text style={stepStyles.lead}>Enter the 6-digit code we sent to <Text style={{ fontFamily: font.bold }}>{email}</Text>.</Text>
              <DemoNote text={`Demo · your code is ${DEMO_CODE}, already filled in`} />
              <Divider />
              <GroupLabel>6-digit code</GroupLabel>
              <Animated.View style={shakeStyle}>
                <Pressable6 value={code} onChange={(v) => { setCode(v); setErrors({}); }} inputRef={codeRef} />
              </Animated.View>
              {errors.code ? <Text style={styles.error}>{errors.code}</Text> : null}
              <Button label="Resend code" variant="link" full={false} style={{ alignSelf: 'flex-start' }} onPress={() => { setCode(''); setErrors({}); }} />
            </StepCard>
          )}
        </ScrollView>
      </FadeSlide>
      <View style={[stepStyles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>
        {step === 'details'
          ? <Button label="Send code" icon={Mail} onPress={sendCode} />
          : <Button label="Verify" icon={Check} onPress={verify} disabled={code.length < 6} />}
      </View>
    </KeyboardAvoidingView>
  );
}

function DemoNote({ text }: { text: string }) {
  return (
    <Animated.View entering={FadeInDown.delay(120)} style={styles.demoCode}>
      <ShieldCheck size={16} color={color.amberInk} />
      <Text style={[type.label, { color: color.amberInk, flex: 1 }]}>{text}</Text>
    </Animated.View>
  );
}

function Field({ label, icon: Icon, error, hint, prefix, ...p }: React.ComponentProps<typeof TextInput> & { label: string; icon: LucideIcon; error?: string; hint?: string; prefix?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <GroupLabel>{label}</GroupLabel>
      <View style={[styles.input, focus && styles.inputFocus, error && styles.inputError]}>
        <Icon size={18} color={focus ? color.action : color.inkMuted} />
        {prefix ? <Text style={[type.body, { color: color.ink }]}>{prefix}</Text> : null}
        <TextInput
          {...p}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor={color.inkSubtle}
          style={styles.inputText}
          accessibilityLabel={label}
        />
      </View>
      {error ? <Animated.Text entering={FadeInRight.duration(200)} style={styles.error}>{error}</Animated.Text> : hint ? <Text style={type.caption}>{hint}</Text> : null}
    </View>
  );
}

function Pressable6({ value, onChange, inputRef }: { value: string; onChange: (v: string) => void; inputRef: React.RefObject<TextInput | null> }) {
  return (
    <View>
      <View style={styles.codeRow}>
        {Array.from({ length: 6 }).map((_, i) => {
          const ch = value[i];
          const active = i === value.length;
          return (
            <View key={i} style={[styles.codeBox, active && styles.codeBoxActive, ch && styles.codeBoxFilled]}>
              <Text style={styles.codeChar}>{ch ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="one-time-code"
        accessibilityLabel="6-digit code"
        style={styles.codeHidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.fill, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'transparent', paddingHorizontal: space[4], minHeight: 52 },
  inputFocus: { borderColor: color.action, backgroundColor: color.surface },
  inputError: { borderColor: color.urgent },
  inputText: { flex: 1, fontFamily: font.regular, fontSize: 16, color: color.ink, paddingVertical: 12, outlineStyle: 'none' } as never,
  error: { fontFamily: font.semibold, fontSize: 13, color: color.urgent },
  demoCode: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3] },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  codeBox: { flex: 1, height: 54, borderRadius: radius.md, backgroundColor: color.fill, borderWidth: 1.5, borderColor: color.line, alignItems: 'center', justifyContent: 'center' },
  codeBoxActive: { borderColor: color.action },
  codeBoxFilled: { backgroundColor: color.surfaceTint, borderColor: color.primary },
  codeChar: { fontFamily: font.extrabold, fontSize: 22, color: color.ink },
  codeHidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.01, fontSize: 1 },
});
