import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { PROMO_PHOTOS } from '@/src/photos';
import { GradientFill, PastelBackdrop } from '@/src/PastelBackdrop';
import { ProfileButton } from '@/src/ProfileButton';
import { FaqList } from '@/src/FaqList';
import { PressableScale } from '@/src/ui';
import { color, radius, space, type } from '@/src/theme';

/** FAQs tab (D142): "Who do I call?" questions (D141), with a link to Help and safety. Public, no sign-in. */
export default function Faqs() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: color.page }} contentContainerStyle={{ paddingTop: insets.top + space[2], paddingHorizontal: space[5], paddingBottom: 130, gap: space[4] }} showsVerticalScrollIndicator={false}>
      <PastelBackdrop />
      <Animated.View entering={FadeIn.duration(400)} style={styles.head}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.display}>FAQs</Text>
          <Text style={type.label}>Important contacts and common questions in Mumbai.</Text>
        </View>
        <ProfileButton />
      </Animated.View>

      <PressableScale onPress={() => router.push('/help')} accessibilityLabel="Help and safety" style={styles.helpCard}>
        {/* "Gradient 3" laid horizontally: deep forest behind the text, rising to lime on the right. */}
        <GradientFill colors={['#0C342C', '#076653', '#E3EF26']} id="faq-help-banner" horizontal />
        <Image source={PROMO_PHOTOS.firstAidKit} style={styles.helpArt} resizeMode="contain" accessibilityIgnoresInvertColors />
        <View style={{ flex: 1 }}>
          <Text style={[type.section, { fontSize: 15, color: '#ffffff' }]}>Help and safety</Text>
          <Text style={[type.caption, { color: 'rgba(255,255,255,0.78)' }]}>Staying safe, bites and scratches, children</Text>
        </View>
        <View style={styles.helpGo}><ChevronRight size={18} color="#0C342C" strokeWidth={2.6} /></View>
      </PressableScale>

      <FaqList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  helpCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: 'transparent', borderRadius: radius.md, padding: space[4], overflow: 'hidden', boxShadow: '0 10px 24px rgba(12,52,44,0.30)' },
  helpArt: { width: 48, height: 43 },
  helpGo: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
});
