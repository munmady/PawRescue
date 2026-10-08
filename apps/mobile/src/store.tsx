import type { PhotoKey } from './photos';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import type { ProblemCode, Species } from '@animal/shared';
import {
  ADOPTIONS, FOOD_REQUESTS, SEED_CASES, SEED_CHATS, SEED_USER_ID,
  type AdoptionListing, type AdoptionMessage, type Case, type ChatMessage, type Donation, type FoodRequest,
} from './data';
import { adoptionReply, caseReplies, typingDelay } from './chatReplies';
import { caseTitle } from './actions';

export type ToastTone = 'success' | 'info' | 'demo';
export interface Toast { id: number; text: string; sub?: string; tone: ToastTone }

export interface Account {
  name: string;
  email: string;
  mobile: string;
}

export interface NewReport {
  photos?: PhotoKey[];
  species: Species;
  problems: ProblemCode[];
  description: string;
  area: string;
  landmark?: string;
  evidence: number;
  voiceNoteSeconds?: number;
  noMedia?: boolean;
}

interface Store {
  account: Account | null;
  cases: Case[];
  chats: ChatMessage[];
  reportedIds: string[];
  transportedIds: string[];
  adoptions: AdoptionListing[];
  foodRequests: FoodRequest[];
  donations: Donation[];
  toast: Toast | null;
  /** Popup message. `tone` sets the icon (done / info / demo); a demo note is detected from the text. */
  showToast: (text: string, opts?: { sub?: string; tone?: ToastTone }) => void;
  /** Runs `action` now if signed in, otherwise opens account setup and runs it after (D111, D137). */
  requireAccount: (reason: string, action: () => void) => void;
  completeAccount: (a: Account) => void;
  signOut: () => void;
  submitReport: (r: NewReport) => string;
  cancelReport: (id: string) => void;
  reportPassedAway: (id: string) => void;
  startTransport: (id: string, hospitalName: string) => void;
  markArrived: (id: string) => void;
  /** Returns false when the pre-send filter blocks the message (text stays in the composer). */
  postMessage: (caseId: string, text: string) => boolean;
  flagMessage: (id: string) => void;
  retryMessage: (id: string) => void;
  donate: (d: Omit<Donation, 'id' | 'at' | 'payment' | 'delivery'>) => void;
  addListing: (l: Omit<AdoptionListing, 'id' | 'status' | 'mine' | 'poster'>) => void;
  /** Marks a listing Adopted; `adopter` is the person the poster chose from their chats (D146). */
  markAdopted: (id: string, adopter?: string) => void;
  removeListing: (id: string) => void;
  adoptionChats: AdoptionMessage[];
  /** Returns false when the pre-send filter blocks the message (text stays in the composer). */
  sendAdoptionMessage: (listingId: string, text: string) => boolean;
  retryAdoptionMessage: (id: string) => void;
  /** Who is typing in a case chat or adoption chat (keyed by case id / listing id). SIMULATED DEMO. */
  typing: Record<string, string | undefined>;
}

const Ctx = createContext<Store | null>(null);

