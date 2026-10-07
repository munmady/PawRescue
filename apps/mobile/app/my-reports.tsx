import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { casePhoto } from '@/src/photos';
import { AnimalPhoto, Pill, PressableScale, ScreenHeader, StatusChip } from '@/src/ui';
import { timeAgo, useStore } from '@/src/store';
import { color, radius, shadow, space, type } from '@/src/theme';

/** My Reports (D88): cases I reported and cases I personally started transporting. */
export default function MyReports() {
  const insets = useSafeAreaInsets();
  const { cases, reportedIds, transportedIds } = useStore();
  const [tab, setTab] = useState<'all' | 'active' | 'closed'>('all');
  const mine = cases.filter((c) => reportedIds.includes(c.id) || transportedIds.includes(c.id));
  const closed = (s: string) => s === 'CLOSED' || s === 'CANCELLED';
  const list = tab === 'all' ? mine : mine.filter((c) => (tab === 'closed' ? closed(c.status) : !closed(c.status)));
  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="My reports" />
      <View style={styles.tabs}>
        <Pill label="All" selected={tab === 'all'} onPress={() => setTab('all')} />
        <Pill label="Active" selected={tab === 'active'} onPress={() => setTab('active')} />
        <Pill label="Closed" selected={tab === 'closed'} onPress={() => setTab('closed')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: space[5], gap: space[3] }}>
        {list.length === 0 ? (
          <Text style={[type.label, { textAlign: 'center', marginTop: space[8] }]}>No reports yet. Cases you report or take to care will appear here.</Text>
        ) : list.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.delay(i * 50)} exiting={FadeOut.duration(150)} layout={LinearTransition.springify().damping(20)}>
            <PressableScale onPress={() => router.push(`/case/${c.id}`)} accessibilityLabel={`Open ${c.title}`} style={styles.row}>
              <AnimalPhoto species={c.species} photo={casePhoto(c)} sensitive={c.sensitive} style={{ width: 56, height: 56 }} iconSize={24} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={type.section}>{c.title} · {c.area}</Text>
                <StatusChip c={c} size="sm" />
                <Text style={type.caption}>{transportedIds.includes(c.id) ? 'You took this animal to care' : `Reported ${timeAgo(c.reportedAt)}`}</Text>
              </View>
              <ChevronRight size={18} color={color.inkMuted} />
            </PressableScale>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: space[2], paddingHorizontal: space[5] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.md, padding: space[3], ...shadow.card },
});
