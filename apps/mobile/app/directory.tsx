import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { BadgeCheck, Building2, Clock, MapPin, Phone, Plus, Stethoscope } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button, PressableScale, ScreenHeader } from '@/src/ui';
import { useStore } from '@/src/store';
import { DEMO_CALL } from '@/src/actions';
import { ORGANISATIONS } from '@/src/data';
import { StandaloneNavBar } from '@/src/BottomNav';
import { color, radius, shadow, space, type } from '@/src/theme';

/** Public directory (D102): information only; never the transport destination picker. */
export default function Directory() {
  const insets = useSafeAreaInsets();
  const { showToast } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Vets and organisations" />
      <ScrollView contentContainerStyle={{ padding: space[5], gap: space[3], paddingBottom: 130 }}>
        <Button label="Register your organisation" icon={Plus} variant="outline" onPress={() => router.push('/register-org')} />
        <Text style={type.label}>Registered veterinary hospitals, rescue organisations and shelter homes near you.</Text>
        {ORGANISATIONS.map((o, i) => {
          const Icon = o.type === 'Veterinary hospital' ? Stethoscope : Building2;
          const on = open === o.id;
          return (
            <Animated.View key={o.id} entering={FadeInDown.delay(i * 50)} layout={LinearTransition.duration(220)} style={styles.card}>
              <PressableScale onPress={() => setOpen(on ? null : o.id)} accessibilityLabel={o.name} style={styles.head} scaleTo={0.99}>
                <View style={styles.icon}><Icon size={20} color={color.action} /></View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={type.section}>{o.name}</Text>
                  <View style={styles.meta}>
                    <Text style={type.caption}>{o.type}</Text>
                    <BadgeCheck size={13} color={color.successInk} />
                    <Text style={[type.caption, { color: color.successInk }]}>Verified</Text>
                  </View>
                </View>
                <Text style={type.section}>{o.distanceKm} km</Text>
              </PressableScale>
              {on ? (
                <Animated.View entering={FadeInDown.duration(200)} style={{ gap: space[2], marginTop: space[3] }}>
                  <View style={styles.meta}><MapPin size={14} color={color.inkSecondary} /><Text style={type.label}>{o.area}</Text></View>
                  <View style={styles.meta}><Clock size={14} color={color.inkSecondary} /><Text style={type.label}>{o.hours}</Text></View>
                  <Text style={type.label}>{o.services}</Text>
                  <Button label="Call" icon={Phone} variant="outline" onPress={() => showToast(DEMO_CALL)} />
                </Animated.View>
              ) : null}
            </Animated.View>
          );
        })}
        <Text style={type.caption}>All organisations in this prototype are fictional.</Text>
      </ScrollView>
      <StandaloneNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
});