const ABUSE = [/\bidiot\b/i, /\bstupid\b/i, /\bchutiya\b/i, /\bbewakoof\b/i];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [cases, setCases] = useState<Case[]>(SEED_CASES);
  const [chats, setChats] = useState<ChatMessage[]>(SEED_CHATS);
  const [reportedIds, setReported] = useState<string[]>(['AR-10230']);
  const [transportedIds, setTransported] = useState<string[]>([]);
  const [adoptions, setAdoptions] = useState<AdoptionListing[]>(ADOPTIONS);
  const [foodRequests] = useState<FoodRequest[]>(FOOD_REQUESTS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [adoptionChats, setAdoptionChats] = useState<AdoptionMessage[]>([]);
  const [typing, setTyping] = useState<Record<string, string | undefined>>({});
  const turns = useRef<Record<string, number>>({});
  const [toast, setToast] = useState<Store['toast']>(null);
  const pending = useRef<(() => void) | null>(null);
  // Starts high so runtime ids (a…, m…, d…) never collide with seed ids like a1 or m1.
  const seq = useRef(1000);

  const showToast = useCallback((text: string, opts?: { sub?: string; tone?: ToastTone }) =>
    setToast({ id: seq.current++, text, sub: opts?.sub, tone: opts?.tone ?? (/demo/i.test(text) ? 'demo' : 'success') }), []);

  const patchCase = useCallback((id: string, patch: Partial<Case>, event?: string) => {
    setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch, events: event ? [...c.events, { at: Date.now(), label: event }] : c.events } : c)));
  }, []);

  const requireAccount = useCallback<Store['requireAccount']>((reason, action) => {
    if (account) return action();
    pending.current = action;
    router.push({ pathname: '/auth', params: { reason } });
  }, [account]);

  const completeAccount = useCallback((a: Account) => {
    setAccount(a);
    const next = pending.current;
    pending.current = null;
    router.back();
    if (next) setTimeout(next, 350);
  }, []);

  const submitReport = useCallback((r: NewReport) => {
    const id = `AR-${10250 + (seq.current++ - 1000)}`;
    const c: Case = {
      id, species: r.species,
      title: caseTitle(r.species, r.problems),
      problems: r.problems, description: r.description || 'No details added.', area: r.area, landmark: r.landmark,
      distanceM: 120, x: 52, y: 46, status: 'NEW', reportedAt: Date.now(), reporterId: SEED_USER_ID,
      evidence: r.evidence, photos: r.photos, voiceNoteSeconds: r.voiceNoteSeconds, noMedia: r.noMedia,
      events: [{ at: Date.now(), label: 'Reported' }],
    };
    setCases((cs) => [c, ...cs]);
    setReported((ids) => [id, ...ids]);
    // SIMULATED DEMO: the demo organisation responds.
    setTimeout(() => {
      setCases((cs) => cs.map((x) => (x.id === id && x.status === 'NEW'
        ? { ...x, status: 'ACCEPTED', organisationName: 'Lumen Animal Rescue & Shelter', events: [...x.events, { at: Date.now(), label: 'Accepted by Lumen Animal Rescue & Shelter' }] }
        : x)));
      setChats((m) => [...m, { id: `m${seq.current++}`, caseId: id, firstName: 'Lumen Animal Rescue & Shelter', role: 'Organisation', orgName: 'Lumen Animal Rescue & Shelter', official: true,
        text: 'We have your report and are sending a team. Please don’t approach the animal unless it is safe.', at: Date.now() }]);
    }, 9000);
    setTimeout(() => {
      setCases((cs) => cs.map((x) => (x.id === id && x.status === 'ACCEPTED'
        ? { ...x, status: 'ON_THE_WAY', etaMinutes: 9, events: [...x.events, { at: Date.now(), label: 'Help reaching in ~9 min' }] }
        : x)));
    }, 22000);
    return id;
  }, []);

  const value = useMemo<Store>(() => ({
    account, cases, chats, reportedIds, transportedIds, adoptions, foodRequests, donations, toast, adoptionChats, typing,
    showToast, requireAccount, completeAccount,
    signOut: () => { setAccount(null); showToast('Signed out', { tone: 'info' }); },
    submitReport,
    cancelReport: (id) => { patchCase(id, { status: 'CANCELLED' }, 'Cancelled by reporter'); showToast('Report cancelled', { tone: 'info', sub: 'It no longer shows on Home' }); },
    reportPassedAway: (id) => { patchCase(id, { deathReportedPending: true }, 'Passed away reported, awaiting confirmation'); showToast('Thank you. A hospital or rescue organisation will confirm.', { tone: 'info' }); },
    startTransport: (id, hospitalName) => {
      setCases((cs) => cs.map((c) => (c.id === id && c.status === 'NEW'
        ? { ...c, status: 'RESPONDER_TO_HOSPITAL', hospitalName, events: [...c.events, { at: Date.now(), label: 'Responder taking animal to hospital' }] }
        : c)));
      setTransported((ids) => (ids.includes(id) ? ids : [id, ...ids]));
      // SIMULATED DEMO: the selected hospital confirms arrival only after the responder arrives (D110).
    },
    markArrived: (id) => {
      showToast('Arrival recorded. The hospital will confirm.', { tone: 'success' });
      setTimeout(() => patchCase(id, { status: 'AT_HOSPITAL' }, 'Hospital reached'), 6000);
    },
    postMessage: (caseId, text) => {
      if (ABUSE.some((r) => r.test(text))) {
        return false;
      }
      const failed = /\bfail\b/i.test(text);
      setChats((m) => [...m, { id: `m${seq.current++}`, caseId, firstName: account?.name.split(' ')[0] ?? 'You', role: reportedIds.includes(caseId) ? 'Reporter' : transportedIds.includes(caseId) ? 'Community Responder' : null, text, at: Date.now(), mine: true, failed }]);
      // SIMULATED DEMO: people following the case reply, one after another, with a typing indicator.
      const kase = cases.find((x) => x.id === caseId);
      if (kase && !failed) {
        const turn = turns.current[caseId] ?? 0;
        turns.current[caseId] = turn + 1;
        let t = 700;
        for (const r of caseReplies(kase, text, turn)) {
          const startAt = t;
          const endAt = t + typingDelay(r.text);
          setTimeout(() => setTyping((x) => ({ ...x, [caseId]: r.firstName })), startAt);
          setTimeout(() => {
            setTyping((x) => ({ ...x, [caseId]: undefined }));
            setChats((m) => [...m, { id: `m${seq.current++}`, caseId, at: Date.now(), ...r }]);
          }, endAt);
          t = endAt + 900;
        }
      }
      return true;
    },
    flagMessage: () => showToast('Thanks for flagging this. Our team will review it.', { tone: 'info' }),
    retryMessage: (mid) => setChats((m) => m.map((x) => (x.id === mid ? { ...x, failed: false } : x))),
    donate: (d) => {
      const id = `d${seq.current++}`;
      setDonations((ds) => [{ ...d, id, at: Date.now(), payment: 'Paid', delivery: 'Order placed' }, ...ds]);
      // SIMULATED DEMO delivery: out for delivery after 12 s, delivered after 40 s.
      setTimeout(() => setDonations((ds) => ds.map((x) => (x.id === id ? { ...x, delivery: 'Out for delivery' } : x))), 12000);
      setTimeout(() => setDonations((ds) => ds.map((x) => (x.id === id ? { ...x, delivery: 'Delivered' } : x))), 40000);
    },
    addListing: (l) => { setAdoptions((a) => [{ ...l, id: `a${seq.current++}`, status: 'Available', mine: true, poster: account?.name.split(' ')[0] ?? 'You' }, ...a]); showToast('Listing published', { sub: `${l.name ?? 'Your animal'} is now on Adopt a pet` }); },
    markAdopted: (id, adopter) => { setAdoptions((a) => a.map((x) => (x.id === id ? { ...x, status: 'Adopted', adopter } : x))); showToast('Marked as adopted', { sub: 'Thank you for finding them a home' }); },
    removeListing: (id) => { setAdoptions((a) => a.filter((x) => x.id !== id)); showToast('Listing removed', { tone: 'info', sub: 'It no longer shows on Adopt a pet' }); },
    sendAdoptionMessage: (listingId, text) => {
      if (ABUSE.some((r) => r.test(text))) return false;
      const failed = /fail/i.test(text);
      setAdoptionChats((m) => [...m, { id: `am${seq.current++}`, listingId, from: account?.name.split(' ')[0] ?? 'You', mine: true, text, at: Date.now(), failed }]);
      // SIMULATED DEMO: the poster replies to each message, with a typing indicator.
      const listing = adoptions.find((x) => x.id === listingId);
      if (listing && !listing.mine && !failed) {
        const turn = turns.current[listingId] ?? 0;
        turns.current[listingId] = turn + 1;
        const reply = adoptionReply(listing, text, turn);
        setTimeout(() => setTyping((x) => ({ ...x, [listingId]: listing.poster })), 800);
        setTimeout(() => {
          setTyping((x) => ({ ...x, [listingId]: undefined }));
          setAdoptionChats((m) => [...m, { id: `am${seq.current++}`, listingId, from: listing.poster, mine: false, at: Date.now(), text: reply }]);
        }, 800 + typingDelay(reply));
      }
      return true;
    },
    retryAdoptionMessage: (mid) => setAdoptionChats((m) => m.map((x) => (x.id === mid ? { ...x, failed: false } : x))),
  }), [account, cases, chats, reportedIds, transportedIds, adoptions, foodRequests, donations, toast, adoptionChats, typing, showToast, requireAccount, completeAccount, submitReport, patchCase]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

export function useCase(id: string | undefined) {
  const { cases } = useStore();
  return cases.find((c) => c.id === id);
}

export function timeAgo(at: number) {
  const m = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} h ago`;
}

/** Demo account mobile: last four digits masked so no real number ever appears (CLAUDE.md). */
export const DEMO_MOBILE = '993050XXXX';

/** Formats a 10-digit number as "+91 XXXXX XXXXX"; the masked demo number is shown as is. */
export function mobileLabel(m?: string | null) {
  const v = m || DEMO_MOBILE;
  return `+91 ${/^\d{10}$/.test(v) ? v.replace(/(\d{5})(\d{5})/, '$1 $2') : v}`;
}

export function distanceLabel(m: number) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}
