# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Street Animal Rescue App (working title): an India-first **Animal Emergency Response Network** for street cats and dogs, designed around a Mumbai pilot. Mission: **Report → Respond → Treat → Outcome**. A mobile app for citizens (every user can report and help), a privacy-safe web case preview for shared links, a dashboard for registered/verified organisations and veterinary hospitals, and admins. Secondary: adoption listings and product-based food donations.

**This is a portfolio project and Mumbai pilot concept.** All organisations, people and cases are fictional (demo organisation: **Lumen Animal Rescue & Shelter**, a registered shelter home onboarded by the admin, D119); never imply a partnership with a real organisation. Do not build pilot infrastructure (real SMS, WhatsApp integration, real payments, real delivery, real push/email).

### Prototype classification

- **REAL PROTOTYPE**: functionality and data structures that actually work within the portfolio prototype. Not production-ready.
- **SIMULATED DEMO**: the experience is demonstrated using simulated or seeded behaviour.
- **FUTURE ARCHITECTURE**: documented for future implementation, not implemented now. **Never build it.**

The classification for each feature is in `docs/02-scope.md`. Items marked **Deferred** (**N10 — Deferred to Next Phase**, D109) must not be implemented until decided. No items are currently marked **Needs Product Decision** (N7a was locked by D100).

Read before making product decisions: `docs/01-product.md` … `docs/07-privacy-safety.md`.

### Documentation workflow

- `docs/02-scope.md` holds the decision log (currently **D1–D147**). New decisions get the next D-number; older entries are never deleted, only annotated *AMENDED* / *SUPERSEDED* / *DEFERRED*. The latest decision wins.
- `docs/04-screens.md` is the screen inventory with stable IDs (PUBLIC-, AUTH-, REPORT-, RESP-, CHAT-, PROFILE-, ADOPT-, FOOD-, ORG-, ADMIN-, STATE-). Wireframe IDs appear in brackets.
- **Low-fidelity wireframes (done; layout only, no visual design):**
  - `wireframes/01-home.md`: H1–H10 Home (Map/List, case sheet, list cards, empty, RESPONDER_TO_HOSPITAL, professional help active, status transitions, secondary access, signed-out browsing)
  - `wireframes/01-citizen-reporting.md`: W0 Welcome, W1 (pointer to 01-home), WA1–WA3 + WA5 account setup / sign-in (WA4 retired, D137), W2–W8 report flow, W9 Case Detail (+ W9b cancel, W9c passed away), W10 case chat, P1 Profile, P2 My Reports
  - `wireframes/02-community-responder.md`: R1–R10 (Take me to the animal → safety check → navigation → status check → transport decision → mobile → hospital → start transport → stage 2 → hospital confirms)
  - `wireframes/03-organisation-dashboard.md`: O1–O10 + overlays ORG-O1–O7
  - `wireframes/04-adoption-food.md`: AD1–AD6 adoption, FD1–FD6 food donations
  - `wireframes/05-public-directory-preview-help.md`: DIR1/DIR2 directory, WEB1 web case preview, HS1 Help & Safety
  - Not yet wireframed: admin screens (ADMIN-01–07).
- **Build started (2026-10-05):** the citizen mobile app prototype is in `apps/mobile` (Expo SDK 57, Expo Router, demo data, Rescue Network design system); shared rules in `packages/shared`. The organisation dashboard, admin and Supabase backend are not built yet.

### Current status and next steps

Product definition and low-fidelity wireframes are complete up to **D147**; the citizen app prototype exists in `apps/mobile` (see its README). Suggested next steps, in order: final consistency check of docs + wireframes → admin wireframes → design system / visual design → clickable prototype or MVP build (demo mode). Before a real pilot: legal (DPDP), veterinary and operational validation (docs/07). Do not start code or visual design until the user asks.

## Scope rules

