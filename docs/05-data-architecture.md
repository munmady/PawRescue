# 05 · Data & Architecture

## Data model (MVP)

Conceptual entities and key fields; the schema is written during build.

### User

| Field | Notes |
|---|---|
| id | |
| email, email_verified_at | Any valid email address (D137). Verified once by the one-time email OTP at account setup. Private. No passwords or magic links. |
| name, first_name | Name required at account setup (D137); not a full/legal name. The first name is shown in case chat. |
| mobile | Required at account setup as contact information (D137). **Not verified and not used for authentication.** Used for distress reports and the transport mobile step (confirm). **Immutable** after setup (D117). Never public profile data. |
| blue_tick_status | `NOT_VERIFIED` (default) · `VERIFIED` |
| blue_tick_verified_by, blue_tick_verified_at | Admin who granted it, when |
| blue_tick_revoked_by, blue_tick_revoked_at | Admin who revoked it, when (sets `NOT_VERIFIED`) |
| is_platform_admin, blocked_at, created_at | |

Every user can act as a community responder; there is no responder flag. No points, scores or reputation fields.

### Organisation

| Field | Notes |
|---|---|
| id, name, slug | |
| type | `ngo` (rescue organisation) · `independent_rescuer` · `clinic` (veterinary hospital) · `shelter` (shelter home) |
| verification_status | `directory_only` · `verified` · `suspended` (`pending` removed by D105; verification happens before onboarding) |
| registered_address | Used for food donation delivery |
| base_location, service_radius_km, species, services, hours | Routing and directory information |
| accepts_transported_animals | Veterinary hospitals (`clinic`) selectable as community transport destinations |
| public_phone, alert_emails, logo, about | Directory/profile and (simulated) alerts |
| is_demo | e.g. **Lumen Animal Rescue & Shelter** (type `shelter`, D119) |

Only `verified` organisations: access the dashboard, receive cases, see reporter mobile numbers, post official chat updates, confirm outcomes, create food donation requests and organisation adoption listings, and appear in the public directory (D102, D105). Passed away confirmations: verified `clinic` and `ngo` only (D100). Only verified `clinic` (veterinary hospital) organisations with `accepts_transported_animals` are selectable as community transport destinations; rescue organisations and shelters never are. Food donation requests: verified `clinic`, `ngo` and `shelter` (D120).

### OrgMember

`user_id`, `org_id`, `role` (`admin` · `staff`). Members use the same one-time email OTP account verification (D137). Organisations are onboarded by the platform/admin after verified registration; there is no in-app application (D105). Onboarding uses a backend admin form that creates the organisation and its first members (D118); Org admins then add and remove staff in Team / Settings (D133).

### Case

| Field | Notes |
|---|---|
| id, public_ref | `AR-` temporary prefix |
| type | `rescue` (MVP) · `sterilisation` (V1.5, not MVP) |
| species, problems, urgency | |
| location, location_accuracy_m, area_label, landmark | Exact location visible to helpers |
| description_text | Optional "Tell us what you saw" text |
| origin_location | Locked at pickup |
| reporter_id | Private |
| reporter_phone | Required; snapshot from the report; visible only to the handling verified organisation/hospital and admins |
| status | `NEW` · `ACCEPTED` · `ON_THE_WAY` · `ON_SITE` · `TO_HOSPITAL` · `RESPONDER_TO_HOSPITAL` · `AT_HOSPITAL` · `IN_CARE` · `CLOSED` · `CANCELLED` |
| eta_minutes_approx | Required for `ON_THE_WAY` |
| outcome, outcome_confirmed_by, outcome_confirmed_at | Successful outcomes display as Rescued; `not_found` = Could not locate; `deceased` = Closed — Passed away |
| cancel_reason | incl. `cancelled_by_reporter` |
| org_id, assignee_id, active_transport_id, destination_org_id | |
| can_stay, can_transport | Optional reporter help ("Not able to" stored as `no` / `false`) |
| flags | `needs_attention`, `reporter_transporting`, `no_media`, `death_reported_pending` |
| created_at, accepted_at, at_hospital_at, closed_at | `closed_at` drives the 2-hour Could not locate window |
| is_demo | |

### CaseEvent (append-only)

`kind`: `status_change` · `update` · `note` · `release` · `reassignment` · `location_correction` · `professional_response` · `transport` · `death_report` · `death_confirmation` · `confirmation`. History is never silently overwritten.

### Media (report evidence)

`kind`: `photo` · `video` · `voice_note`. **1–4** photo/video items per report (any mix) unless `no_media`; at most one voice note. No media added after submission. Private bucket; visible to helpers in the app and in privacy-safe share links; never publicly discoverable or tied to a reporter profile. Video/voice/text limits defined during technical implementation.

### Response and transport

