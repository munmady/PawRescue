import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { Lock, RotateCw, SendHorizontal } from 'lucide-react-native';
import { AnimalPhoto, Button, PressableScale, ScreenHeader } from '@/src/ui';
import { timeAgo, useStore } from '@/src/store';
import { adoptionPhoto } from '@/src/photos';
import type { AdoptionMessage } from '@/src/data';
import { TypingIndicator } from '@/src/TypingIndicator';
import { color, font, radius, shadow, space, type } from '@/src/theme';

/**
 * Adoption chat (ADOPT-05, AD5): one-to-one between the signed-in user and the
 * poster. First names only, no phone numbers, no flag action (D113). Interested
 * users come back by reopening the listing (D125).
 */
export default function AdoptionChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { account, adoptions, adoptionChats, requireAccount, sendAdoptionMessage, retryAdoptionMessage, typing } = useStore();
  const [text, setText] = useState('');
  const [blocked, setBlocked] = useState(false);
  const list = useRef<FlatList<AdoptionMessage>>(null);

  const a = adoptions.find((x) => x.id === id);
  const messages = adoptionChats.filter((m) => m.listingId === id);
  useEffect(() => { setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50); }, [messages.length, typing[id!]]);

  if (!a) return null;
  const name = a.name ?? (a.species === 'dog' ? 'Dog' : a.species === 'cat' ? 'Cat' : 'Animal');
  const starters = [`Is ${a.name ?? 'this animal'} still available?`, 'Can I come and visit?', 'What does the adoption involve?'];

  const send = (t = text.trim()) => {
    if (!t) return;
    requireAccount('Sign in to chat with the poster', () => {
      const ok = sendAdoptionMessage(a.id, t);
      setBlocked(!ok);
      if (ok) setText('');
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={`Chat with ${a.poster}`} />

      <PressableScale onPress={() => router.back()} accessibilityLabel={`Back to ${name}'s listing`} style={styles.listing} scaleTo={0.98}>
        <AnimalPhoto species={a.species} photo={adoptionPhoto(a)} style={{ width: 44, height: 44, borderRadius: 22 }} iconSize={20} />
        <View style={{ flex: 1 }}>
          <Text style={type.section} numberOfLines={1}>{name} · {a.age}</Text>
          <Text style={type.caption} numberOfLines={1}>{a.area} · {a.status}</Text>
        </View>
      </PressableScale>

      {!account ? (
        <View style={styles.signedOut}>
          <Text style={[type.body, { textAlign: 'center' }]}>Sign in to chat with {a.poster} about {name}.</Text>
          <Button label="Set up your account" onPress={() => requireAccount('Sign in to chat with the poster', () => {})} />
        </View>
      ) : a.mine ? (
        <View style={styles.signedOut}>
          <Text style={[type.body, { textAlign: 'center' }]}>This is your listing. Conversations with interested people appear in My adoption listings.</Text>
        </View>
      ) : (
        <>
          <Animated.FlatList
        itemLayoutAnimation={LinearTransition.duration(220)}
            ref={list}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: space[5], gap: space[3], flexGrow: 1 }}
            ListHeaderComponent={
              <View style={styles.privacy}>
                <Lock size={13} color={color.inkMuted} />
                <Text style={[type.caption, { flex: 1 }]}>Only you and {a.poster} see this chat. Phone numbers aren&apos;t shared. Share contact details only if you want to.</Text>
              </View>
            }
            ListFooterComponent={<TypingIndicator name={typing[id!]} />}
            ListEmptyComponent={
              <Animated.View entering={FadeInDown.delay(120)} style={styles.empty}>
                <Text style={[type.label, { textAlign: 'center' }]}>Say hello and ask about {name}.</Text>
                <View style={styles.starters}>
                  {starters.map((s) => (
                    <PressableScale key={s} onPress={() => send(s)} accessibilityLabel={`Send: ${s}`} style={styles.starter} scaleTo={0.96}>
                      <Text style={styles.starterText}>{s}</Text>
                    </PressableScale>
                  ))}
                </View>
              </Animated.View>
            }
            renderItem={({ item: m }) => (
              <Animated.View entering={FadeInUp.duration(250)} style={[styles.msgWrap, m.mine && { alignItems: 'flex-end' }]}>
                {!m.mine ? <Text style={styles.whoName}>{m.from}</Text> : null}
                <View style={[styles.bubble, m.mine ? styles.mine : styles.theirs, m.failed && styles.failed]}>
                  <Text style={[styles.msgText, m.mine && { color: '#ffffff' }]}>{m.text}</Text>
                </View>
                {m.failed ? (
                  <Animated.View entering={FadeIn} style={styles.failRow}>
                    <Text style={styles.failText}>Message not sent. Check your connection and try again.</Text>
                    <PressableScale onPress={() => retryAdoptionMessage(m.id)} accessibilityLabel="Retry" style={styles.retry}>
                      <RotateCw size={13} color={color.action} />
                      <Text style={styles.retryText}>Retry</Text>
                    </PressableScale>
                  </Animated.View>
                ) : <Text style={type.caption}>{timeAgo(m.at)}</Text>}
              </Animated.View>
            )}
          />
          {blocked ? (
            <Animated.Text entering={FadeInDown} style={styles.blocked}>
              Please keep the conversation respectful. Abusive or inappropriate language isn&apos;t allowed.
            </Animated.Text>
          ) : null}
          <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
            <TextInput
              value={text}
              onChangeText={(t) => { setText(t); setBlocked(false); }}
              placeholder={`Message ${a.poster}`}
              placeholderTextColor={color.inkSubtle}
              style={styles.input}
              accessibilityLabel="Message"
              multiline
            />
            <PressableScale onPress={() => send()} accessibilityLabel="Send" style={[styles.send, !text.trim() && { opacity: 0.5 }]} scaleTo={0.9}>
              <SendHorizontal size={18} color="#fff" />
            </PressableScale>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  listing: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginHorizontal: space[5], marginBottom: space[2], padding: space[3], backgroundColor: color.surface, borderRadius: radius.md, ...shadow.card },
  signedOut: { flex: 1, justifyContent: 'center', padding: space[6], gap: space[4] },
  privacy: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingBottom: space[2] },
  empty: { marginTop: space[6], gap: space[3], alignItems: 'center' },
  starters: { gap: space[2], alignItems: 'center' },
  starter: { minHeight: 40, justifyContent: 'center', paddingHorizontal: space[4], borderRadius: radius.pill, backgroundColor: color.surfaceTint },
  starterText: { fontFamily: font.semibold, fontSize: 14, color: color.action },
  msgWrap: { gap: 4, alignItems: 'flex-start' },
  whoName: { fontFamily: font.bold, fontSize: 12.5, color: color.ink },
  bubble: { maxWidth: '82%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18 },
  mine: { backgroundColor: color.action, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: color.surface, borderBottomLeftRadius: 6, ...shadow.card },
  failed: { opacity: 0.7, borderWidth: 1, borderColor: color.urgent },
  msgText: { fontFamily: font.regular, fontSize: 15, lineHeight: 21, color: color.ink },
  failRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' },
  failText: { fontFamily: font.semibold, fontSize: 12, color: color.urgent },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, height: 30, borderRadius: radius.pill, backgroundColor: color.surfaceTint },
  retryText: { fontFamily: font.bold, fontSize: 12, color: color.action },
  blocked: { marginHorizontal: space[5], marginBottom: space[2], fontFamily: font.semibold, fontSize: 13, color: color.urgent },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], paddingHorizontal: space[4], paddingTop: space[3], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, backgroundColor: color.fill, paddingHorizontal: space[4], paddingVertical: 11, fontFamily: font.regular, fontSize: 15, color: color.ink },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.action, alignItems: 'center', justifyContent: 'center' },
});
