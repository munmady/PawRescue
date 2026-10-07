import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MapPin, Plus } from 'lucide-react-native';
import type { Species } from '@animal/shared';
import { AnimalPhoto, Button, Pill, PressableScale, ScreenHeader, SheetDialog, Tag } from '@/src/ui';
import { useStore } from '@/src/store';
import { adoptionPhoto } from '@/src/photos';
import type { AdoptionListing } from '@/src/data';
import { color, font, pastel, radius, shadow, space, type } from '@/src/theme';
import { PastelBackdrop } from '@/src/PastelBackdrop';
import { ProfileButton } from '@/src/ProfileButton';

/**
 * Adoption (D94, D103, D125, D126, D135). Never on the distress map. No pet management.
 * `tab`: shown as the Adoption tab (D139); `mine`: My adoption listings from Profile.
 */
export function AdoptionList({ mine, tab }: { mine?: boolean; tab?: boolean }) {
  const insets = useSafeAreaInsets();
  const { adoptions, requireAccount, addListing } = useStore();
  const [creating, setCreating] = useState(false);
  const list = mine ? adoptions.filter((a) => a.mine) : adoptions;

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
        <Button label="List an animal" icon={Plus} variant="outline" style={styles.listBtn} onPress={() => requireAccount('Sign in to list an animal', () => setCreating(true))} />
        {list.length === 0 ? (
          <Text style={[type.label, { textAlign: 'center', marginTop: space[6] }]}>
            {mine ? 'You haven’t listed an animal for adoption.' : 'No animals listed for adoption near you right now.'}
          </Text>
        ) : (
          <View style={styles.grid}>
            {list.map((a, i) => <Tile key={a.id} a={a} i={i} />)}
          </View>
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
        <AnimalPhoto species={a.species} photo={adoptionPhoto(a)} style={{ height: 130, borderRadius: radius.sm }} iconSize={44} />
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

function CreateSheet({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (l: Omit<AdoptionListing, 'id' | 'status' | 'mine' | 'poster'>) => void }) {
  const [species, setSpecies] = useState<Species>('cat');
  const [gender, setGender] = useState<AdoptionListing['gender']>('Unknown');
  const [vacc, setVacc] = useState<AdoptionListing['vaccination']>('Unknown');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const ok = age.trim() && description.trim();
  return (
    <SheetDialog visible={visible} onClose={onClose}>
      <Text style={type.title}>List an animal</Text>
      <View style={styles.row}>{(['dog', 'cat', 'other'] as Species[]).map((s) => <Pill key={s} label={s === 'dog' ? 'Dog' : s === 'cat' ? 'Cat' : 'Other'} selected={species === s} onPress={() => setSpecies(s)} />)}</View>
      <TextInput style={styles.input} placeholder="Name (if known)" placeholderTextColor={color.inkSubtle} value={name} onChangeText={setName} accessibilityLabel="Name" />
      <TextInput style={styles.input} placeholder="Approximate age, e.g. ~4 months" placeholderTextColor={color.inkSubtle} value={age} onChangeText={setAge} accessibilityLabel="Approximate age" />
      <View style={styles.row}>{(['Male', 'Female', 'Unknown'] as const).map((g) => <Pill key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />)}</View>
      <TextInput style={[styles.input, { minHeight: 70 }]} multiline placeholder="Description" placeholderTextColor={color.inkSubtle} value={description} onChangeText={setDescription} accessibilityLabel="Description" />
      <View style={styles.row}>{(['Vaccinated', 'Partially vaccinated', 'Not vaccinated', 'Unknown'] as const).map((v) => <Pill key={v} label={v} selected={vacc === v} onPress={() => setVacc(v)} />)}</View>
      <Button label="Publish" disabled={!ok} onPress={() => onSubmit({ name: name || undefined, species, age, gender, area: 'Andheri East', description, temperament: '', vaccination: vacc, requirements: '' })} />
    </SheetDialog>
  );
}

const styles = StyleSheet.create({
  tabHead: { paddingHorizontal: space[5], paddingTop: space[2], gap: 4 },
  listBtn: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: pastel.lavender.soft, boxShadow: '0 6px 16px rgba(91, 69, 196, 0.14)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  tileWrap: { width: '47.8%' },
  tile: { backgroundColor: color.surface, borderRadius: radius.md, overflow: 'hidden', ...shadow.card },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  input: { borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingHorizontal: space[3], paddingVertical: 10, fontFamily: font.regular, fontSize: 15, color: color.ink },
});
