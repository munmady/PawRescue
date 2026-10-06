# Street Animal Rescue App (working title)

> **An India-first Animal Emergency Response Network.** Help a street animal in distress move from **Report → Respond → Treat → Outcome**.

A mobile app for street cats and dogs in distress (road accidents, visible injuries, serious illness, immediate danger), designed around a realistic **Mumbai pilot**. It connects the citizen who finds the animal, nearby community responders, and registered/verified veterinary hospitals, rescue organisations and shelter homes. Organisations use a separate dashboard; a lightweight admin console runs operations.

**Status:** Portfolio project and Mumbai pilot concept. No real partnerships exist. All organisations, people and cases in the demo are fictional (primary demo organisation: **Lumen Animal Rescue & Shelter**). Nothing described here is claimed as implemented until it is built.

Every feature is classified as **REAL PROTOTYPE** (works within the portfolio prototype; not production-ready), **SIMULATED DEMO** (seeded data or simulated actions, e.g. notifications, organisation alerts, ETA, payments, delivery) or **FUTURE ARCHITECTURE** (documented, not built). See [docs/01-product.md](docs/01-product.md#prototype-classification).

---

## Purpose

1. Report an animal in distress.
2. Connect the case with professional responders and community responders.
3. Rescue / transport the animal.
4. Coordinate veterinary care.
5. Record the outcome.

**Secondary:** pet adoption listings and product-based animal food donations.

**Not:** a general social network, a pet-management or pet health app, a vaccination/reminder system for owned pets, or a generic crowdfunding/cash-donation platform.

## What it does (MVP)

- **Browse without an account; set up an account once (name → email → mobile → one-time code sent to the email)** to report, help as a responder (from Take me to the animal), post in case chat, list for adoption, donate food, or open Profile. Reading case chat and browsing the organisations directory need no sign-in. No passwords, no Google-only sign-in, no SMS OTP, no email magic links; email OTP delivery is simulated in the prototype.
- **Home: nearby animals in distress.** Map and List views of the same active cases within ~5 km, with exact locations and full case evidence. Then "Report an animal in distress", then adoption and food donation discovery, then a link to the public organisations directory and Help & Safety.
- **Report in under a minute.** 1–4 photos/videos → what's wrong + optional text/voice → location → mobile number (from your account, read-only; coordination only) → send.
- **Professional response.** Looking for help → Accepted by organisation → Help reaching in ~N min → Rescue team reached → Reaching hospital → Hospital reached → Under treatment → Rescued / Could not locate / Passed away / Cancelled.
- **Community responders.** Every user can help: Take me to the animal → safety check → navigate to the animal. Movement is private and never changes the status. Only from Looking for help, after safely committing to transport to a registered/verified veterinary hospital they've informed, does the case become "Responder taking animal to hospital".
- **Case chat** per case: anyone can read it; any signed-in user can post (no case involvement needed), with official organisation messages pinned at the top and a multilingual abuse filter. Chat never changes status.
- **Public Veterinary & Animal Organisations directory** (verified hospitals, rescue organisations, shelters; information only).
- **Flag message** on case chat messages (signed in) for admin review.
- **Live sharing** through the device share sheet, with a privacy-safe web preview for people without the app (case information only; never the case chat).
- **Blue Tick — Responsible Reporter**, granted and revoked only by the platform. No Stars, points or rankings.
- **Adoption** listings (Available / Adopted) with chat to the poster.
- **Food donations:** verified veterinary hospitals, rescue organisations and shelter homes request specific food products; users choose a product and donate it, delivered to the organisation's registered address.
- **Organisation dashboard** for verified organisations only (onboarded by the platform; no in-app application), for receiving, accepting and updating cases, confirmations, official chat updates and food donation requests.
- **Demo mode** (SIMULATED DEMO): seeded Mumbai data, simulated notifications, payments and delivery, disabled calling.

Navigation: **Home | Adoption | (Report) | Donation | Profile** (D139, D140; the centre circle opens the report flow). Profile holds Blue Tick, Your Impact, My Reports, My Adoption Listings, My Food Donations, Notification settings, Help & Safety, Privacy, Terms and Logout.

## Screenshots

_To be added after the build._

## Running the demo

The citizen app prototype lives in [apps/mobile](apps/mobile/README.md) (Expo). From that folder: `npm install`, then `npm run web` (or `npm run android` / `npm run ios`). It runs entirely on fictional demo data.

## Documentation

| Doc | Contents |
|---|---|
| [01 Product](docs/01-product.md) | Positioning, scope, users, roles and permissions, principles, label legend, prototype classification |
| [02 Scope](docs/02-scope.md) | Feature matrix, out-of-scope list, decision log, open and deferred decisions, path to a real pilot |
| [03 Flows & lifecycle](docs/03-flows-lifecycle.md) | Sign-in, Home, report flow, case lifecycle, responder flow, chat, sharing, notifications, My Reports, adoption, food donations, Blue Tick, journeys |
| [04 Screens](docs/04-screens.md) | Navigation and screen inventory for the app, web case preview, dashboard, admin and demo mode |
| [05 Data & architecture](docs/05-data-architecture.md) | Entities, queries, stack and reasoning, repo layout, seed data |
| [06 Design & voice](docs/06-design-voice.md) | Visual direction, accessibility, tone and copy |
| [07 Privacy & safety](docs/07-privacy-safety.md) | Who sees what, safety content, assumptions and risks |
| [08 Visual direction](docs/08-visual-direction.md) | Three visual directions explored on the Home screens (exploration; none chosen yet) |
| [Wireframes 01 · Home](wireframes/01-home.md) | Low-fidelity Home (Map/List, case sheet, states) |
| [Wireframes 01](wireframes/01-citizen-reporting.md) | Low-fidelity citizen wireframes (Home, sign-up, report flow, Case Detail, chat, Profile) |
| [Wireframes 02](wireframes/02-community-responder.md) | Low-fidelity community responder flow |
| [Wireframes 03](wireframes/03-organisation-dashboard.md) | Low-fidelity organisation / hospital dashboard |
| [Wireframes 04](wireframes/04-adoption-food.md) | Low-fidelity adoption and food donation flows |
| [Wireframes 05](wireframes/05-public-directory-preview-help.md) | Low-fidelity public directory, shared-link web preview, Help & Safety |
| [CLAUDE.md](CLAUDE.md) | Build conventions for Claude Code |
