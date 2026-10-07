import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { PressableScale } from './ui';
import { useStore } from './store';
import { color, font, pastel, shadow } from './theme';

/** Top-right entry to Profile on every tab (D142): the account initial, or a person icon when signed out. */
export function ProfileButton() {
  const { account } = useStore();
  const initial = account?.name.trim()[0]?.toUpperCase();
  return (
    <PressableScale onPress={() => router.push('/profile')} accessibilityLabel="Profile" style={styles.btn} scaleTo={0.9}>
      <View style={styles.inner}>
        {initial ? <Text style={styles.initial}>{initial}</Text> : <User size={20} color={color.action} strokeWidth={2.2} />}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: { width: 44, height: 44, borderRadius: 22 },
  inner: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: pastel.lavender.bg, borderWidth: 2, borderColor: '#ffffff', ...shadow.card },
  initial: { fontFamily: font.extrabold, fontSize: 17, color: pastel.lavender.ink },
});
