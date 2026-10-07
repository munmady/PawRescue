import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ChevronDown, Info, Phone } from 'lucide-react-native';
import { PressableScale } from './ui';
import { FAQS, type Faq } from './helplines';
import { color, font, radius, shadow, space, type } from './theme';

/** Expandable "Who do I call?" questions (D141). One open at a time. Numbers are masked; no call action. */
export function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <View style={{ gap: space[3] }}>
      {FAQS.map((f, i) => (
        <Animated.View key={f.q} entering={FadeInDown.delay(i * 40).duration(280)}>
          <FaqItem f={f} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        </Animated.View>
      ))}
      <View style={styles.disclaimer}>
        <Info size={15} color={color.inkSecondary} />
        <Text style={[type.caption, { flex: 1 }]}>
          Listed for information only. This app isn&apos;t affiliated with these organisations. Numbers are partly hidden in this demo.
        </Text>
      </View>
    </View>
  );
}

function FaqItem({ f, open, onToggle }: { f: Faq; open: boolean; onToggle: () => void }) {
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: withTiming(open ? '180deg' : '0deg', { duration: 200 }) }] }));
  return (
    <View style={[styles.faq, open && styles.faqOpen]}>
      <PressableScale onPress={onToggle} accessibilityLabel={f.q} accessibilityState={{ expanded: open }} style={styles.faqQ} scaleTo={0.99}>
        <Text style={[type.section, { flex: 1, fontSize: 15 }]}>{f.q}</Text>
        <Animated.View style={chevron}><ChevronDown size={20} color={color.inkSecondary} /></Animated.View>
      </PressableScale>
      {open ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.faqA}>
          <Text style={[type.body, { color: color.ink }]}>{f.a}</Text>
          {f.contacts?.length ? (
            <View style={styles.contacts}>
              {f.contacts.map((c, i) => (
                <View key={`${c.name}-${c.note ?? ''}`} style={[styles.contact, i > 0 && styles.contactLine]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    {c.note ? <Text style={type.caption}>{c.note}</Text> : null}
                  </View>
                  <View style={styles.number}>
                    <Phone size={13} color={color.inkSecondary} />
                    <Text style={styles.numberText}>{c.number}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  faq: { backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, overflow: 'hidden' },
  faqOpen: { borderColor: color.primary, ...shadow.card },
  faqQ: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 56, paddingHorizontal: space[4], paddingVertical: space[3] },
  faqA: { paddingHorizontal: space[4], paddingBottom: space[4], gap: space[3] },
  contacts: { backgroundColor: color.fill, borderRadius: radius.md, paddingHorizontal: space[3] },
  contact: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  contactLine: { borderTopWidth: 1, borderTopColor: color.line },
  contactName: { fontFamily: font.semibold, fontSize: 14, color: color.ink },
  number: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  numberText: { fontFamily: font.bold, fontSize: 13.5, color: color.inkSecondary, letterSpacing: 0.3 },
  disclaimer: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start', paddingHorizontal: space[1], marginTop: space[1] },
});
