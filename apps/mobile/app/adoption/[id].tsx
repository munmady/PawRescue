import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Cake, ClipboardCheck, MapPin, MessageCircle, Play, Smile, Syringe, VenusAndMars, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { AnimalPhoto, Button, PressableScale, ScreenHeader, SelectCheck, SheetDialog, Tag } from '@/src/ui';
import { useStore } from '@/src/store';
import { listingName, listingRef } from '@/src/actions';
import { ADOPTION_PHOTOS, adoptionPhoto } from '@/src/photos';
import { color, font, pastel, radius, shadow, space, type, type PastelName } from '@/src/theme';

/**
 * Adoption listing (ADOPT-02): hero card with the photo inside it, quick facts,
 * an About card, the poster, and the main action pinned at the bottom (D94, D125).
 */
export default function AdoptionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { adoptions, adoptionChats, requireAccount, markAdopted, removeListing } = useStore();
  const [picking, setPicking] = useState(false);
  const [page, setPage] = useState(0);
  const [adopter, setAdopter] = useState<string | null>(null);
  const a = adoptions.find((x) => x.id === id);
  if (!a) return null;
  // People who chatted with the poster about this listing (D146). SIMULATED DEMO: other users can't
  // message in the prototype, so a listing with no chats offers two fictional demo names.
  const chatted = [...new Set(adoptionChats.filter((m) => m.listingId === a.id && !m.mine).map((m) => m.from))];
  const candidates = chatted.length ? chatted : ['Riya (demo)', 'Arjun (demo)'];
  const name = listingName(a);
  const ref = listingRef(a);
  const photoW = Math.min(width, 440) - space[5] * 2 - 2;
  const gallery = a.media ?? [];
  const facts: { icon: LucideIcon; k: string; v: string; tone: PastelName }[] = [
    { icon: Cake, k: 'Age', v: a.age, tone: 'peach' },
    { icon: VenusAndMars, k: 'Gender', v: a.gender, tone: 'lavender' },
    { icon: Syringe, k: 'Vaccination', v: a.vaccination, tone: 'mint' },
  ];
  const footer = a.mine ? (
    <>
      {a.status === 'Available' ? <Button label="Mark adopted" onPress={() => { setAdopter(null); setPicking(true); }} /> : null}
      <Button label="Remove listing" variant="outline" onPress={() => { removeListing(a.id); router.back(); }} />
    </>
  ) : a.status === 'Available' ? (
    <Button label="Chat with poster" icon={MessageCircle} onPress={() => requireAccount('Sign in to chat with the poster', () => router.push(`/adoption/chat/${a.id}`))} />
  ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title="Adopt a pet" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: space[2], gap: space[3], paddingBottom: space[6] }} showsVerticalScrollIndicator={false}>
        {/* Hero card: photo inside, then name, tags and quick facts. */}
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.card, styles.heroCard]}>
          {gallery.length > 1 ? (
            <View>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEventThrottle={32} onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / photoW))}>
                {gallery.map((m, i) => (
                  <View key={i} style={{ width: photoW, height: 260 }}>
                    <AnimalPhoto species={a.species} photo={ADOPTION_PHOTOS[m.photo]} style={{ width: photoW, height: 260, borderRadius: 0 }} iconSize={80} />
                    {m.kind === 'video' ? <View style={styles.videoBadge}><Play size={12} color="#fff" /><Text style={styles.videoText}>0:12</Text></View> : null}
                  </View>
                ))}
              </ScrollView>
              <View style={styles.dots} pointerEvents="none">
                {gallery.map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotOn]} />)}
              </View>
            </View>
          ) : (
            <AnimalPhoto species={a.species} photo={adoptionPhoto(a)} style={{ width: photoW, height: 260, borderRadius: 0 }} iconSize={80} />
          )}
          <View style={styles.heroBody}>
            <Text style={type.display}>{name}</Text>
            <View style={styles.tags}>
              <Tag label={a.adoptedByMe ? 'Adopted by you' : a.status} tone={a.status === 'Adopted' ? 'success' : 'amber'} />
              <Tag label={a.area} tone="neutral" icon={MapPin} />
              {a.mine && a.adopter ? <Tag label={`Adopted by ${a.adopter}`} tone="neutral" /> : null}
            </View>
            <View style={styles.facts}>
              {facts.map((f) => (
                <View key={f.k} style={styles.fact}>
                  <f.icon size={16} color={pastel[f.tone].ink} />
                  <Text style={styles.factV} numberOfLines={2}>{f.v}</Text>
                  <Text style={[type.caption, { color: pastel[f.tone].ink }]}>{f.k}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(90).duration(300)} style={styles.card}>
          <Text style={styles.cardTitle}>About {ref}</Text>
          <Text style={[type.body, { color: color.ink }]}>{a.description}</Text>
          {a.temperament ? <InfoRow icon={Smile} tone="sky" label="Temperament" value={a.temperament} /> : null}
          {a.requirements ? <InfoRow icon={ClipboardCheck} tone="sage" label="Adoption requirements" value={a.requirements} /> : null}
        </Animated.View>

        {/* Poster */}
        <Animated.View entering={FadeInDown.delay(160).duration(300)} style={[styles.card, styles.posterCard]}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{a.poster[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={type.caption}>Listed by</Text>
            <Text style={[type.section, { fontSize: 15 }]}>{a.mine ? 'You' : a.poster}</Text>
          </View>
        </Animated.View>
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>{footer}</View> : null}

      <SheetDialog visible={picking} onClose={() => setPicking(false)}>
        <Text style={type.title}>Who adopted {ref}?</Text>
        <Text style={type.label}>Choose the person from your chats. {a.name ?? `The ${a.species === 'other' ? 'animal' : a.species}`} will appear under Adopted by you on their profile.</Text>
        <View style={{ gap: space[2] }}>
          {[...candidates, 'Someone else'].map((p) => {
            const on = adopter === p;
            return (
              <PressableScale key={p} onPress={() => setAdopter(p)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={p} style={[styles.person, on && styles.personOn]} scaleTo={0.98}>
                <View style={styles.personAvatar}><Text style={styles.personInitial}>{p === 'Someone else' ? '?' : p[0]}</Text></View>
                <Text style={[type.section, { flex: 1, fontSize: 14.5 }]}>{p === 'Someone else' ? 'Someone not in my chats' : p}</Text>
                <SelectCheck selected={on} />
              </PressableScale>
            );
          })}
        </View>
        <Button label="Mark adopted" disabled={!adopter} onPress={() => { markAdopted(a.id, adopter === 'Someone else' ? undefined : adopter ?? undefined); setPicking(false); }} />
      </SheetDialog>
    </View>
  );
}

function InfoRow({ icon: Icon, tone, label, value }: { icon: LucideIcon; tone: PastelName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: pastel[tone].bg }]}><Icon size={17} color={pastel[tone].ink} /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.caption}>{label}</Text>
        <Text style={[type.label, { color: color.ink }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: 20, padding: space[4], gap: space[3], borderWidth: 1, borderColor: color.line, ...shadow.card },
  heroCard: { padding: 0, gap: 0, overflow: 'hidden' },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  dotOn: { width: 16, backgroundColor: '#ffffff' },
  videoBadge: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(31,41,55,0.72)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  videoText: { fontFamily: font.bold, fontSize: 11, color: '#fff' },
  heroBody: { padding: space[4], gap: space[3] },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  facts: { flexDirection: 'row', gap: space[2] },
  fact: { flex: 1, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[2], alignItems: 'center', gap: 3 },
  factV: { fontFamily: font.bold, fontSize: 13.5, color: color.ink, textAlign: 'center' },
  cardTitle: { fontFamily: font.bold, fontSize: 16, color: color.ink },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  infoIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  posterCard: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: pastel.lavender.bg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: font.extrabold, fontSize: 17, color: pastel.lavender.ink },
  person: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3], borderRadius: radius.md, borderWidth: 1, borderColor: color.line, backgroundColor: color.surface },
  personOn: { borderColor: color.primary, backgroundColor: color.surfaceTint },
  personAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: pastel.lavender.bg, alignItems: 'center', justifyContent: 'center' },
  personInitial: { fontFamily: font.extrabold, fontSize: 15, color: pastel.lavender.ink },
  footer: { paddingHorizontal: space[5], paddingTop: space[3], gap: space[2], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});
