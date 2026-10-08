import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Check, Minus, Plus } from 'lucide-react-native';
import { Button, FadeSlide, PressableScale, ScreenHeader, Tag, SelectCheck } from '@/src/ui';
import { useStore } from '@/src/store';
import { ProductArt } from '@/src/ProductArt';
import { Celebration } from '@/src/Celebration';
import { color, font, radius, shadow, space, type } from '@/src/theme';

type Step = 'donate' | 'done';

/**
 * Food donation (FOOD-02, D115, D120, D124): one screen to pick a product, set the
 * quantity and pay, then the thank-you. Payment and delivery are SIMULATED DEMO.
 */
export default function FoodRequest() {
  // `product` and `qty` pre-select a repeat donation from My food donations.
  const { id, product, qty: qtyParam } = useLocalSearchParams<{ id: string; product?: string; qty?: string }>();
  const insets = useSafeAreaInsets();
  const { foodRequests, requireAccount, donate } = useStore();
  const r = foodRequests.find((x) => x.id === id);
  const [productId, setProductId] = useState<string | null>(product ?? null);
  const [qty, setQty] = useState(() => Math.min(20, Math.max(1, Number(qtyParam) || 1)));
  const [step, setStep] = useState<Step>('donate');
  const [paying, setPaying] = useState(false);
  if (!r) return null;
  const p = r.products.find((x) => x.id === productId);
  const total = (p?.price ?? 0) * qty;

  const pay = () => requireAccount('Sign in to donate food', () => {
    if (!p) return;
    setPaying(true);
    setTimeout(() => {
      donate({ requestId: r.id, productId: p.id, org: r.org, product: `${p.name} ${p.size}`, kind: p.kind, photo: p.photo, quantity: qty, amount: total });
      setPaying(false);
      setStep('done');
    }, 1100);
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={step === 'done' ? '' : 'Food donation'} />
      <FadeSlide k={step}>
        <ScrollView contentContainerStyle={{ padding: space[5], paddingTop: step === 'done' ? 0 : space[3], gap: space[3], paddingBottom: space[6] }} showsVerticalScrollIndicator={false}>
          {step === 'donate' ? (
            <>
              <View style={{ gap: 4 }}>
                <Text style={type.caption}>{r.org}</Text>
                <Text style={type.title}>{r.need}</Text>
              </View>

              {/* 1 · Pick one product */}
              <View style={styles.card}>
                <Text style={styles.groupLabel}>1 · Choose a product</Text>
                {r.products.map((x, i) => {
                  const on = productId === x.id;
                  return (
                    <Animated.View key={x.id} entering={FadeInDown.delay(i * 50)}>
                      <PressableScale onPress={() => { setProductId(x.id); setQty(1); }} accessibilityLabel={`${x.name} ${x.size}`} accessibilityRole="radio" accessibilityState={{ selected: on }} style={[styles.product, on && styles.productOn]} scaleTo={0.98}>
                        <ProductArt kind={x.kind} fill={x.fill} photo={x.photo} size={56} label={x.size} />
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={[type.section, { fontSize: 14.5 }]}>{x.name}</Text>
                          <Text style={type.caption}>{x.size} · ₹{x.price}</Text>
                        </View>
                        <SelectCheck selected={on} />
                      </PressableScale>
                    </Animated.View>
                  );
                })}
              </View>

              {/* 2 · Quantity and total, once a product is picked */}
              {p ? (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.card}>
                  <Text style={styles.groupLabel}>2 · How many?</Text>
                  <View style={styles.qtyRow}>
                    <Text style={[type.label, { flex: 1, color: color.ink }]}>₹{p.price} each</Text>
                    <PressableScale onPress={() => setQty((q) => Math.max(1, q - 1))} accessibilityLabel="Decrease quantity" style={styles.qtyBtn} scaleTo={0.9}><Minus size={18} color={color.ink} /></PressableScale>
                    <Animated.Text key={qty} entering={ZoomIn.duration(160)} style={styles.qtyN}>{qty}</Animated.Text>
                    <PressableScale onPress={() => setQty((q) => Math.min(20, q + 1))} accessibilityLabel="Increase quantity" style={styles.qtyBtn} scaleTo={0.9}><Plus size={18} color={color.ink} /></PressableScale>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.totalRow}>
                    <Text style={[type.section, { flex: 1 }]}>Total</Text>
                    <Text style={styles.total}>₹{total}</Text>
                  </View>
                </Animated.View>
              ) : null}

              <Text style={type.caption}>
                Delivered to the organisation&apos;s registered address. Demo payment: no real money is taken. Product images are for illustration only; no brand partnership is implied.
              </Text>
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
      {step === 'donate' ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>
          <Button label={paying ? 'Processing…' : p ? `Pay ₹${total}` : 'Choose a product'} disabled={!p || paying} onPress={pay} />
        </View>
      ) : null}
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
  card: { backgroundColor: color.surface, borderRadius: 20, padding: space[4], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  groupLabel: { fontFamily: font.bold, fontSize: 13, color: color.inkSecondary, letterSpacing: 0.2 },
  product: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], borderWidth: 1, borderColor: color.line },
  productOn: { borderColor: color.primary, backgroundColor: color.surfaceTint },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  qtyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.fill, alignItems: 'center', justifyContent: 'center' },
  qtyN: { fontFamily: font.extrabold, fontSize: 24, color: color.ink, minWidth: 32, textAlign: 'center' },
  divider: { height: 1, backgroundColor: color.line },
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  total: { fontFamily: font.extrabold, fontSize: 22, color: color.ink },
  footer: { paddingHorizontal: space[5], paddingTop: space[3], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
  thanks: { alignItems: 'center', gap: space[3] },
  center: { textAlign: 'center' },
  receipt: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: space[3], marginTop: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, ...shadow.card },
  ticks: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
  thanksActions: { alignSelf: 'stretch', gap: space[2], marginTop: space[3] },
});
