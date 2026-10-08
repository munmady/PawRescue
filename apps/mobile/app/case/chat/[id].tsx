import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BadgeCheck, Flag, RotateCw, SendHorizontal } from 'lucide-react-native';
import { Button, Pill, PressableScale, ScreenHeader, SheetDialog } from '@/src/ui';
import { timeAgo, useCase, useStore } from '@/src/store';
import type { ChatMessage } from '@/src/data';
import { TypingIndicator } from '@/src/TypingIndicator';
import { color, font, radius, shadow, space, type } from '@/src/theme';

const REASONS = ['Abusive or unprofessional language', 'False or misleading information'] as const;

/** Case chat (D101): anyone can read; posting needs an account; chat never changes status. */
export default function CaseChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useCase(id);
  const insets = useSafeAreaInsets();
  const { chats, account, requireAccount, postMessage, retryMessage, flagMessage, typing } = useStore();
  const [text, setText] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [flagging, setFlagging] = useState<ChatMessage | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const list = useRef<FlatList<ChatMessage>>(null);

  const messages = chats.filter((m) => m.caseId === id && !m.official);
  const official = chats.filter((m) => m.caseId === id && m.official);
  useEffect(() => { setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50); }, [messages.length, typing[id!]]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    requireAccount('Sign in to post in this chat', () => {
      const ok = postMessage(id!, t);
      setBlocked(!ok);
      if (ok) setText('');
    });
  };

  const flag = (m: ChatMessage) => requireAccount('Sign in to flag a message', () => { setFlagging(m); setReason(null); setDetails(''); });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: color.page, paddingTop: insets.top }}>
      <ScreenHeader title={c ? `${c.title} · ${c.area}` : 'Case chat'} />
      {official.map((m) => (
        <Animated.View key={m.id} entering={FadeInDown} style={styles.official}>
          <Text style={styles.officialLabel}>OFFICIAL UPDATE · {m.orgName?.toUpperCase()}</Text>
          <Text style={[type.label, { color: color.ink }]}>{m.text}</Text>
          <Text style={type.caption}>{timeAgo(m.at)}</Text>
        </Animated.View>
      ))}
      <FlatList
        ref={list}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: space[5], gap: space[3], flexGrow: 1 }}
        ListFooterComponent={<TypingIndicator name={typing[id!]} />}
        ListEmptyComponent={<Text style={[type.label, { textAlign: 'center', marginTop: space[8] }]}>Share anything that helps the rescue team find this animal.</Text>}
        renderItem={({ item: m }) => (
          <Animated.View entering={FadeInUp.duration(250)} style={[styles.msgWrap, m.mine && { alignItems: 'flex-end' }]}>
            {!m.mine ? (
              <View style={styles.who}>
                <Text style={styles.whoName}>{m.firstName}</Text>
                {m.blueTick ? <BadgeCheck size={13} color={color.action} /> : null}
                {m.role ? <Text style={type.caption}>· {m.role}</Text> : null}
              </View>
            ) : null}
            <View style={styles.bubbleWrap}>
              <PressableScale onPress={!m.mine ? () => flag(m) : undefined} accessibilityLabel={m.mine ? 'Your message' : `Message from ${m.firstName}. Tap for options`} scaleTo={0.98}
                style={[styles.bubble, m.mine ? styles.mine : styles.theirs, m.failed && styles.failed]}>
                <Text style={[styles.msgText, m.mine && styles.msgTextMine]}>{m.text}</Text>
              </PressableScale>
            </View>
            {m.failed ? (
              <Animated.View entering={FadeIn} style={styles.failRow}>
                <Text style={styles.failText}>Message not sent. Check your connection and try again.</Text>
                <PressableScale onPress={() => retryMessage(m.id)} accessibilityLabel="Retry" style={styles.retry}>
                  <RotateCw size={13} color={color.action} />
                  <Text style={styles.retryText}>Retry</Text>
                </PressableScale>
              </Animated.View>
            ) : <Text style={[type.caption, { color: color.inkMuted }]}>{timeAgo(m.at)}</Text>}
          </Animated.View>
        )}
      />
      {blocked ? (
        <Animated.Text entering={FadeInDown} style={styles.blocked}>
          Please keep the conversation respectful. Abusive or inappropriate language isn&apos;t allowed in case chats.
        </Animated.Text>
      ) : null}
      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
        <TextInput
          value={text}
          onChangeText={(t) => { setText(t); setBlocked(false); }}
          placeholder={account ? 'Write a message' : 'Sign in to post a message'}
          placeholderTextColor={color.inkSubtle}
          style={styles.input}
          accessibilityLabel="Message"
          multiline
        />
        <PressableScale onPress={send} accessibilityLabel="Send" style={[styles.send, !text.trim() && { opacity: 0.5 }]} scaleTo={0.9}>
          <SendHorizontal size={18} color="#fff" />
        </PressableScale>
      </View>

      <SheetDialog visible={!!flagging} onClose={() => setFlagging(null)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Flag size={18} color={color.ink} />
          <Text style={type.title}>Flag message</Text>
        </View>
        <Text style={type.label}>&ldquo;{flagging?.text}&rdquo;</Text>
        <View style={{ gap: space[2] }}>
          {REASONS.map((r) => <Pill key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />)}
        </View>
        <TextInput value={details} onChangeText={setDetails} placeholder="Add details (optional)" placeholderTextColor={color.inkSubtle} style={styles.details} accessibilityLabel="Details" />
        <Button label="Submit" disabled={!reason} onPress={() => { flagMessage(flagging!.id); setFlagging(null); }} />
      </SheetDialog>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  official: { marginHorizontal: space[5], backgroundColor: color.surfaceTint, borderRadius: radius.md, padding: space[4], gap: 4 },
  officialLabel: { fontFamily: font.extrabold, fontSize: 11, letterSpacing: 0.6, color: color.infoInk },
  msgWrap: { gap: 4, alignItems: 'flex-start' },
  who: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  whoName: { fontFamily: font.bold, fontSize: 12.5, color: color.ink },
  // The width cap lives on a plain View so bubbles size to their text instead of collapsing.
  bubbleWrap: { maxWidth: '82%' },
  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18 },
  mine: { backgroundColor: color.action, borderBottomRightRadius: 6 },
  msgText: { fontFamily: font.regular, fontSize: 15, lineHeight: 21, color: color.ink },
  msgTextMine: { color: '#ffffff' },
  theirs: { backgroundColor: color.surface, borderBottomLeftRadius: 6, ...shadow.card },
  failed: { opacity: 0.7, borderWidth: 1, borderColor: color.urgent },
  failRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' },
  failText: { fontFamily: font.semibold, fontSize: 12, color: color.urgent },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, height: 30, borderRadius: radius.pill, backgroundColor: color.surfaceTint },
  retryText: { fontFamily: font.bold, fontSize: 12, color: color.action },
  blocked: { marginHorizontal: space[5], marginBottom: space[2], fontFamily: font.semibold, fontSize: 13, color: color.urgent },
  composer: { flexDirection: 'row', alignItems: 'center', gap: space[2], paddingHorizontal: space[4], paddingTop: space[3], backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, backgroundColor: color.fill, paddingHorizontal: space[4], paddingVertical: 11, fontFamily: font.regular, fontSize: 15, color: color.ink },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.action, alignItems: 'center', justifyContent: 'center' },
  details: { borderWidth: 1, borderColor: color.line, borderRadius: radius.md, padding: space[3], fontFamily: font.regular, fontSize: 15, color: color.ink },
});