- **Build only MVP features in `docs/02-scope.md`** (REAL PROTOTYPE or SIMULATED DEMO). Never build FUTURE ARCHITECTURE (sterilisation/ABC screens, WhatsApp integration, government integrations, real payments/delivery, AI triage, offline queue, live responder/rescue tracking, automatic handover, data export/delete).
- **Out of scope, never build:** pet profiles, owned-pet records, vaccination management or reminders for owned pets, pet appointments, pet health tracking, pet-owner management; general social networking, public galleries, public case feeds or browsable listings, comments, likes, social posts, general (non-case) community chat; Stars, points, badges, scores, rankings, streaks, leaderboards; generic cash donations, arbitrary money transfers, volunteer/user-created food donation requests.
- If a task needs something out of scope, undecided or deferred, stop and ask. Record new product decisions in `docs/02-scope.md`.

## Stack

- `apps/mobile`: React Native + Expo (TypeScript, Expo Router)
- `apps/dashboard`: Next.js (TypeScript) + Tailwind + shadcn/ui, PWA; organisation and admin routes; the privacy-safe web case preview is a public, non-indexed route here
- `packages/shared`: types, status machine, transition rules, problem codes, outcomes, urgency rules, Home visibility rule, copy strings
- `supabase/`: migrations (Postgres + PostGIS + RLS), edge functions, cron, seed data

Check current library docs before using APIs; do not rely on memory for Expo, Next.js or Supabase specifics.

## Conventions

