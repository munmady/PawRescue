# 01 · Product

## Label legend

| Label | Meaning |
|---|---|
| **CONFIRMED** | A requirement or decision the product owner has made |
| **REC** | A recommendation, adopted for the portfolio build unless changed |
| **ASSUMPTION** | Believed true, not checked |
| **NEEDS VALIDATION** | Must be tested with real people (or legal/veterinary review) before a real pilot |
| **Needs Product Decision** | Not resolved. Must not be built or assumed until decided (none currently open; N7a locked by D100). |
| **Deferred** | Intentionally postponed to a later phase. **N10 — Deferred to Next Phase** (community responder unable to continue transport and related handover/cancellation/reactivation, D109) and **no registered veterinary hospital nearby at hospital selection** (D132). No solution is designed or assumed. |

## Prototype classification

**CONFIRMED.**

| Class | Meaning |
|---|---|
| **REAL PROTOTYPE** | Functionality and data structures that actually work within the portfolio prototype (one-time email OTP account verification with simulated email delivery, database, routing, chat, realtime updates, Blue Tick status, web case preview). **Not production-ready.** |
| **SIMULATED DEMO** | Demonstrated with simulated or seeded behaviour (fictional organisations, simulated organisation responses, notifications and alerts, approximate ETAs, payments and delivery for food donations, shortened timeouts, disabled calls). |
| **FUTURE ARCHITECTURE** | Documented for future implementation, not implemented now. |

Every MVP feature in [02-scope.md](02-scope.md) is REAL PROTOTYPE or SIMULATED DEMO. The docs never imply a simulated integration is operational.

---

## Product positioning

**CONFIRMED.** An **India-first animal emergency response network**, designed around a realistic **Mumbai pilot**.

> **Help a street animal in distress move from Report → Respond → Treat → Outcome.**

**Primary purpose:**

1. Report an animal in distress.
2. Connect the case with professional responders and community responders.
3. Rescue / transport the animal.
4. Coordinate veterinary care.
5. Record the outcome.

**Secondary features:** pet adoption listings; product-based animal food donations.

**This product is not:** a general social network · a pet-management application · a personal pet health tracker · a vaccination/reminder system for owned pets · a generic crowdfunding/cash-donation platform.

Initial focus: street **cats and dogs** (road accidents, visible injuries, serious illness or infection, immediate distress).

## Context

- **CONFIRMED** Portfolio project and Mumbai pilot concept; pilot-ready in thinking, not operations.
- **CONFIRMED** Demo organisations are fictional; the primary demo organisation is **Lumen Animal Rescue & Shelter**, a registered shelter home (type `shelter`) onboarded by the platform admin (D118, D119); the demo hospital is **Lumen Animal Rescue & Vet Care**. No partnership with any real organisation is implied.
- **CONFIRMED** Government vet hospitals, NGOs, ambulances and municipal bodies are potential partners, not integrations.
- **CONFIRMED** Notifications, organisation alerts, maps/ETA, payments and delivery may be simulated in the prototype; real infrastructure is pilot/future scope.
- **CONFIRMED** Safety and medical copy must be professionally/veterinarily validated before real-world deployment.

## Product scope

| | |
|---|---|
| **Primary** | Animal in distress → rescue/transport → veterinary care → outcome |
| **Secondary** | **Adoption** listings (users and verified organisations; Available/Adopted; chat with poster; separate from emergencies). **Food donations**: registered/verified veterinary hospitals, rescue organisations and shelter homes request specific food products (D120); users donate a chosen product, delivered to the organisation's registered address. |
| **Future (V1.5)** | Sterilisation / ABC (data model may be prepared; not MVP) |
| **Out of scope** | Pet profiles, users' own pets, pet medical records, vaccination management or reminders for owned pets, pet appointments, pet health tracking, pet-owner management; general social networking, public galleries, public case feeds, comments, likes, social posts, general (non-case) community chat; Stars, points, badges, scores, rankings, streaks, leaderboards; generic cash donations, arbitrary money transfers, volunteer/user-created food donation requests. |

## Primary user groups

| Group | Who |
|---|---|
| **Citizen / Reporter** | Someone who discovers an animal in distress and creates a case. Often frightened, under time pressure, unsure about safety and responsibility. |
| **Community responder** | **Any app user** nearby who may be able to help. **No registration, no Responder tab, no opt-in.** Every user automatically sees nearby active cases. |
| **Registered organisation / veterinary hospital / shelter home** | Registered/verified rescue organisations, veterinary hospitals and shelter homes using a separate dashboard. Only organisations that have already completed verified registration through the platform/admin process are onboarded; there is no in-app application (D105). Only registered/verified veterinary hospitals can be selected as a community transport destination; rescue organisations and shelters take part in the professional response. |

