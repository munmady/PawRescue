/** Fictional Mumbai demo content (SIMULATED DEMO). No real people, numbers or organisations. */
import type { AdoptionPhotoKey, FoodPhotoKey, PhotoKey } from './photos';
import type { ProductKind } from './ProductArt';
import type { CaseStatus, Outcome, ProblemCode, Species } from '@animal/shared';

export type Role = 'Reporter' | 'Community Responder' | 'Organisation';

export interface CaseEvent {
  at: number;
  label: string;
}

export interface Case {
  id: string;
  species: Species;
  title: string;
  problems: ProblemCode[];
  description: string;
  area: string;
  landmark?: string;
  distanceM: number;
  /** Position on the illustrative map, in % of its width/height. */
  x: number;
  y: number;
  status: CaseStatus;
  outcome?: Outcome | null;
  closedAt?: number | null;
  etaMinutes?: number | null;
  organisationName?: string | null;
  hospitalName?: string | null;
  reportedAt: number;
  reporterId: string;
  deathReportedPending?: boolean;
  evidence: number;
  /** Demo evidence photos (see src/photos.ts); count matches `evidence`. */
  photos?: PhotoKey[];
  voiceNoteSeconds?: number;
  sensitive?: boolean;
  noMedia?: boolean;
  events: CaseEvent[];
}

export interface ChatMessage {
  id: string;
  caseId: string;
  firstName: string;
  role: Role | null;
  orgName?: string;
  blueTick?: boolean;
  official?: boolean;
  text: string;
  at: number;
  mine?: boolean;
  failed?: boolean;
}

/** One-to-one adoption chat between the signed-in user and a listing's poster (ADOPT-05, D125). */
export interface AdoptionMessage {
  id: string;
  listingId: string;
  /** First name, or the organisation name when an organisation posted the listing. */
  from: string;
  mine: boolean;
  text: string;
  at: number;
  failed?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  etaMin: number;
}

export interface Organisation {
  id: string;
  name: string;
  type: 'Veterinary hospital' | 'Rescue organisation' | 'Shelter home';
  area: string;
  distanceKm: number;
  hours: string;
  services: string;
}

export interface AdoptionListing {
  id: string;
  name?: string;
  species: Species;
  age: string;
  gender: 'Male' | 'Female' | 'Unknown';
  area: string;
  description: string;
  temperament: string;
  vaccination: 'Vaccinated' | 'Partially vaccinated' | 'Not vaccinated' | 'Unknown';
  requirements: string;
  poster: string;
  status: 'Available' | 'Adopted';
  mine?: boolean;
  /** First name of the adopter, chosen by the poster when marking Adopted (D146). */
  adopter?: string;
  /** The signed-in user is the adopter: shown under "Adopted by you" (D146). */
  adoptedByMe?: boolean;
  /** Demo portrait (src/photos.ts); the first of `media` when the poster added photos. */
  photo?: AdoptionPhotoKey;
  /** Up to 4 photos or videos added by the poster (D147). */
  media?: { kind: 'photo' | 'video'; photo: AdoptionPhotoKey }[];
}

export interface FoodProduct {
  id: string;
  name: string;
  size: string;
  price: number;
  /** Unbranded pack illustration (src/ProductArt.tsx). */
  kind: ProductKind;
  /** 0–1: how full the pack sits in its tile, so bigger sizes look bigger. */
  fill: number;
  /** Product image (for illustration); falls back to the pack art. */
  photo?: FoodPhotoKey;
}

export interface FoodRequest {
  id: string;
  org: string;
  need: string;
  status: 'Open' | 'Fulfilled';
  products: FoodProduct[];
}

export interface Donation {
  id: string;
  requestId: string;
  /** The product chosen, so the donation can be repeated. */
  productId?: string;
  org: string;
  product: string;
  /** Pack art for My food donations. */
  kind?: ProductKind;
  photo?: FoodPhotoKey;
  quantity: number;
  amount: number;
  at: number;
  payment: 'Paid' | 'Failed';
  delivery: 'Order placed' | 'Out for delivery' | 'Delivered';
}

const now = Date.now();
const min = 60 * 1000;