| Entity | Purpose |
|---|---|
| **CaseAlert** | Organisations alerted (simulated) and their responses |
| **ProfessionalResponse** | Organisation's involvement: `accepted` · `responding` · `on_site` · `released` · `completed`, approximate ETA |
| **CommunityResponse** | A responder's private record: tapped Take me to the animal, safety acknowledged, reached, current-status check result, can transport, `responder_mobile` (entered/confirmed before transport; N24), ended/withdrawn (before transport only, e.g. "Not able to"; withdrawal during transport is N10 — Deferred to Next Phase). Never changes case status by itself. Used to show the Community Responder label in case chat. |
| **HospitalSelection** | Selected registered/verified **veterinary hospital** (`clinic`, `accepts_transported_animals`), distance, approximate ETA, `hospital_informed_at` |
| **Transport** | Transporter type (`community_responder` · `professional`), responder or professional reference, destination, state (`started` · `arrived` · `handed_over` = handed to the receiving hospital on arrival; not a responder-to-responder or responder-to-team handover, which is N10), started/arrived at, `arrival_confirmed_by`. The responder's arrival tap sets Transport `arrived` only; `Case.status` moves to `AT_HOSPITAL` only when the destination veterinary hospital confirms (`arrival_confirmed_by`), which writes the CaseEvent (D110). **A community Transport is created only when `Case.status = NEW`, all six conditions are met, `responder_mobile` is set, and the destination is a verified veterinary hospital** → `RESPONDER_TO_HOSPITAL`. One active transport per case. Creating it: adds the case to the responder's My Reports, subscribes them to notifications, and reveals responder name, email, mobile and role to the destination veterinary hospital only (no live location; no other organisation). Responder unable to continue, transfer, replacement, cancellation and related transitions: **N10 — Deferred to Next Phase** (D109); no MVP fields, rules or automatic transitions. |

### Case chat

| Entity | Purpose |
|---|---|
| **CaseChatThread** | One per case |
| **CaseChatParticipant** | Any signed-in user who posts in the thread (D101: anyone can view; any signed-in user can post; no case-involvement rule; no anonymous posting). Stores the applicable role label: `reporter` · `community_responder` · `organisation` · none. Participation never changes status, My Reports or responder state. |
| **CaseChatMessage** | Author, `is_official` (handling verified organisation only; pinned at top), text and optional attachments (photos, videos, location details), created_at, moderation fields. Displays first name, role, Blue Tick (if `VERIFIED`) and organisation name. Never auto-includes phone, email, address or live location; users may type their number voluntarily. A failed send keeps the message for **Retry** (D106). |
| **ChatFilterDecision** | Proactive pre-send filter result (allowed/blocked, language), for English, Hindi, Marathi, Hinglish and Marathi-English. Blocked messages show the respectful-conversation copy and are not posted. |

Chat never changes case status.

### Sharing

**CaseShareLink:** case_id, token, created_by, created_at. Opens Case Detail in the app or the privacy-safe web preview. **No expiry while the case exists. Not search-indexed (`noindex`).** Reads current status (active) or outcome (closed). Exposes only case evidence and case information, including the exact animal location pin as in the app (D112); never reporter identity/contact, case-chat messages (or contact details shared in them), participants, responder identity/contact or private coordination details (D108). No sign-in required to open. Sharing creates no chat participation or My Reports entry.

### Adoption

| Entity | Purpose |
|---|---|
| **AdoptionListing** | Required (D135): photos (1+), animal type, approximate age, gender (`male` · `female` · `unknown`), location, description, vaccination status. Poster (user or verified organisation), photos, animal type (Dog/Cat/Other), name (optional), approximate age, gender, location, short description, temperament/behaviour, special needs, vaccination status (`vaccinated` · `partially_vaccinated` · `not_vaccinated` · `unknown`), vaccination details (optional), adoption requirements, poster information, **status** (`available` · `adopted`), `removed_at` (poster removed the listing, D126; hidden from discovery). Never in the distress map/list. No poster phone stored or shown on the listing. |
| **AdoptionChat** | Interested user ↔ poster; listed per listing in My Adoption Listings (D103) |

### Food donations

| Entity | Purpose |
|---|---|
| **FoodDonationRequest** | Organisation (verified veterinary hospital, rescue organisation or shelter home, D120), title/need text (e.g. "Help feed 35 rescued cats and dogs"), status (`open` · `fulfilled`), created_at |
| **FoodDonationProduct** | Request, product name, size, price (display), e.g. "Whiskas Dry Cat Food — 3 kg" |
| **FoodDonation** | Donor (signed-in user), product, quantity, amount, payment reference and payment status `paid` · `failed` (**SIMULATED DEMO**), delivery to the organisation's `registered_address` and delivery status `order_placed` · `out_for_delivery` · `delivered` (**SIMULATED DEMO**) (D124), placed_at. Fulfilment status comes from the request. Shown in My Food Donations (D104). |

No generic cash donation or free-amount transfer entities. Users cannot create requests.

### Your Impact (derived, factual)

Counts per user: distress cases reported · animals transported to care (community Transports started by the user) · adoption listings created · food donations contributed/arranged. No resolved-case counts, points, scores, rankings or comparisons. Not used for Blue Tick eligibility.

### Other

**NotificationLog** (REAL PROTOTYPE table of simulated notifications) · **DeviceToken** (FUTURE) · **Flag** · **Content**.