For a real launch, organisations are recruited first. **REC**

## Identity and sign-in

**CONFIRMED (D137).** **Account setup and sign-in (D137, LOCKED):** One-time email OTP account verification with required name, email address and mobile number. One-time setup: **Name → Email → Mobile → Email OTP → signed in**. Name is required (not a full/legal name). Any valid email provider (Gmail, Outlook, Yahoo, work email, others). The mobile number is required and stored as profile/contact information; it is **not** verified and **not** used for OTP. A one-time code is sent to the **email address**; entering it completes setup and the user stays signed in. No passwords, no Google-only sign-in, no phone/SMS OTP, no email magic links. Applies to citizens and organisation dashboard members. Email OTP delivery is SIMULATED DEMO in the prototype (no real email). Users can **browse without an account**. Sign-in is required to report an animal, start the responder flow (at **Take me to the animal**, D111), create adoption listings, contribute to food donations, participate in case chat, and access Profile/My Reports.

The **mobile number** given at account setup is contact information for emergency coordination (distress reports, community transport). It is not verified, not used for sign-in and cannot be changed (D117). It is never public profile information.

## Core action and outcome

- **Core action:** submit a report a rescue team can act on: **1–4 photos/videos + accurate location + a mobile number** (or the explicit safety fallback when media can't be captured safely).
- **Core outcome:** the animal reaches veterinary care and a recorded outcome, and the people involved can see what happened.

## Success metrics (for a real pilot)

**REC, targets NEEDS VALIDATION:** share of reports accepted by a professional, or transported by a community responder, within 30 minutes · median time from report to hospital arrival · share of cases closed with a recorded outcome · report-flow completion rate.

---

## Product principles

1. **The emergency comes first.** Home leads with nearby animals in distress; secondary areas never overpower emergencies. **Home shows active cases where additional community assistance or useful information may still be relevant. Cases at confirmed hospital treatment or a closed outcome leave live Home**, except the defined exceptions (Responder taking animal to hospital; Could not locate for 2 hours). Being visible on Home never by itself permits intervention.
2. **Simplicity.** Every feature must support helping an animal in distress; adoption and food donations are the only secondary areas.
3. **Never a dead end.** Every state tells the user what they can do next.
4. **Honest over reassuring.** Real time stamps, approximate ETAs only, plain language about bad outcomes. Never guarantee rescue times or imply medical diagnosis.
5. **Case status belongs to the animal, not to people's movements or chat messages.**
6. **Evidence belongs to the case; identity belongs to the person.** Shared links communicate the case, never the case chat (D108). Helpers see case evidence and the exact location. Reporter and responder identity, contact and movement stay private unless shared through official coordination or voluntarily.
7. **Official guidance stays visible.** The handling organisation's messages are pinned above community chat.
8. **Safety over heroics.** Never pressure anyone into physical intervention.
9. **Recognition, not competition.** The Blue Tick quietly recognises responsible reporting. No points, scores, levels or rankings.
10. **People first, then software.** At pilot scale, an admin with a phone solves what trust scores and geofences would. **REC**

---

## Two response paths

**CONFIRMED.**

- **Professional response:** registered/verified hospitals and organisations accept the case and set the official status: Looking for help → Accepted by organisation → Help reaching in ~N min → Rescue team reached → Reaching hospital → Hospital reached → Under treatment → Rescued / Could not locate / Passed away / Cancelled.
- **Community responders:** any user can tap **Take me to the animal**, pass a safety check and go to the animal. Their movement is private and never changes the status. Only when the case is still **Looking for help**, they have reached the animal, can safely transport it, have provided/confirmed a mobile number, have selected a **registered/verified veterinary hospital**, informed it, and started transport, does the case become **🔵 Responder taking animal to hospital**. A community responder can never override or replace an active professional response.

Details: [03-flows-lifecycle.md](03-flows-lifecycle.md#case-lifecycle).

## Roles and permissions

**CONFIRMED.** Roles: **Citizen (reporter and community responder) · Organisation member (rescue organisation, veterinary hospital or shelter home: Org admin / Staff) · Platform admin.**

| Role | Can do |
|---|---|
| **Citizen** (anonymous browsing; signed in via one-time email OTP account verification for actions) | **Browse (no sign-in):** Home map/list, Case Detail, case chat (read), adoption listings, food donation requests, Veterinary & Animal Organisations directory, shared links. **Signed in, anyone:** post in any case chat (open to everyone, D101); flag case chat messages (D113). **Signed in, as reporter:** report (uses the account mobile from setup, read-only, D117); cancel own report while `NEW`; optional-help answers on Report sent; case chat; report Passed away (pending confirmation); My Reports. **Signed in, as community responder:** Take me to the animal (after safety check); case chat; at the animal, start community transport to a registered/verified **veterinary hospital** only while the case is Looking for help (mobile number required at that point); report Passed away (pending). **Secondary:** create adoption listings and chat with posters; contribute to food donation requests. **Profile:** Blue Tick status, Your Impact, My Reports, My Adoption Listings, My Food Donations, settings, link to the public organisations directory. Cannot see reporter phone/email/private profile data; cannot set professional statuses, override professional responses, close cases or create food donation requests. |
| **Organisation member: Staff** | Receive cases; view full evidence, reporter information when appropriate (including mobile number) and location; accept/decline; update professional status (approximate ETA); post pinned official updates in case chat; coordinate rescue; record hospital arrival, treatment and outcome; confirm passed-away reports; (veterinary hospitals only) see a community responder's name, email, mobile and role **only after** that responder starts transport to this hospital (no live location); create adoption listings; create and fulfil food donation requests (registered/verified veterinary hospitals, rescue organisations and shelter homes only, D120). |
| **Organisation member: Org admin** | Everything Staff can do, plus adding and removing staff by email and mobile (D133), and organisation settings (location, radius, species, services, hours, alert contacts, registered address, public profile). |
| **Platform admin** | Verify and onboard organisations/hospitals/shelters (outside the app; no in-app applications); manage the directory; review flagged chat messages; reassign cases; cancel cases (no admin reopen in the MVP, D123); block users; moderate chat and listings; **grant and revoke the Blue Tick** (the only role that can); edit safety content; live operations. |

### Not separate roles

- **Community responder:** an ability every citizen has. No registration, opt-in or Responder tab.
- **Veterinary hospital / shelter home:** organisation **types**.
- **Optional reporter help** ("stay nearby", "help transport if the team asks"): optional offers, never a responsibility.
- **Adoption poster, food donor:** activities, not roles.
- **Government department:** future organisation type.

### Blue Tick — Responsible Reporter

**CONFIRMED.** The only recognition mechanism. Granted and revoked **only by the platform/admin**, never automatically and never by formula or score. Eligibility may consider genuine distress reports, accurate/useful information, appropriate system use, and no repeated misuse, spam, fabricated reports or abuse. It means **"Verified by the platform as a responsible reporter"**, not a professional rescuer, veterinarian, NGO or government representative, or trained emergency responder. Shown on Profile ("Responsible Reporter ✓ · Recognised for responsible animal distress reporting.") and next to verified participants' names in case chat; never on the Home map, case cards, adoption listings or comparative surfaces. No special permissions. **Your Impact never determines Blue Tick eligibility.** Stars, points, badges, rankings, streaks and leaderboards are removed entirely.

### Organisation types and verification

Types: `ngo` (rescue organisation) · `independent_rescuer` · `clinic` (veterinary hospital/clinic) · `shelter` (shelter home) · future `government`.

Verification states: `directory_only` (fallback contact only; not on the platform; no dashboard) · `verified` · `suspended`. *The `pending` state and in-app application were removed by D105: verification happens through the platform/admin process before onboarding.*

- Only `verified` **veterinary hospitals** can be selected as a community transport destination. Verified rescue organisations take part in the professional response but are not selectable as a community transport destination.
- Only `verified` organisations/hospitals can see reporter mobile numbers (cases they handle), post official updates, give confirmations (a **Passed away** report is confirmed only by a verified veterinary hospital or rescue organisation, D100), and appear in the public **Veterinary & Animal Organisations** directory.
- Food donation requests and organisation adoption listings: registered/verified veterinary hospitals, rescue organisations and shelter homes only (D120).
- Onboarding: the platform admin onboards organisations (including government veterinary hospitals) and their dashboard members through a backend admin form (D118).
- Unverified organisations cannot access the dashboard, receive cases, create food donation requests or create organisation adoption listings (D105).
- The public **Veterinary & Animal Organisations** directory (no sign-in, D102) lists verified hospitals, rescue organisations and shelters for discovery only.
