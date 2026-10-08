import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Camera, ImagePlus, MapPin, Play, Plus, X } from 'lucide-react-native';
import type { Species } from '@animal/shared';
import { AnimalPhoto, Button, Pill, PressableScale, ScreenHeader, SheetDialog, Tag } from '@/src/ui';
import { useStore } from '@/src/store';
import { ADOPTION_PHOTOS, PROMO_PHOTOS, adoptionPhoto, type AdoptionPhotoKey } from '@/src/photos';
import type { AdoptionListing } from '@/src/data';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';
import { PastelBackdrop } from '@/src/PastelBackdrop';
import { ProfileButton } from '@/src/ProfileButton';
import { EmptyPets } from '@/src/EmptyPets';

/**
 * Adoption (D94, D103, D125, D126, D135). Never on the distress map. No pet management.
 * `tab`: shown as the Adoption tab (D139); `mine`: My adoption listings from Profile.
 */
export function AdoptionList({ mine, tab }: { mine?: boolean; tab?: boolean }) {
  const insets = useSafeAreaInsets();
  const { adoptions, requireAccount, addListing } = useStore();
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<'listings' | 'adopted'>('listings');
  const list = mine ? adoptions.filter((a) => a.mine) : adoptions;
  // Animals the poster marked as adopted by this user (D146).
  const adopted = mine ? adoptions.filter((a) => a.adoptedByMe) : [];

  return (
    <View style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      {tab ? <PastelBackdrop variant="adoption" /> : null}
      {tab ? (
        <View style={[styles.tabHead, { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={type.display}>Adopt a pet</Text>
            <Text style={type.label}>Rescued animals looking for a home near you</Text>
          </View>
          <ProfileButton />
        </View>
      ) : <ScreenHeader title={mine ? 'My adoption listings' : 'Adopt a pet'} />}
      <ScrollView contentContainerStyle={{ padding: space[5], paddingTop: tab ? space[3] : space[5], gap: space[4], paddingBottom: tab ? 130 : space[8] }} showsVerticalScrollIndicator={false}>
        {mine ? (
          <View style={styles.tabs}>
            <Pill label={`My listings${list.length ? ` · ${list.length}` : ''}`} selected={view === 'listings'} onPress={() => setView('listings')} />
            <Pill label={`Adopted by you${adopted.length ? ` · ${adopted.length}` : ''}`} selected={view === 'adopted'} onPress={() => setView('adopted')} />
          </View>
        ) : null}
        {mine && view === 'adopted' ? (
          adopted.length ? (
            <View style={styles.grid}>
              {adopted.map((a, i) => <Tile key={a.id} a={a} i={i} />)}
            </View>
          ) : (
            <EmptyPets title="You haven’t adopted an animal yet." image={PROMO_PHOTOS.basketFriends}>
              <Button label="Find a pet to adopt" variant="outline" style={styles.listBtn} onPress={() => router.navigate('/adoption')} />
            </EmptyPets>
          )
        ) : (
          <>
            {mine && list.length === 0 ? null : <Button label="List an animal" icon={Plus} variant="outline" style={styles.listBtn} onPress={() => requireAccount('Sign in to list an animal', () => setCreating(true))} />}
            {list.length === 0 ? (
              mine ? (
                <EmptyPets title="You haven’t listed an animal for adoption." image={PROMO_PHOTOS.basketFriends}>
                  <Button label="List an animal" icon={Plus} variant="outline" style={styles.listBtn} onPress={() => requireAccount('Sign in to list an animal', () => setCreating(true))} />
                </EmptyPets>
              ) : (
                <Text style={[type.label, { textAlign: 'center', marginTop: space[6] }]}>No animals listed for adoption near you right now.</Text>
              )
            ) : (
              <View style={styles.grid}>
                {list.map((a, i) => <Tile key={a.id} a={a} i={i} />)}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <CreateSheet visible={creating} onClose={() => setCreating(false)} onSubmit={(l) => { addListing(l); setCreating(false); }} />
    </View>
  );
}

function Tile({ a, i }: { a: AdoptionListing; i: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(i * 60)} style={styles.tileWrap}>
      <PressableScale onPress={() => router.push(`/adoption/${a.id}`)} accessibilityLabel={`Open ${a.name ?? 'listing'}`} style={styles.tile}>
        <AnimalPhoto species={a.species} photo={adoptionPhoto(a)} count={a.media && a.media.length > 1 ? a.media.length : undefined} style={{ height: 130, borderRadius: radius.sm }} iconSize={44} />
        <View style={{ padding: space[3], gap: 4 }}>
          <Tag label={a.status} tone={a.status === 'Adopted' ? 'success' : 'amber'} />
          <Text style={type.section} numberOfLines={1}>{a.name ?? (a.species === 'dog' ? 'Dog' : a.species === 'cat' ? 'Cat' : 'Animal')} · {a.age}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} color={color.inkSecondary} />
            <Text style={type.caption}>{a.area}</Text>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

// Sample media for the demo camera and gallery, matching the chosen animal.
const DEMO_MEDIA: Record<Species, AdoptionPhotoKey[]> = {
  dog: ['puppy-tan', 'dog-golden', 'puppy-black-tan', 'dog-black'],
  cat: ['kitten-white-tabby', 'kitten-calico', 'kitten-tabby', 'cat-orange'],
  other: ['puppy-tan', 'kitten-white-tabby', 'dog-golden', 'kitten-calico'],
};

function CreateSheet({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (l: Omit<AdoptionListing, 'id' | 'status' | 'mine' | 'poster'>) => void }) {
  const [species, setSpecies] = useState<Species>('cat');
  const [gender, setGender] = useState<AdoptionListing['gender']>('Unknown');
  const [vacc, setVacc] = useState<AdoptionListing['vaccination']>('Unknown');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<{ id: number; kind: 'photo' | 'video'; photo: AdoptionPhotoKey }[]>([]);
  const ok = age.trim() && description.trim();
  // SIMULATED DEMO: the camera and gallery hand back sample photos; the gallery alternates in a video.
  const add = (kind: 'photo' | 'video') => setMedia((m) => (m.length >= 4 ? m : [...m, { id: Date.now(), kind, photo: DEMO_MEDIA[species][m.length % 4] }]));
  return (
    <SheetDialog visible={visible} onClose={onClose}>
      <Text style={type.title}>List an animal</Text>
      <View style={{ gap: space[2] }}>
        <Text style={styles.label}>Photos and videos <Text style={styles.optional}>Up to 4</Text></Text>
        <View style={styles.mediaRow}>
          {media.map((m) => (
            <Animated.View key={m.id} entering={FadeInDown.duration(200)} style={styles.thumb}>
              <AnimalPhoto species={species} photo={ADOPTION_PHOTOS[m.photo]} style={StyleSheet.absoluteFill} iconSize={24} />
              {m.kind === 'video' ? <View style={styles.videoTag}><Play size={9} color="#fff" /><Text style={styles.videoText}>0:12</Text></View> : null}
              <PressableScale onPress={() => setMedia((x) => x.filter((y) => y.id !== m.id))} accessibilityLabel="Remove" hitSlop={6} style={styles.remove} scaleTo={0.85}>
                <X size={12} color={color.ink} />
              </PressableScale>
            </Animated.View>
          ))}
          {media.length < 4 ? (
            <>
              <PressableScale onPress={() => add('photo')} accessibilityLabel="Take a photo" style={styles.addTile} scaleTo={0.95}>
                <Camera size={18} color={color.action} />
                <Text style={styles.addText}>Camera</Text>
              </PressableScale>
              <PressableScale onPress={() => add(media.length % 2 ? 'video' : 'photo')} accessibilityLabel="Choose photos or videos from gallery" style={styles.addTile} scaleTo={0.95}>
                <ImagePlus size={18} color={color.action} />
                <Text style={styles.addText}>Gallery</Text>
              </PressableScale>
            </>
          ) : null}
        </View>
        <Text style={type.caption}>{media.length} / 4{media.length === 4 ? ' · Maximum reached. Remove one to add another.' : ''}</Text>
      </View>
      <View style={styles.row}>{(['dog', 'cat', 'other'] as Species[]).map((s) => <Pill key={s} label={s === 'dog' ? 'Dog' : s === 'cat' ? 'Cat' : 'Other'} selected={species === s} onPress={() => setSpecies(s)} />)}</View>
      <TextInput style={styles.input} placeholder="Name (if known)" placeholderTextColor={color.inkSubtle} value={name} onChangeText={setName} accessibilityLabel="Name" />
      <TextInput style={styles.input} placeholder="Approximate age, e.g. ~4 months" placeholderTextColor={color.inkSubtle} value={age} onChangeText={setAge} accessibilityLabel="Approximate age" />
      <View style={styles.row}>{(['Male', 'Female', 'Unknown'] as const).map((g) => <Pill key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />)}</View>
      <TextInput style={[styles.input, { minHeight: 70 }]} multiline placeholder="Description" placeholderTextColor={color.inkSubtle} value={description} onChangeText={setDescription} accessibilityLabel="Description" />
      <View style={styles.row}>{(['Vaccinated', 'Partially vaccinated', 'Not vaccinated', 'Unknown'] as const).map((v) => <Pill key={v} label={v} selected={vacc === v} onPress={() => setVacc(v)} />)}</View>
      <Button label="Publish" disabled={!ok} onPress={() => onSubmit({ name: name || undefined, species, age, gender, area: 'Andheri East', description, temperament: '', vaccination: vacc, requirements: '', photo: media[0]?.photo, media: media.length ? media.map(({ kind, photo }) => ({ kind, photo })) : undefined })} />
    </SheetDialog>
  );
}

const styles = StyleSheet.create({
  tabHead: { paddingHorizontal: space[5], paddingTop: space[2], gap: 4 },
  listBtn: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: pastel.lavender.soft, boxShadow: '0 6px 16px rgba(91, 69, 196, 0.14)' },
  tabs: { flexDirection: 'row', gap: space[2] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  tileWrap: { width: '47.8%' },
  tile: { backgroundColor: color.surface, borderRadius: radius.md, overflow: 'hidden', ...shadow.card },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  label: { fontFamily: font.bold, fontSize: 13, color: color.inkSecondary },
  optional: { fontFamily: font.semibold, fontSize: 12, color: color.inkMuted },
  mediaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  thumb: { width: 68, height: 68, borderRadius: radius.sm, overflow: 'hidden' },
  addTile: { width: 68, height: 68, borderRadius: radius.sm, borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.primary, alignItems: 'center', justifyContent: 'center', gap: 3 },
  addText: { fontFamily: font.bold, fontSize: 11, color: color.action },
  remove: { position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  videoTag: { position: 'absolute', left: 4, bottom: 4, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(31,41,55,0.72)', borderRadius: radius.pill, paddingHorizontal: 5, paddingVertical: 1 },
  videoText: { fontFamily: font.bold, fontSize: 9, color: '#fff' },
  input: { borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingHorizontal: space[3], paddingVertical: 10, fontFamily: font.regular, fontSize: 15, color: color.ink },
});
