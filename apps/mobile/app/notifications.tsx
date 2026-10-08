import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellRing, Info, MessageCircle, PawPrint, Truck, type LucideIcon } from 'lucide-react-native';
import { ScreenHeader } from '@/src/ui';
import { color, pastel, shadow, space, type, type PastelName } from '@/src/theme';

type Key = 'cases' | 'caseChat' | 'adoption' | 'food';

const ITEMS: { key: Key; icon: LucideIcon; tone: PastelName; title: string; sub: string }[] = [
  { key: 'cases', icon: BellRing, tone: 'sky', title: 'Case updates', sub: 'When a team accepts, reaches or treats an animal you reported or took to care' },
  { key: 'caseChat', icon: MessageCircle, tone: 'lavender', title: 'Case chat replies', sub: 'New messages in case chats you took part in' },
  { key: 'adoption', icon: PawPrint, tone: 'peach', title: 'Adoption messages', sub: 'Replies about animals you listed or asked about' },
  { key: 'food', icon: Truck, tone: 'mint', title: 'Food donation updates', sub: 'When your donation is out for delivery or delivered' },
];

/**
 * Notification settings. SIMULATED DEMO: switches only change this screen; notifications are
 * simulated (NotificationLog) and the app never asks for the phone's notification permission here.
 * No "nearby distress" alerts: only your own reports and the cases you took to care.
 */
export default function NotificationSettings() {
  const insets = useSafeAreaInsets();
  const [on, setOn] = useState<Record<Key, boolean>>({ cases: true, caseChat: true, adoption: true, food: true });
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Notification settings" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[2], paddingBottom: space[8], gap: space[3] }} showsVerticalScrollIndicator={false}>
        <Text style={[type.body, { color: color.ink }]}>Choose what you want to hear about.</Text>
        <View style={styles.card}>
          {ITEMS.map((it, i) => (
            <View key={it.key} style={[styles.row, i < ITEMS.length - 1 && styles.rowLine]}>
              <View style={[styles.icon, { backgroundColor: pastel[it.tone].bg }]}><it.icon size={18} color={pastel[it.tone].ink} /></View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.section, { fontSize: 15 }]}>{it.title}</Text>
                <Text style={type.caption}>{it.sub}</Text>
              </View>
              <Switch
                value={on[it.key]}
                onValueChange={(v) => setOn((x) => ({ ...x, [it.key]: v }))}
                accessibilityLabel={it.title}
                trackColor={{ false: '#d9dee6', true: pastel.green.soft }}
                thumbColor="#ffffff"
                ios_backgroundColor="#d9dee6"
                // Web only: keep the knob white when on (react-native-web defaults it to teal).
                {...({ activeThumbColor: '#ffffff', activeTrackColor: pastel.green.soft } as object)}
              />
            </View>
          ))}
        </View>
        <View style={styles.note}>
          <Info size={15} color={color.inkSecondary} />
          <Text style={[type.caption, { flex: 1 }]}>You only get updates about animals you reported or took to care, never alerts about every case nearby. Demo: notifications are simulated in this prototype.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: 20, paddingHorizontal: space[4], borderWidth: 1, borderColor: color.line, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], minHeight: 64 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: color.line },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: space[2], paddingHorizontal: space[1] },
});
