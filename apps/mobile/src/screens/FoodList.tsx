import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight, Truck } from 'lucide-react-native';
import { PressableScale, ScreenHeader } from '@/src/ui';
import { timeAgo, useStore } from '@/src/store';
import { ProductArt } from '@/src/ProductArt';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';
import { PastelBackdrop } from '@/src/PastelBackdrop';

/**
 * Food donations (D95, D104, D120, D124): product-based only.
 * `tab`: shown as the Donation tab (D139); `mine`: My food donations from Profile.
 */
export function FoodList({ mine, tab }: { mine?: boolean; tab?: boolean }) {
  const insets = useSafeAreaInsets();
  const { foodRequests, donations } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      {tab ? <PastelBackdrop variant="donation" /> : null}
      {tab ? (
        <View style={styles.tabHead}>
          <Text style={type.display}>Food donations</Text>
          <Text style={type.label}>Verified shelters and vets asking for specific food</Text>
        </View>
      ) : <ScreenHeader title={mine ? 'My food donations' : 'Food donations'} />}
      <ScrollView contentContainerStyle={{ padding: space[5], paddingTop: tab ? space[3] : space[5], gap: space[3], paddingBottom: tab ? 130 : space[8] }} showsVerticalScrollIndicator={false}>
        {mine ? (
          donations.length === 0 ? (
            <Text style={[type.label, { textAlign: 'center', marginTop: space[8] }]}>You haven&apos;t donated food yet.</Text>
          ) : donations.map((d, i) => (
            <Animated.View key={d.id} entering={FadeInDown.delay(i * 50)} style={styles.card}>
              <View style={styles.row}>
                <ProductArt kind={d.kind ?? 'dry-cat'} photo={d.photo} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={type.section}>{d.product} × {d.quantity}</Text>
                  <Text style={type.caption}>{d.org} · ₹{d.amount} · {timeAgo(d.at)}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Badge label={`Payment: ${d.payment}`} />
                <Badge label={d.delivery} icon />
                <Badge label="Open" />
              </View>
            </Animated.View>
          ))
        ) : foodRequests.map((r, i) => (
          <Animated.View key={r.id} entering={FadeInDown.delay(i * 60)}>
            <PressableScale onPress={() => router.push(`/food/${r.id}`)} accessibilityLabel={`Open request from ${r.org}`} style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={type.caption}>{r.org}</Text>
                  <Text style={type.section}>{r.need}</Text>
                  <Text style={[type.caption, { color: color.successInk }]}>{r.status} · {r.products.length} product{r.products.length > 1 ? 's' : ''}</Text>
                </View>
                <ChevronRight size={18} color={color.inkMuted} />
              </View>
              <View style={styles.packs}>
                {r.products.map((x) => (
                  <View key={x.id} style={styles.pack}>
                    <ProductArt kind={x.kind} fill={x.fill} photo={x.photo} size={76} label={x.size} />
                    <View style={styles.weight}><Text style={styles.weightText} numberOfLines={1}>{x.size}</Text></View>
                  </View>
                ))}
              </View>
            </PressableScale>
          </Animated.View>
        ))}
        {!mine && foodRequests.length === 0 ? <Text style={type.label}>No food donation requests right now.</Text> : null}
      </ScrollView>
    </View>
  );
}

function Badge({ label, icon }: { label: string; icon?: boolean }) {
  return (
    <View style={styles.badge}>
      {icon ? <Truck size={12} color={color.infoInk} /> : null}
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabHead: { paddingHorizontal: space[5], paddingTop: space[2], gap: 4 },
  card: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: space[3], ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  packs: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  pack: { flexBasis: '31%', flexGrow: 0, alignItems: 'center', gap: space[2], paddingVertical: space[3], paddingHorizontal: 6, borderRadius: radius.md, backgroundColor: '#ffffff', borderWidth: 1, borderColor: color.line, boxShadow: '0 4px 12px rgba(110, 130, 170, 0.10)' },
  weight: { maxWidth: '100%', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: pastel.mint.bg, borderWidth: 1, borderColor: pastel.mint.soft },
  weightText: { fontFamily: font.bold, fontSize: 11, color: pastel.mint.ink },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color.surfaceTint, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: font.bold, fontSize: 11.5, color: color.infoInk },
});
