import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FileClock } from 'lucide-react-native';
import { ScreenHeader } from './ui';
import { color, font, radius, shadow, space, type } from './theme';

export interface InfoSection { title: string; body: string[] }

/** Simple text page (Privacy, Terms): a draft note, then one card per section. */
export function InfoPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: InfoSection[] }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={title} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[2], paddingBottom: space[8], gap: space[3] }} showsVerticalScrollIndicator={false}>
        <View style={styles.draft}>
          <FileClock size={16} color={color.amberInk} />
          <Text style={[type.caption, { color: color.amberInk, flex: 1 }]}>Draft for the prototype · last updated {updated}. To be reviewed before real use.</Text>
        </View>
        <Text style={[type.body, { color: color.ink }]}>{intro}</Text>
        {sections.map((s, i) => (
          <Animated.View key={s.title} entering={FadeInDown.delay(i * 40).duration(260)} style={styles.card}>
            <Text style={styles.title}>{i + 1}. {s.title}</Text>
            {s.body.map((p) => <Text key={p} style={[type.label, { color: color.ink }]}>{p}</Text>)}
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  draft: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.amberTint, borderRadius: radius.md, padding: space[3] },
  card: { backgroundColor: color.surface, borderRadius: 20, padding: space[4], gap: space[2], borderWidth: 1, borderColor: color.line, ...shadow.card },
  title: { fontFamily: font.bold, fontSize: 15.5, color: color.ink },
});