export const SEED_CASES: Case[] = [
  {
    id: 'AR-10245', species: 'dog', title: 'Injured dog', problems: ['hit_by_vehicle'],
    description: 'The dog appears to have an injured rear leg and is lying near the bus stop.',
    area: 'Andheri East', landmark: 'Near Hill Road bus stop', distanceM: 850, x: 30, y: 30,
    status: 'NEW', reportedAt: now - 12 * min, reporterId: 'u-neha', evidence: 3, photos: ['dog-leg-wound', 'dog-leg-wound-closeup', 'dog-leg-wound-face'], voiceNoteSeconds: 21,
    events: [{ at: now - 12 * min, label: 'Reported' }],
  },
  {
    id: 'AR-10241', species: 'cat', title: 'Injured cat', problems: ['bleeding'],
    description: 'Cat with a bleeding wound on its neck, sitting outside the pharmacy.',
    area: 'Powai', landmark: 'Outside Lake Road pharmacy', distanceM: 1800, x: 75, y: 22,
    status: 'ON_THE_WAY', etaMinutes: 8, organisationName: 'Lumen Animal Rescue & Shelter',
    reportedAt: now - 25 * min, reporterId: 'u-arjun', evidence: 2, photos: ['cat-neck-wound', 'cat-neck-wound-closeup'], sensitive: true,
    events: [
      { at: now - 25 * min, label: 'Reported' },
      { at: now - 18 * min, label: 'Accepted by Lumen Animal Rescue & Shelter' },
      { at: now - 6 * min, label: 'Help reaching in ~8 min' },
    ],
  },
  {
    id: 'AR-10238', species: 'dog', title: 'Dog unable to walk', problems: ['cant_walk'],
    description: "Dog that can't stand up, lying on the pavement near the station's east exit.",
    area: 'Jogeshwari', distanceM: 2400, x: 68, y: 72,
    status: 'RESPONDER_TO_HOSPITAL', hospitalName: 'Lumen Animal Rescue & Vet Care',
    reportedAt: now - 40 * min, reporterId: 'u-priya', evidence: 1, photos: ['dog-lying'],
    events: [
      { at: now - 40 * min, label: 'Reported' },
      { at: now - 9 * min, label: 'Responder taking animal to hospital' },
    ],
  },
  {
    id: 'AR-10236', species: 'cat', title: 'Weak kitten', problems: ['very_sick'],
    description: 'Very weak kitten with sore eyes, not eating, in the society parking area.',
    area: 'Marol', distanceM: 3100, x: 19, y: 63,
    status: 'ACCEPTED', organisationName: 'Lumen Animal Rescue & Shelter',
    reportedAt: now - 31 * min, reporterId: 'u-sam', evidence: 2, photos: ['kitten-weak', 'kitten-weak-face'],
    events: [
      { at: now - 31 * min, label: 'Reported' },
      { at: now - 20 * min, label: 'Accepted by Lumen Animal Rescue & Shelter' },
    ],
  },
  {
    id: 'AR-10247', species: 'dog', title: 'Trapped puppy', problems: ['trapped'],
    description: 'Puppy stuck under a broken concrete slab, crying.',
    area: 'Saki Naka', landmark: 'Behind the bakery', distanceM: 1200, x: 46, y: 84,
    status: 'NEW', reportedAt: now - 6 * min, reporterId: 'u-ravi', evidence: 2, photos: ['puppy-trapped', 'puppy-trapped-face'],
    events: [{ at: now - 6 * min, label: 'Reported' }],
  },
  {
    id: 'AR-10230', species: 'dog', title: 'Dog with an eye wound', problems: ['bleeding'],
    description: 'Dog with a wound near its eye, lying by a parked car. The rescue team searched the area.',
    area: 'Chakala', distanceM: 1500, x: 58, y: 44,
    status: 'CLOSED', outcome: 'not_found', closedAt: now - 30 * min,
    organisationName: 'Lumen Animal Rescue & Shelter', reportedAt: now - 2 * 60 * min, reporterId: 'u-neha', evidence: 1, photos: ['dog-head-wound'],
    events: [
      { at: now - 120 * min, label: 'Reported' },
      { at: now - 90 * min, label: 'Accepted by Lumen Animal Rescue & Shelter' },
      { at: now - 30 * min, label: 'Could not locate' },
    ],
  },
];

export const SEED_CHATS: ChatMessage[] = [
  { id: 'm1', caseId: 'AR-10241', firstName: 'Lumen Animal Rescue & Shelter', role: 'Organisation', orgName: 'Lumen Animal Rescue & Shelter', official: true,
    text: 'Our team is on the way. Please keep a safe distance and don’t try to pick the cat up.', at: now - 6 * min },
  { id: 'm2', caseId: 'AR-10241', firstName: 'Arjun', role: 'Reporter', text: 'She moved behind the blue scooter.', at: now - 4 * min },
  { id: 'm3', caseId: 'AR-10245', firstName: 'Neha', role: 'Reporter', blueTick: true, text: 'The dog is lying near the bus stop. He looks scared but calm.', at: now - 10 * min },
  { id: 'm4', caseId: 'AR-10245', firstName: 'Kabir', role: null, text: 'I walk past here every day, he has been around for a week.', at: now - 7 * min },
];

export const HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Lumen Animal Rescue & Vet Care', distanceKm: 2.1, etaMin: 10 },
  { id: 'h2', name: 'Saathi Vet Hospital (demo)', distanceKm: 3.4, etaMin: 15 },
];