- TypeScript everywhere, strict mode.
- **Statuses, transitions, outcomes, problem codes and the Home visibility rule are defined once in `packages/shared`** and enforced again in the database (the source of truth). Never hard-code status strings in UI code.
- **Access control is enforced with Supabase row-level security**, following `docs/07-privacy-safety.md`.
- **Authentication (D137, amended by D144):** One-time account verification with required name, email address and mobile number. One-time setup: Name → Email → Mobile → code → signed in. Name required (not a full/legal name); any valid email provider; a one-time 6-digit code is sent to the **mobile** (D144: "Check your phone"), so the mobile is verified; the user then stays signed in. No passwords, no Google-only sign-in, no email magic links. Applies to citizens and organisation members. Code delivery is simulated in the prototype (no real SMS). Signing back in after Logout / new device, account uniqueness and profile editing are **not decided**: do not assume them. Browsing (including reading case chat and the directory) needs no account; an account is required to report, tap Take me to the animal (the whole responder flow, D111), post or flag in case chat, create adoption listings, contribute food donations and open Profile.
- **Reporter mobile number:** required on every report, for emergency coordination only; uses the account mobile provided at setup, which cannot be changed (D117); not an authentication factor. Not public profile data. Visible only to the handling verified organisation/hospital and admins.
- Every status change writes a `CaseEvent`. Never update `case.status` without one.
- **Case status belongs to the animal, not to people's movements or chat.** A community responder's actions never change `case.status`, except creating a community `Transport` when `case.status == NEW` and all conditions are met (reached, safe to transport, account mobile on file (D143), **registered/verified veterinary hospital** selected, hospital informed, transport started) → `RESPONDER_TO_HOSPITAL`. Never override an active professional response. `TO_HOSPITAL` ("Reaching hospital") is professional only.
- **N10 — Deferred to Next Phase (D109):** no MVP rule, UI or automatic status transition for a community responder who can't continue after reaching the animal or after starting transport, "I can't continue" / "Request help", transfer/handover, replacement, cancellation during community transport, related reactivation, admin reopen (D123), a hospital that never confirms arrival (D127), or no registered veterinary hospital nearby at hospital selection (D132). Do not resolve it implicitly in code.
- **D110:** after community transport, `AT_HOSPITAL` (Hospital reached) is set only when the selected veterinary hospital confirms arrival; the responder's arrival tap records arrival on the Transport and never changes status.
- **N11:** if professional help becomes active while a responder travels, navigation continues; the responder is told help is on the way; at the animal they see the current status; transport/override actions are unavailable.
- **Community transport destination = registered/verified veterinary hospital only.** Rescue organisations and shelters take part in the professional response but are never selectable as a community transport destination.
- **N24 (D98, amended by D143):** the account mobile (from setup; fixed, D117) is no longer shown or confirmed on the Arrange transport step; it is still shared with the selected registered veterinary hospital when transport starts (N12).
- **N12:** the selected veterinary hospital sees the responder's name, email, mobile and role only after the responder starts transport to it; no other organisation, user or public surface ever sees them. Never share responder live location; never expose responder identity, contact or movement publicly.
- **My Reports** contains only cases the user reported and cases they personally started transporting. **Notifications** go only to those two groups (plus organisation channels); no "nearby distress" notifications.
- **Case chat (D101):** "Case chat is open to everyone. Anyone can view the conversation, and any signed-in user can participate by sending messages. No case involvement or prior action is required to participate." Reading needs no sign-in; sending requires a signed-in account (D137); never anonymous posting. No Join chat, eligibility gate or non-participant state. Chatting never changes status, adds to My Reports, makes anyone a community responder or grants responder permissions. Case actions remain permission/state based. Show first name, role label where applicable, Blue Tick and organisation name; never auto-expose phone, email, address or live location (users may share voluntarily). Official messages pinned at top. Proactive multilingual abuse filter (English, Hindi, Marathi, Hinglish, Marathi-English). Failed sends show "Message not sent" with Retry and keep the text (D106).
- **Passed away (D74, D100 / N7a):** a reporter/responder report sets `death_reported_pending` (status unchanged), shown as "Passed away — awaiting confirmation"; it stays visible on Home and is never silently removed; normal help/emergency actions for the current status remain available. Reporters/responders cannot confirm the outcome. Only a registered/verified veterinary hospital or rescue organisation confirms → `CLOSED` + `deceased` ("Closed — Passed away") → removed from Home. If no organisation is available, the case stays pending. Admin review/escalation is not defined; do not build it.
- **Home visibility:** `NEW`, `ACCEPTED`, `ON_THE_WAY`, `ON_SITE`, `TO_HOSPITAL`, `RESPONDER_TO_HOSPITAL` (view only), `CLOSED`+`not_found` for 2 hours, cases with `death_reported_pending`. Hidden: `AT_HOSPITAL`, `IN_CARE`, other `CLOSED` outcomes, `CANCELLED`. Map and List share one query. Visibility never grants permission to intervene. No automatic reopening and no admin reopen in the MVP (D123); reopening is N10 — Deferred to Next Phase.
- **Sharing:** device share sheet; live link (app → Case Detail, else privacy-safe web preview, no sign-in needed); links never expire while the case exists and are not search-indexed; never include reporter name/email/mobile, private profile info or chat.
- **D108:** shared links and the web preview never render case chat: no messages, no contact details shared in chat, no private participant info, no responder identity/contact, no private coordination details. They may show evidence, type, reason, the exact animal location pin (same as the app, D112), current official status, help information, final outcome and Open in App. Case chat stays open inside the app (D101).
- **Blue Tick** is the only recognition: `blue_tick_status` (`NOT_VERIFIED` · `VERIFIED`) with verified/revoked audit fields; granted and revoked only by platform/admin; shown on Profile and next to names in case chat only; no special permissions; never a professional credential.
- **Directory (D102):** the Veterinary & Animal Organisations directory is public (no sign-in); its entry point is Home, not Profile (D138); information only; never the transport destination picker.
- **Organisations (D105, amended by D145):** only organisations approved through the platform/admin process are onboarded. Organisations can apply through **Register your organisation** on the directory page (D145): they must confirm free-of-cost service (never charging reporters or responders), and the admin reviews and decides. No in-app application status or pending-verification state. Unapproved organisations get no dashboard, cases, food requests or organisation adoption listings.
- **Profile:** Blue Tick, Your Impact (tiles open Cases reported, Taken to care, My Adoption Listings (D103) and My Food Donations (D104); no separate list of these links), Notification settings, Help & Safety, Privacy, Terms, Logout. No directory link (D138).
- **Flag message (D113, narrows D107):** only individual case chat messages can be flagged; account sign-in required; label "Flag message" (never "Report"); reasons "Abusive or unprofessional language" / "False or misleading information"; optional details; confirmation "Thanks for flagging this. Our team will review it."; never removes the message; admin review. No flag action on adoption listings, food requests or directory listings.
- **Sign-in failure (D106):** "Sign-in didn’t work" / "We couldn’t sign you in. Please try again." / Try Again.
- **Account setup details (D137, D144):** name (not full/legal name), email, mobile, then a code sent to the mobile. The mobile is never editable (D117).
- **Organisation onboarding (D118, amended by D145):** the platform admin onboards organisations (including government veterinary hospitals) and their first dashboard members through a backend admin form, and also reviews applications sent through Register your organisation (D145). Org admins add and remove staff in Team / Settings (D133).
- **Adoption (D94, D103, D125, D126):** secondary; users and verified organisations list animals (Dog/Cat/Other, name if known, age, gender, location, description, temperament, special needs, vaccination status + optional details, adoption requirements, poster info, up to 4 photos or videos (D147)); status Available / Adopted only; Chat with poster; poster phone never shown; never on the distress map/list. Posters manage listings in My Adoption Listings (edit, mark Adopted, remove, conversations); when marking Adopted the poster picks the adopter from their chats (D146), and the adopter sees the animal on the "Adopted by you" tab of My Adoption Listings. Interested users return to a chat via the listing. No pet-management features.
- **Food donations (D115, D120):** only registered/verified veterinary hospitals, rescue organisations and shelter homes create requests listing specific products; signed-in users pick one product and quantity, pay (each donation appears in My Food Donations with statuses Paid/Failed · Order placed → Out for delivery → Delivered · Open/Fulfilled, D124), and it's delivered to the organisation's registered address; the organisation marks fulfilled. Payment and delivery are SIMULATED DEMO.
- **Empty states (D130):** use the locked copy in `docs/04-screens.md` (STATE-M01–M04).
- **Locked UI copy to reuse (do not rewrite):** account-setup code errors (D131, code sent to the email); dashboard copy, unlinked account / empty Inbox / empty Confirmations / "The responder says they've arrived." (D134); adoption required fields and "Payment didn't go through. You haven't been charged. Try again." (D135); web preview not found "This case isn't available. It may have been removed." (D136).
- **Deferred to Next Phase (never design or build now):** N10 scope (D109, incl. admin reopen D123, hospital never confirms D127) and no registered veterinary hospital nearby at hospital selection (D132).
- Images are compressed on device. Sensitive images render blurred until tapped. No background location, location history or contact-list access.
- Demo-only code paths are gated by a single demo flag. Seed data is fictional and flagged `is_demo`. Calls are disabled in the demo. Never use real phone numbers.
- **Notifications are simulated** via `NotificationLog`; `DeviceToken` is FUTURE. Notification/install explainers never trigger real OS/browser permission requests.
- Case IDs use the temporary `AR-` prefix.

