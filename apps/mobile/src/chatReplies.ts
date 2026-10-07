import { isProfessionalActive } from '@animal/shared';
import type { AdoptionListing, Case, Role } from './data';

/**
 * SIMULATED DEMO: canned but context-aware replies so the chats feel alive.
 * Picks a reply by keywords in the user's message (English + Hinglish) and the
 * case or listing details. Replies never share phone numbers or locations of
 * people, and never pressure anyone into physical intervention.
 */

export interface CaseReply { firstName: string; role: Role | null; orgName?: string; blueTick?: boolean; text: string }

const has = (t: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`, 'i').test(t));
const pick = <T,>(xs: T[], n: number) => xs[n % xs.length];

const NEIGHBOURS = [
  { firstName: 'Kabir', role: null },
  { firstName: 'Priya', role: null },
  { firstName: 'Rohan', role: null },
] as const;

export function caseReplies(c: Case, text: string, turn: number): CaseReply[] {
  const place = c.landmark ?? c.area;
  const animal = c.species === 'cat' ? 'cat' : c.species === 'dog' ? 'dog' : 'animal';
  const pro = isProfessionalActive(c) && c.organisationName;
  const neighbour = pick([...NEIGHBOURS], turn);
  const staff: CaseReply | null = pro ? { firstName: 'Sameer', role: 'Organisation', orgName: c.organisationName!, blueTick: true, text: '' } : null;
  const from = (t: string, who: CaseReply | Omit<CaseReply, 'text'> = neighbour): CaseReply => ({ ...who, text: t });

  let first: CaseReply;
  if (has(text, ['where', 'kaha', 'kahan', 'location', 'exact', 'side', 'address'])) {
    first = from(`It's right at ${place}. Look near the footpath, the ${animal} is tucked in the shade.`);
  } else if (has(text, ['water', 'pani', 'paani', 'food', 'khana', 'biscuit', 'milk', 'doodh', 'feed'])) {
    first = staff
      ? from('A little water in a bowl is fine, but please no food for now. If the animal needs treatment it is safer on an empty stomach.', staff)
      : from('I kept a bowl of water nearby. Better not to give food until a vet sees it.');
  } else if (has(text, ['coming', 'on my way', 'omw', 'reaching', 'aa raha', 'aa rahi', 'nikal', 'leaving'])) {
    first = from(`Thank you! When you reach, keep a calm distance. The ${animal} gets nervous if people crowd around.`);
  } else if (has(text, ['blood', 'bleed', 'injur', 'hurt', 'wound', 'limp', 'leg', 'chot', 'pain'])) {
    first = from(`From what I could see it's the back leg. The ${animal} isn't putting weight on it but is alert.`);
  } else if (has(text, ['photo', 'pic', 'video', 'image'])) {
    first = from(`The photos in the report are from a few minutes ago. The ${animal} hasn't moved much since.`);
  } else if (has(text, ['help', 'what can', 'kya kar', 'kaise', 'how can', 'need'])) {
    first = from("If you're close by, you could keep an eye from a distance and share updates here. Please don't try to lift the animal.");
  } else if (has(text, ['thank', 'thanks', 'thx', 'shukriya', 'dhanyavad'])) {
    first = from('Thanks for checking in 🙏 Every update helps.');
  } else if (has(text, ['hi', 'hello', 'hey', 'namaste', 'anyone', 'koi'])) {
    first = from('Hi! Yes, a few of us nearby are following this one.');
  } else if (has(text, ['still', 'abhi', 'update', 'status', 'moved', 'there'])) {
    first = from(`Still at ${place} as of a couple of minutes ago. Breathing fine, just scared.`);
  } else {
    first = pro
      ? from(`Thanks, noted. Our team is on the way. Please keep a safe distance until we arrive.`, staff!)
      : c.status === 'NEW'
        ? from('No rescue team has accepted yet. Sharing the case link in my building group too.')
        : from('Noted, thanks for the update.');
  }

  const replies = [first];
  // On the first message in a conversation, a second person chimes in.
  if (turn === 0) {
    const second = pick([...NEIGHBOURS], turn + 1);
    replies.push(staff && first.firstName !== staff.firstName
      ? from('We have this case. Please share anything you notice here, it really helps our team.', staff)
      : from(c.status === 'NEW' ? 'Same, I can check on the animal in about 15 min if no one reaches before that.' : 'Good to see help is coming. I live close by, will keep watching.', second));
  }
  return replies;
}

export function adoptionReply(l: AdoptionListing, text: string, turn: number): string {
  const name = l.name ?? (l.species === 'cat' ? 'the kitty' : l.species === 'dog' ? 'the pup' : 'this little one');
  if (has(text, ['available', 'still'])) return `Yes, ${name} is still available! Would you like to set up a visit?`;
  if (has(text, ['vaccin', 'shot', 'deworm', 'tika'])) return `${name} is ${l.vaccination.toLowerCase()}. I can share the vet record when you visit.`;
  if (has(text, ['age', 'old', 'months', 'umar'])) return `${name} is ${l.age}, give or take. The vet guessed the age at the first check-up.`;
  if (has(text, ['visit', 'meet', 'see', 'come', 'mil'])) return `Sure! Weekend mornings work best for me. We can meet in ${l.area}, I'll share the exact place here in the chat closer to the day.`;
  if (has(text, ['kid', 'child', 'baby', 'other cat', 'other dog', 'pets', 'friendly', 'temperament', 'nature'])) return `${l.temperament}. Happy to tell you more about how ${name} behaves at home.`;
  if (has(text, ['fee', 'cost', 'price', 'pay', 'charge', 'paise'])) return 'There’s no adoption fee. I only ask that you keep up with vet visits.';
  if (has(text, ['require', 'condition', 'rule', 'need', 'process', 'how do', 'kaise', 'involve'])) return `Mainly this: ${l.requirements.toLowerCase()}. Nothing complicated, I just want ${name} to be safe.`;
  if (has(text, ['food', 'eat', 'khana', 'diet'])) return `${name} eats twice a day and loves a little wet food in the evening.`;
  if (has(text, ['thank', 'thanks', 'shukriya'])) return 'Thank you for considering adoption! 🙏';
  if (turn === 0) return `Hi! Yes, ${name} is still looking for a home. Happy to answer any questions or set up a visit.`;
  return pick([
    `That's a good question. ${name} is settling in well and is very curious about everything.`,
    `Sure, let me know whatever else you'd like to know about ${name}.`,
    'Got it! Take your time, there’s no rush.',
  ], turn);
}

/** Feels human: a short pause before typing, then time proportional to the reply. */
export const typingDelay = (text: string) => Math.min(3200, 900 + text.length * 22);
