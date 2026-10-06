import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MapPin, MessageCircle } from 'lucide-react-native';
import { AnimalPhoto, Button, ScreenHeader } from '@/src/ui';
import { useStore } from '@/src/store';
import { adoptionPhoto } from '@/src/photos';
import { color, font, radius, shadow, space, type } from '@/src/theme';

export default function AdoptionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { adoptions, requireAccount, markAdopted, removeListing } = useStore();
  const a = adoptions.find((x) => x.id === id);
  if (!a) return null;
  const facts = [
    { k: 'Age', v: a.age },
    { k: 'Gender', v: a.gender },
    { k: 'Vaccination', v: a.vaccination },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="" />
      <ScrollView contentContainerStyle={{ paddingBottom: space[8] }}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.hero}>
          <View style={styles.disc}>
            <AnimalPhoto species={a.species} photo={adoptionPhoto(a)} style={{ width: 200, height: 200, borderRadius: 100 }} iconSize={80} />
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.sheet}>
          <View style={styles.grab} />
          <Text style={type.display}>{a.name ?? (a.species === 'dog' ? 'Dog' : 'Cat')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color={color.inkSecondary} /><Text style={type.label}>{a.area} · {a.status}</Text>
          </View>
          <View style={styles.facts}>
            {facts.map((f) => (
              <View key={f.k} style={styles.fact}>
                <Text style={styles.factV} numberOfLines={2}>{f.v}</Text>
                <Text style={type.caption}>{f.k}</Text>
              </View>
            ))}
          </View>
          <Text style={type.section}>About</Text>
          <Text style={type.body}>{a.description}</Text>
          {a.temperament ? <Text style={type.body}>Temperament: {a.temperament}</Text> : null}
          {a.requirements ? <Text style={type.body}>Adoption requirements: {a.requirements}</Text> : null}
          <Text style={type.caption}>Listed by {a.poster}</Text>
          {a.mine ? (
            <View style={{ gap: space[2] }}>
              {a.status === 'Available' ? <Button label="Mark adopted" onPress={() => markAdopted(a.id)} /> : null}
              <Button label="Remove listing" variant="outline" onPress={() => { removeListing(a.id); router.back(); }} />
            </View>
          ) : a.status === 'Available' ? (
            <Button label="Chat with poster" icon={MessageCircle} onPress={() => requireAccount('Sign in to chat with the poster', () => router.push(`/adoption/chat/${a.id}`))} />
          ) : null}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: space[4] },
  disc: { width: 240, height: 240, borderRadius: 120, backgroundColor: color.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space[6], gap: space[3], ...shadow.sheet, minHeight: 420 },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: color.line, alignSelf: 'center' },
  facts: { flexDirection: 'row', gap: space[2] },
  fact: { flex: 1, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[2], alignItems: 'center', gap: 2 },
  factV: { fontFamily: font.bold, fontSize: 14, color: color.ink, textAlign: 'center' },
});
