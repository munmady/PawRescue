import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Baby, Car, Check, ChevronRight, Droplets, HeartPulse, type LucideIcon } from 'lucide-react-native';
import { GradientFill } from '@/src/PastelBackdrop';
import { PROMO_PHOTOS } from '@/src/photos';
import { StandaloneNavBar } from '@/src/BottomNav';
import { PressableScale, ScreenHeader } from '@/src/ui';
import { color, pastel, radius, shadow, space, type, type PastelName } from '@/src/theme';

const SECTIONS: { icon: LucideIcon; tone: PastelName; title: string; items: string[] }[] = [
  { icon: Car, tone: 'sky', title: 'Staying safe', items: ['Keep a safe distance and don’t stand in traffic.', 'Don’t move an animal hit by a vehicle unless it’s in immediate danger.', 'Don’t give food or water to a badly injured animal.'] },
  { icon: Droplets, tone: 'peach', title: 'Bitten or scratched?', items: ['Wash with soap and running water for 15 minutes.', 'See a doctor the same day.'] },
  { icon: Baby, tone: 'lavender', title: 'Children', items: ['Ask an adult. Never approach an injured animal.'] },
];

/** Help and safety (D129): public. Safety copy is illustrative until a veterinarian reviews it (A9). Who-do-I-call FAQs live in the FAQs tab (D141, D142). */
export default function Help() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Help and safety" />
      <ScrollView contentContainerStyle={{ padding: space[5], gap: space[3], paddingBottom: 130 }}>
        {SECTIONS.map((s, i) => (
          <Animated.View key={s.title} entering={FadeInDown.delay(i * 60)} style={styles.card}>
            <View style={styles.head}>
              <View style={[styles.icon, { backgroundColor: pastel[s.tone].bg }]}><s.icon size={18} color={pastel[s.tone].ink} /></View>
              <Text style={type.section}>{s.title}</Text>
            </View>
            <View style={styles.list}>
              {s.items.map((t) => (
                <View key={t} style={styles.item}>
                  <Check size={16} color={pastel[s.tone].ink} strokeWidth={2.6} style={{ marginTop: 3, marginLeft: 10 }} />
                  <Text style={[type.body, styles.itemText]}>{t}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
        <View style={styles.note}>
          <HeartPulse size={16} color={color.amberInk} />
          <Text style={[type.caption, { color: color.amberInk, flex: 1 }]}>Illustrative guidance, to be reviewed by a veterinarian before real use.</Text>
        </View>

        <PressableScale onPress={() => router.navigate('/faqs')} accessibilityLabel="FAQs: important contacts and common questions in Mumbai" style={styles.faqLink}>
          {/* Orange "Gradient 3" laid horizontally, deeper rust behind the text. */}
          <GradientFill colors={['#BC430D', '#F09410']} id="help-faq-banner" horizontal />
          <Image source={PROMO_PHOTOS.medicalCall} style={styles.faqArt} resizeMode="contain" accessibilityIgnoresInvertColors />
          <View style={{ flex: 1 }}>
            <Text style={[type.section, { fontSize: 15, color: '#ffffff' }]}>FAQs</Text>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)' }]}>Important contacts and common questions in Mumbai.</Text>
          </View>
          <View style={styles.faqGo}><ChevronRight size={18} color="#ffffff" /></View>
        </PressableScale>
      </ScrollView>
      <StandaloneNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: 20, padding: space[4], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  list: { gap: space[3] },
  // Tick centred under the 36 px section icon (10 + 16/2 = 18), text lined up with the section title (36 + 12).
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 22 },
  itemText: { flex: 1, color: color.ink, lineHeight: 22 },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingBottom: space[3], borderBottomWidth: 1, borderBottomColor: color.line },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: space[2], backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3] },
  faqLink: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: 'transparent', borderRadius: radius.md, padding: space[4], overflow: 'hidden', boxShadow: '0 10px 24px rgba(188,67,13,0.30)' },
  faqArt: { width: 48, height: 43 },
  faqGo: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
});
