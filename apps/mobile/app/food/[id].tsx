import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Check, Minus, Plus } from 'lucide-react-native';
import { Button, FadeSlide, PressableScale, ScreenHeader, Tag } from '@/src/ui';
import { useStore } from '@/src/store';
import { ProductArt } from '@/src/ProductArt';
import { Celebration } from '@/src/Celebration';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';

type Step = 'choose' | 'quantity' | 'pay' | 'done';

export default function FoodRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { foodRequests, requireAccount, donate } = useStore();
  const r = foodRequests.find((x) => x.id === id);
  const [productId, setProductId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState<Step>('choose');
  const [paying, setPaying] = useState(false);
  if (!r) return null;
  const p = r.products.find((x) => x.id === productId);
  const total = (p?.price ?? 0) * qty;

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={step === 'done' ? '' : 'Food donation'} onBack={step === 'quantity' ? () => setStep('choose') : step === 'pay' ? () => setStep('quantity') : undefined} />
      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ padding: space[5], paddingTop: step === 'done' ? 0 : space[5], gap: space[4] }}>
          {step === 'choose' ? (
            <>
              <Text style={type.caption}>{r.org}</Text>
              <Text style={type.display}>{r.need}</Text>
              <Text style={type.section}>Select one product to donate</Text>
              {r.products.map((x, i) => (
                <Animated.View key={x.id} entering={FadeInDown.delay(i * 50)}>
                  <PressableScale onPress={() => setProductId(x.id)} accessibilityLabel={`${x.name} ${x.size}`} style={[styles.product, productId === x.id && styles.productOn]} scaleTo={0.98}>
                    <ProductArt kind={x.kind} fill={x.fill} photo={x.photo} size={64} label={x.size} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={type.section}>{x.name}</Text>
                      <Text style={type.caption}>{x.size}</Text>
                    </View>
                    <Text style={type.section}>₹{x.price}</Text>
                  </PressableScale>
                </Animated.View>
              ))}
              <Text style={type.caption}>Delivered to the organisation&apos;s registered address. Product images are for illustration only; no brand partnership is implied.</Text>
              <Button label="Choose and donate" disabled={!p} onPress={() => requireAccount('Sign in to donate food', () => setStep('quantity'))} />
            </>
          ) : null}

          {step === 'quantity' && p ? (
            <>
              <Animated.View entering={ZoomIn.springify().damping(14)} style={{ alignSelf: 'center' }}>
                <ProductArt kind={p.kind} fill={p.fill} photo={p.photo} size={148} label={p.size} />
              </Animated.View>
              <Text style={type.display}>{p.name} · {p.size}</Text>
              <Text style={type.label}>₹{p.price} each · to {r.org}</Text>
              <View style={styles.qty}>
                <PressableScale onPress={() => setQty((q) => Math.max(1, q - 1))} accessibilityLabel="Decrease quantity" style={styles.qtyBtn} scaleTo={0.9}><Minus size={18} color={color.ink} /></PressableScale>
                <Animated.Text key={qty} entering={ZoomIn.duration(160)} style={styles.qtyN}>{qty}</Animated.Text>
                <PressableScale onPress={() => setQty((q) => Math.min(20, q + 1))} accessibilityLabel="Increase quantity" style={styles.qtyBtn} scaleTo={0.9}><Plus size={18} color={color.ink} /></PressableScale>
              </View>
              <Text style={[type.title, { textAlign: 'center' }]}>Total ₹{total}</Text>
              <Button label="Continue to pay" onPress={() => setStep('pay')} />
            </>
          ) : null}

          {step === 'pay' && p ? (
            <>
              <View style={styles.demo}><Text style={[type.label, { color: color.amberInk }]}>Demo payment: no real money is taken in this prototype.</Text></View>
              <Text style={type.display}>Pay ₹{total}</Text>
              <View style={styles.summary}>
                <ProductArt kind={p.kind} fill={p.fill} photo={p.photo} size={56} label={p.size} />
                <Text style={[type.label, { flex: 1 }]}>{p.name} {p.size} × {qty} for {r.org}</Text>
              </View>
              <Button label={paying ? 'Processing…' : 'Pay'} disabled={paying} onPress={() => {
                setPaying(true);
                setTimeout(() => { donate({ requestId: r.id, org: r.org, product: `${p.name} ${p.size}`, kind: p.kind, photo: p.photo, quantity: qty, amount: total }); setPaying(false); setStep('done'); }, 1100);
              }} />
            </>
          ) : null}

          {step === 'done' && p ? (
            <View style={styles.thanks}>
              <Celebration />
              <Animated.Text entering={FadeIn.delay(200).duration(300)} style={[type.display, styles.center]}>Thank you!</Animated.Text>
              <Animated.Text entering={FadeIn.delay(260).duration(300)} style={[type.body, styles.center]}>
                Your food is on its way to {r.org}. Every meal helps a rescued animal recover.
              </Animated.Text>
              <Animated.View entering={FadeIn.delay(320).duration(300)} style={styles.receipt}>
                <ProductArt kind={p.kind} fill={p.fill} photo={p.photo} size={60} label={p.size} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={type.section}>{p.name} · {p.size}</Text>
                  <Text style={type.caption}>Quantity {qty} · ₹{total}</Text>
                </View>
              </Animated.View>
              <View style={styles.ticks}>
                <StatusTick label="Paid" delay={380} />
                <StatusTick label="Order placed" delay={380} />
              </View>
              <Animated.View entering={FadeIn.delay(420).duration(300)} style={styles.thanksActions}>
                <Button label="Done" onPress={() => router.back()} />
                <Button label="See my food donations" variant="outline" onPress={() => router.replace('/my-donations')} />
              </Animated.View>
            </View>
          ) : null}
        </ScrollView>
      </FadeSlide>
    </View>
  );
}

function StatusTick({ label, delay }: { label: string; delay: number }) {
  return (
    <Animated.View entering={FadeIn.delay(delay).duration(300)}>
      <Tag label={label} tone="success" icon={Check} lines={1} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  product: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], borderWidth: 1.5, borderColor: 'transparent', ...shadow.card },
  productOn: { borderColor: color.primary, backgroundColor: color.surfaceTint },
  summary: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], ...shadow.card },
  qty: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[6], paddingVertical: space[4] },
  qtyBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  qtyN: { fontFamily: font.extrabold, fontSize: 36, color: color.ink, minWidth: 48, textAlign: 'center' },
  demo: { backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3] },
  thanks: { alignItems: 'center', gap: space[3] },
  center: { textAlign: 'center' },
  receipt: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: space[3], marginTop: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, ...shadow.card },
  ticks: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
  thanksActions: { alignSelf: 'stretch', gap: space[2], marginTop: space[3] },
});
