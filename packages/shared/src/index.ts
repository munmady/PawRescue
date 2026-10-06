/**
 * Shared product rules. Statuses, transitions, outcomes, problem codes and the
 * Home visibility rule are defined once here (docs/03-flows-lifecycle.md) and
 * enforced again in the database when the backend is built.
 */

export type CaseStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ON_SITE'
  | 'TO_HOSPITAL'
  | 'RESPONDER_TO_HOSPITAL'
  | 'AT_HOSPITAL'
  | 'IN_CARE'
  | 'CLOSED'
  | 'CANCELLED';

export type Outcome =
  | 'released_at_origin'
  | 'relocated_or_sheltered'
  | 'ready_for_adoption'
  | 'adopted'
  | 'treated_on_site'
  | 'not_found'
  | 'already_helped'
  | 'owned_animal'
  | 'deceased'
  | 'other';

export type Species = 'dog' | 'cat' | 'other';

export const PROBLEMS = [
  { code: 'hit_by_vehicle', label: 'Hit by vehicle' },
  { code: 'bleeding', label: 'Bleeding or wound' },
  { code: 'cant_walk', label: "Can't walk or stand" },
  { code: 'not_responding', label: 'Not responding' },
  { code: 'very_sick', label: 'Very sick or weak' },
  { code: 'trapped', label: 'Trapped or stuck' },
  { code: 'other', label: 'Other' },
] as const;
export type ProblemCode = (typeof PROBLEMS)[number]['code'];

export const SUCCESS_OUTCOMES: Outcome[] = [
  'released_at_origin',
  'relocated_or_sheltered',
  'ready_for_adoption',
  'adopted',
  'treated_on_site',
];

/** Visual tone of a status; colour is never the only signal (icon + label too). */
export type StatusTone = 'urgent' | 'info' | 'amber' | 'success' | 'neutral';

export interface CaseLike {
  status: CaseStatus;
  outcome?: Outcome | null;
  closedAt?: number | null;
  deathReportedPending?: boolean;
  etaMinutes?: number | null;
  organisationName?: string | null;
}

export const COULD_NOT_LOCATE_HOME_WINDOW_MS = 2 * 60 * 60 * 1000;

/** Display label for the official status (docs/03 "Status terminology"). */
export function statusLabel(c: CaseLike): string {
  switch (c.status) {
    case 'NEW':
      return 'Looking for help';
    case 'ACCEPTED':
      return c.organisationName ? `Accepted by ${c.organisationName}` : 'Accepted by organisation';
    case 'ON_THE_WAY':
      return `Help reaching in ~${c.etaMinutes ?? 'N'} min`;
    case 'ON_SITE':
      return 'Rescue team reached';
    case 'TO_HOSPITAL':
      return 'Reaching hospital';
    case 'RESPONDER_TO_HOSPITAL':
      return 'Responder taking animal to hospital';
    case 'AT_HOSPITAL':
      return 'Hospital reached';
    case 'IN_CARE':
      return 'Under treatment';
    case 'CANCELLED':
      return 'Cancelled';
    case 'CLOSED':
      if (c.outcome === 'not_found') return 'Could not locate';
      if (c.outcome === 'deceased') return 'Closed — Passed away';
      if (c.outcome && SUCCESS_OUTCOMES.includes(c.outcome)) return 'Rescued';
      return 'Closed';
  }
}

export function statusTone(c: CaseLike): StatusTone {
  switch (c.status) {
    case 'NEW':
      return 'urgent';
    case 'ON_THE_WAY':
      return 'amber';
    case 'ON_SITE':
    case 'AT_HOSPITAL':
    case 'IN_CARE':
      return 'success';
    case 'ACCEPTED':
    case 'TO_HOSPITAL':
    case 'RESPONDER_TO_HOSPITAL':
      return 'info';
    default:
      return 'neutral';
  }
}

/** Home visibility (D83, D84, D100). Map and List share this one rule. */
export function isVisibleOnHome(c: CaseLike, now: number): boolean {
  if (c.deathReportedPending && c.status !== 'CLOSED' && c.status !== 'CANCELLED') return true;
  switch (c.status) {
    case 'NEW':
    case 'ACCEPTED':
    case 'ON_THE_WAY':
    case 'ON_SITE':
    case 'TO_HOSPITAL':
    case 'RESPONDER_TO_HOSPITAL':
      return true;
    case 'CLOSED':
      return c.outcome === 'not_found' && c.closedAt != null && now < c.closedAt + COULD_NOT_LOCATE_HOME_WINDOW_MS;
    default:
      return false;
  }
}

/** Professional help active: Take me to the animal stays as navigation only (N11). */
export function isProfessionalActive(c: CaseLike): boolean {
  return c.status === 'ACCEPTED' || c.status === 'ON_THE_WAY';
}

export type PrimaryAction = 'take_me' | 'view';

/** Primary action on Home sheets and cards (wireframes/01-home.md token table). */
export function primaryAction(c: CaseLike): PrimaryAction {
  return c.status === 'NEW' ? 'take_me' : 'view';
}

/** Take me to the animal is offered for Looking for help and, as navigation only, while professional help is active. */
export function canTakeMeToAnimal(c: CaseLike): boolean {
  return c.status === 'NEW' || isProfessionalActive(c);
}

/** Community transport may start only from NEW (D56); the other conditions are checked in the flow. */
export function canStartCommunityTransport(c: CaseLike): boolean {
  return c.status === 'NEW';
}

/** Reporter may cancel only while NEW (D25). */
export function canReporterCancel(c: CaseLike): boolean {
  return c.status === 'NEW';
}

export const STATUS_ORDER: CaseStatus[] = [
  'NEW',
  'ACCEPTED',
  'ON_THE_WAY',
  'ON_SITE',
  'TO_HOSPITAL',
  'AT_HOSPITAL',
  'IN_CARE',
  'CLOSED',
];
