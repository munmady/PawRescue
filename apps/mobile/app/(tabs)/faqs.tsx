import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronRight, LifeBuoy } from 'lucide-react-native';
import { PastelBackdrop } from '@/src/PastelBackdrop';
import { ProfileButton } from '@/src/ProfileButton';
import { FaqList } from '@/src/FaqList';
import { PressableScale } from '@/src/ui';
import { color, radius, shadow, space, type } from '@/src/theme';

/** FAQs tab (D142): "Who do I call?" questions (D141), with a link to Help and safety. Public, no sign-in. */
export default function Faqs() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: color.page }} contentContainerStyle={{ paddingTop: insets.top + space[2], paddingHorizontal: space[5], paddingBottom: 130, gap: space[4] }} showsVerticalScrollIndicator={false}>
      <PastelBackdrop />
      <Animated.View entering={FadeIn.duration(400)} style={styles.head}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.display}>FAQs</Text>
          <Text style={type.label}>Who to call, and common questions in Mumbai.</Text>
        </View>
        <ProfileButton />
      </Animated.View>

      <PressableScale onPress={() => router.push('/help')} accessibilityLabel="Help and safety" style={styles.helpCard}>
        <View style={styles.helpIcon}><LifeBuoy size={20} color={color.action} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[type.section, { fontSize: 15 }]}>Help and safety</Text>
          <Text style={type.caption}>Staying safe, bites and scratches, children</Text>
        </View>
        <ChevronRight size={18} color={color.inkMuted} />
      </PressableScale>

      <Text style={[type.section, { marginTop: space[1] }]}>Who do I call?</Text>
      <FaqList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  helpCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[4], borderWidth: 1, borderColor: color.line, ...shadow.card },
  helpIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
});
