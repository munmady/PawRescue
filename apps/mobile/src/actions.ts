import { Share } from 'react-native';
import { PROBLEMS, statusLabel } from '@animal/shared';
import type { Case } from './data';

export function problemText(c: Case) {
  return c.problems.map((p) => PROBLEMS.find((x) => x.code === p)?.label ?? p).join(', ');
}

/**
 * Device share sheet (D69, D93, D108): case information and a live link only.
 * Never reporter identity, contact details or case chat.
 */
export async function shareCase(c: Case, toast: (t: string) => void) {
  const message = `${c.title} · ${problemText(c)} · ${c.area} · ${statusLabel(c)}. See the latest status: rescue.example/case/${c.id} (demo link)`;
  try {
    await Share.share({ message, title: c.title });
  } catch {
    toast('Sharing isn’t available on this device');
  }
}

export const DEMO_CALL = 'Demo — calling is disabled in this prototype.';