## Design guardrails

- **Navigation: Home | Adoption | (Report) | Donation | FAQs (D139, D140, D142; supersedes D48's two tabs).** Home is the default tab and stays emergency-first. The raised centre circle is a Report action (opens the report flow), not a tab; Home keeps its Report button. Profile opens from the top-right button on every tab (D142). FAQs hold the "Who do I call?" questions with masked numbers (D141). No My Reports, Responder, Community, Rewards or Chat tabs. Donation = product-based food donations only.
- Home hierarchy: 1 nearby animals in distress (Map/List) · 2 Report an animal in distress · 3 adoption · 4 food donation discovery · 5 Veterinary & Animal Organisations directory link (D128). Help & Safety is public (D129). Adoption listings and food donation requests never appear on the distress map/list.
- Report flow: (account setup if signed out: name → email → mobile → email OTP) → Media (1–4; safety fallback only) → What's wrong? (+ optional "Tell us what you saw") → Where is it? → Mobile number → Send → (possible duplicate) → Report sent. Leaving a draft asks "Discard this report?". Submitted reports are locked; no extra evidence after submission.
- Case Detail is action-first and stays the same through the lifecycle; only the status/action area changes. No likes, comments, feeds or engagement mechanics.
- Safety check before approaching; never pressure physical intervention. "Not able to" always has equal weight.
- Red-family colours only for urgency. The Blue Tick is quiet and never reads as a professional credential.
- Minimum 48 dp tap targets; one-handed report flow; works on low-end Android.