**Flag (flagged case chat message, D107/D113):** flagged_by (signed-in user), `case_chat_message_id`, reason (`abusive_or_unprofessional_language` · `false_or_misleading_information`), optional details, review status, created_at. Only case chat messages can be flagged. Flagging never removes or alters the message; platform/admin reviews it.

### Key queries

- **Home feed (Map and List share one query):** within ~5 km and `status IN (NEW, ACCEPTED, ON_THE_WAY, ON_SITE, TO_HOSPITAL, RESPONDER_TO_HOSPITAL)`, or `status = CLOSED AND outcome = not_found AND now() < closed_at + 2 hours`, or `death_reported_pending` on an open status. Excludes `AT_HOSPITAL`, `IN_CARE`, other closed outcomes, `CANCELLED`, adoption listings and food requests. No automatic reopening.
- **My Reports:** cases where `reporter_id = user` **or** the user created a community `Transport` on the case.
- **Notification recipients:** the reporter and any user who started a community Transport on the case (plus organisation channels).
- **Case chat:** readable by anyone in the app without sign-in; posting requires a signed-in user (D101, D137).
- **My Adoption Listings:** listings where the poster is the user, with their chats.
- **My Food Donations:** FoodDonations where the donor is the user.
- **Directory (public, no sign-in):** `verified` organisations of type `clinic`, `ngo`, `shelter`, by distance.
- **Selectable transport destinations:** `verified` organisations of type `clinic` (veterinary hospitals) with `accepts_transported_animals`. Never `ngo` or `shelter`.
- **Duplicate check:** open cases, same species, ~150 m, last 12 h.

---

## Architecture

### Stages

| Stage | Build class | Shape |
|---|---|---|
| **Prototype** | REAL PROTOTYPE + SIMULATED DEMO | Expo app + Next.js dashboard/admin/web preview + Supabase (email OTP auth, database, storage, realtime, functions, cron). Simulated: notifications, organisation alerts, ETAs, food donation payment and delivery, calls disabled, demo mode, seeded Mumbai data. |
| **Pilot** | FUTURE ARCHITECTURE | Real push/email, real payments and delivery partner, maps at scale, Play Store, monitoring, backups, DPDP review, organisation verification operations, moderation operations. |
| **Production** | FUTURE ARCHITECTURE | Scale, CDN, data export/delete, professional handover workflows, observability. |

### Principles

- One Postgres database with PostGIS; access enforced by RLS.
- Status rules, the six transport conditions and the Home visibility rule defined in `packages/shared` and enforced in the database.
- `blue_tick_status` changed only by platform/admin actions.
- Server functions: submit + duplicate check + alerts; status changes + simulated notifications; transport start (reveal to destination, My Reports, notifications); chat pre-send filter; share-link resolution; food donation placement (simulated payment/delivery); timeouts; demo simulator.

### Stack

All **REC**; check current docs before setup.

| Layer | Choice |
|---|---|
| Mobile | React Native + Expo (TypeScript, Expo Router) |
| Dashboard, admin, web preview | Next.js + Tailwind + shadcn/ui (PWA); web preview is a public `noindex` route |
| Backend / DB | Supabase (Postgres + PostGIS, Auth, Storage, Realtime, Edge Functions, pg_cron) |
| Auth | **One-time email OTP account verification** (citizens and organisation members, D137): name, email, mobile, then a code sent to the email; no password, no SMS OTP. Email delivery simulated in the prototype. Check current Supabase Auth docs during build |
| Maps | Google Maps + Places; navigation by maps-app hand-off |
| Chat | Supabase Realtime; pre-send multilingual abuse filter (implementation approach decided during build) |
| Sharing | OS share sheet + deep links with web fallback (not a WhatsApp integration) |
| Notifications | Simulated via `NotificationLog` (prototype); real push/email future |
| Payments | **Simulated** in the prototype for food donations; real payment provider is pilot scope |
| Analytics | PostHog + Sentry; never used to drive engagement prompts |

### Repository layout

```
apps/mobile · apps/dashboard · packages/shared · supabase/{migrations,functions,seed} · docs · wireframes
```

### Notifications (SIMULATED DEMO in the prototype)

| Event | Recipients |
|---|---|
| Case submitted / released | Matching verified organisations (dashboard inbox, web push, email) |
| `needs_attention` | Admins |
| Status updates, important case changes, professional help becoming active | Reporter; transporting community responder |
| New case-chat message | Reporter; transporting community responder |
| Community transport started | Destination veterinary hospital (with responder details); reporter |
| Passed away reported | Handling veterinary hospital/rescue organisation; if none is available the case stays pending (D100) |
| Food donation placed | Requesting organisation |

No "nearby animal distress" notifications. Never movement notifications or reward prompts.

### Seed data (SIMULATED DEMO)

Mumbai; fictional organisations including **Lumen Animal Rescue & Shelter** (registered shelter home, onboarded via the admin form; posts the demo food request, D119) and **Lumen Animal Rescue & Vet Care** (registered hospital); fictional shelters; no real phone numbers or emails; cases at every status with chats; adoption listings (Available/Adopted); food donation requests with illustrative products; a Blue Tick user and a non-verified user; org staff, hospital staff and admin accounts.
