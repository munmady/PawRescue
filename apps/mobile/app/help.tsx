import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Baby, Car, ChevronRight, CircleHelp, Droplets, HeartPulse, type LucideIcon } from 'lucide-react-native';
import { PressableScale, ScreenHeader } from '@/src/ui';
import { color, radius, shadow, space, type } from '@/src/theme';

const SECTIONS: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: Car, title: 'Staying safe', items: ['Keep a safe distance and don’t stand in traffic.', 'Don’t move an animal hit by a vehicle unless it’s in immediate danger.', 'Don’t give food or water to a badly injured animal.'] },
  { icon: Droplets, title: 'Bitten or scratched?', items: ['Wash with soap and running water for 15 minutes.', 'See a doctor the same day.'] },
  { icon: Baby, title: 'Children', items: ['Ask an adult. Never approach an injured animal.'] },
];

/** Help and safety (D129): public. Safety copy is illustrative until a veterinarian reviews it (A9). Who-do-I-call FAQs live in the FAQs tab (D141, D142). */
export default function Help() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Help and safety" />
      <ScrollView contentContainerStyle={{ padding: space[5], gap: space[3], paddingBottom: space[8] }}>
        {SECTIONS.map((s, i) => (
          <Animated.View key={s.title} entering={FadeInDown.delay(i * 60)} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.icon}><s.icon size={18} color={color.action} /></View>
              <Text style={type.section}>{s.title}</Text>
            </View>
            {s.items.map((t) => <Text key={t} style={[type.body, { color: color.ink }]}>• {t}</Text>)}
          </Animated.View>
        ))}
        <View style={styles.note}>
          <HeartPulse size={16} color={color.amberInk} />
          <Text style={[type.caption, { color: color.amberInk, flex: 1 }]}>Illustrative guidance, to be reviewed by a veterinarian before real use.</Text>
        </View>

        <PressableScale onPress={() => router.navigate('/faqs')} accessibilityLabel="Who do I call? See FAQs" style={styles.faqLink}>
          <View style={styles.icon}><CircleHelp size={18} color={color.action} /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.section}>Who do I call?</Text>
            <Text style={type.caption}>Animal hospitals, ambulances and helplines</Text>
          </View>
          <ChevronRight size={18} color={color.inkMuted} />
        </PressableScale>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], gap: space[2], ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginBottom: 4 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: space[2], backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3] },
  faqLink: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], borderWidth: 1, borderColor: color.line },
});