export const ORGANISATIONS: Organisation[] = [
  { id: 'o1', name: 'Lumen Animal Rescue & Vet Care', type: 'Veterinary hospital', area: 'Linking Road, Bandra West', distanceKm: 2.1, hours: 'Open 24 hours', services: 'Emergency care, surgery, vaccination' },
  { id: 'o2', name: 'Lumen Animal Rescue & Shelter', type: 'Shelter home', area: 'Marol, Andheri East', distanceKm: 3.0, hours: '9 am – 7 pm', services: 'Rescue, shelter, adoption' },
  { id: 'o3', name: 'Saathi Vet Hospital (demo)', type: 'Veterinary hospital', area: 'Powai', distanceKm: 3.4, hours: '8 am – 10 pm', services: 'Outpatient care, X-ray' },
  { id: 'o4', name: 'Kinara Animal Rescue (demo)', type: 'Rescue organisation', area: 'Jogeshwari', distanceKm: 4.2, hours: 'Helpline 24 hours', services: 'Street animal rescue, transport' },
];

export const ADOPTIONS: AdoptionListing[] = [
  { id: 'a1', name: 'Mishti', species: 'cat', age: '~4 months', gender: 'Female', area: 'Bandra West', description: 'Rescued from a construction site, now healthy and playful.', temperament: 'Friendly with people and other cats', vaccination: 'Partially vaccinated', requirements: 'Indoor home, one follow-up visit', poster: 'Neha', status: 'Available', photo: 'kitten-tabby' },
  { id: 'a2', name: 'Bruno', species: 'dog', age: '~2 years', gender: 'Male', area: 'Powai', description: 'Recovered from a leg injury. Calm and loves walks.', temperament: 'Gentle, good with children', vaccination: 'Vaccinated', requirements: 'Space for daily walks', poster: 'Lumen Animal Rescue & Shelter', status: 'Available', photo: 'dog-golden' },
  { id: 'a3', species: 'dog', age: '~6 months', gender: 'Unknown', area: 'Marol', description: 'Shy puppy who warms up quickly.', temperament: 'Shy at first', vaccination: 'Unknown', requirements: 'Patient family', poster: 'Kabir', status: 'Adopted', photo: 'puppy-black-tan', adoptedByMe: true },
  { id: 'a4', name: 'Laddoo', species: 'cat', age: '~1 year', gender: 'Male', area: 'Andheri West', description: 'Found as a stray near a tea stall. Now relaxed and affectionate.', temperament: 'Calm, loves a warm lap', vaccination: 'Vaccinated', requirements: 'Indoor home', poster: 'Lumen Animal Rescue & Shelter', status: 'Available', photo: 'cat-orange' },
  { id: 'a5', name: 'Kaali', species: 'dog', age: '~1 year', gender: 'Female', area: 'Chakala', description: 'Cheerful and street-smart. Fully recovered from a skin infection.', temperament: 'Playful and energetic', vaccination: 'Vaccinated', requirements: 'Active family, secure gate', poster: 'Priya', status: 'Available', photo: 'dog-black' },
  { id: 'a6', name: 'Chutki', species: 'cat', age: '~3 months', gender: 'Female', area: 'Saki Naka', description: 'Bottle-fed after being found alone. Curious and confident.', temperament: 'Curious, gentle', vaccination: 'Partially vaccinated', requirements: 'Indoor home, one follow-up visit', poster: 'Lumen Animal Rescue & Shelter', status: 'Available', photo: 'kitten-calico' },
  { id: 'a7', name: 'Sonu', species: 'dog', age: '~5 months', gender: 'Male', area: 'Jogeshwari', description: 'Found alone near a garden. Healthy now and full of energy.', temperament: 'Friendly, loves to play fetch', vaccination: 'Vaccinated', requirements: 'Daily walks, one follow-up visit', poster: 'Rohan', status: 'Available', photo: 'puppy-tan' },
  { id: 'a8', name: 'Pari', species: 'cat', age: '~4 months', gender: 'Female', area: 'Powai', description: 'Rescued from a building compound. Curious and loves sunny windows.', temperament: 'Gentle, a little shy at first', vaccination: 'Partially vaccinated', requirements: 'Indoor home', poster: 'Lumen Animal Rescue & Shelter', status: 'Available', photo: 'kitten-white-tabby' },
];

export const FOOD_REQUESTS: FoodRequest[] = [
  { id: 'f1', org: 'Kinara Animal Rescue (demo)', need: 'Help feed 35 rescued cats and dogs.', status: 'Open', products: [
    { id: 'p1', name: 'Dry cat food', size: '1 kg', price: 260, kind: 'dry-cat', fill: 0.55, photo: 'dry-cat-food-1kg' },
    { id: 'p2', name: 'Dry cat food', size: '3 kg', price: 720, kind: 'dry-cat', fill: 0.85, photo: 'dry-cat-food-3kg' },
    { id: 'p3', name: 'Dry dog food', size: '5 kg', price: 1150, kind: 'dry-dog', fill: 1, photo: 'dry-dog-food-5kg' },
  ] },
  { id: 'f2', org: 'Saathi Vet Hospital (demo)', need: 'Recovery diet for animals after surgery.', status: 'Open', products: [
    { id: 'p4', name: 'Recovery wet food', size: '12 pouches', price: 540, kind: 'wet', fill: 0.8, photo: 'wet-cat-food' },
  ] },
];

export const SEED_USER_ID = 'u-me';
