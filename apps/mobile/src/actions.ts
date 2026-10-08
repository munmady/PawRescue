import { Share } from 'react-native';
import { PROBLEMS, statusLabel, type ProblemCode, type Species } from '@animal/shared';
import type { Case } from './data';

/** A descriptive case title from the animal and its main problem, e.g. "Trapped dog", "Cat unable to walk". */
/** An adoption listing's display name; never just "Dog" or "Cat" when the poster gave no name. */
export function listingName(a: { name?: string; species: Species }) {
  return a.name ?? `Unnamed ${a.species === 'dog' ? 'dog' : a.species === 'cat' ? 'cat' : 'animal'}`;
}

/** How to refer to a listing in a sentence: its name, or "this dog" / "this cat". */
export function listingRef(a: { name?: string; species: Species }) {
  return a.name ?? `this ${a.species === 'dog' ? 'dog' : a.species === 'cat' ? 'cat' : 'animal'}`;
}

export function caseTitle(species: Species | null, problems: ProblemCode[]) {
  const a = species === 'dog' ? 'dog' : species === 'cat' ? 'cat' : 'animal';
  const A = a[0].toUpperCase() + a.slice(1);
  switch (problems[0]) {
    case 'hit_by_vehicle': return `${A} hit by a vehicle`;
    case 'bleeding': return `Injured ${a}`;
    case 'cant_walk': return `${A} unable to walk`;
    case 'not_responding': return `Unresponsive ${a}`;
    case 'very_sick': return `Sick ${a}`;
    case 'trapped': return `Trapped ${a}`;
    default: return `${A} in distress`;
  }
}

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
