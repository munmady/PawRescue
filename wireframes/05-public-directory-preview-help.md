# Wireframes 05 · Public directory, shared-link web preview, Help & Safety (low fidelity)

**Scope:** the three public, no-sign-in surfaces. Screen IDs map to [docs/04](../docs/04-screens.md#a-public--browse-no-sign-in) (PUBLIC-05, PUBLIC-09, PUBLIC-10 / PROFILE-06).

**Source of truth:** D54, D69, D89, D93, D102, D108, D112, D113, D128, D129, D130; safety content in docs/07. These wireframes add no features. Layout only.

**Rules**

- No sign-in needed for any screen here.
- The directory is **information only**: never the emergency workflow and never the transport destination picker. No flag/report action on directory entries (D113).
- The web preview shows the **case**, never the **case chat** (D108): no messages, no contact details shared in chat, no reporter or responder identity, no private coordination details. Not search-indexed; the link never expires while the case exists (D93).
- Safety and first-aid copy is illustrative and must be validated by a veterinarian before real use (A9).

---

## DIR1 · Veterinary & Animal Organisations · PUBLIC-09

```
┌──────────────────────────────────┐
│ ← Home                           │
│ Veterinary hospitals & animal    │
│ organisations near you           │
│ ┌──────────────────────────────┐ │
│ │ Lumen Animal Rescue & Vet    │ │
│ │ Care · Veterinary hospital   │ │
│ │ Verified · 2.1 km            │ │
│ │ Open 24 hours              › │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Lumen Animal Rescue & Shelter│ │
│ │ Shelter home · Verified      │ │
│ │ 3.0 km · 9 am – 7 pm       › │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Saathi Vet Hospital (demo)   │ │
│ │ Veterinary hospital · 3.4 km │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**DIR2 · Entry (expanded)**

```
┌──────────────────────────────────┐
│ ← Directory                      │
│ Lumen Animal Rescue & Vet Care   │
│ Veterinary hospital · Verified   │
│ 📍 Linking Road, Bandra West      │
│    2.1 km   ‹ Open in Maps ›     │
│ Services: emergency care,        │
│  surgery, vaccination            │
│ Hours: open 24 hours             │
│                                  │
│  ( Call )                        │  ← demo: calling disabled
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Find registered veterinary hospitals, rescue organisations and shelter homes near you (D102). |
| **Entry points** | Home section 5 "Find veterinary hospitals & animal organisations" (D128) · no sign-in · not linked from Profile (D138) |
| **Content rules** | Name, organisation type, verified status, location, distance, address, contact, services, availability. Verified organisations only. No report/flag action (D113). Not linked to the transport flow. |
| **States** | *Empty:* "No organisations listed near you yet." (D130). *Location off:* list without distances; set a location on the map. *Loading:* skeleton. |
| **Class** | REAL PROTOTYPE (fictional entries) |

---

## WEB1 · Shared-link web case preview · PUBLIC-05

**Active case**

```
┌──────────────────────────────────┐
│ Street Animal Rescue (preview)   │
│ [EVIDENCE 1/3 · swipe]  ▶ 0:21   │
│ LOOKING FOR HELP                 │
│ Injured dog · Hit by vehicle     │
│ ┌──────────────────────────────┐ │
│ │░░░░░░░░░░ 📍 ░░░░░░░░░░░░░░░░│  │  ← exact animal pin (D112)
│ └──────────────────────────────┘ │
│ Near Hill Road, Bandra West      │
│ Reported 12 min ago              │
│                                  │
│ This animal needs help.          │
│ Updates and coordination happen  │  ← no chat content (D108)
│ in the app.                      │
│                                  │
│  [        Open in App        ]   │
└──────────────────────────────────┘
```

**Closed case** (status area only changes)

```
┌──────────────────────────────────┐
│ Street Animal Rescue (preview)   │
│ [EVIDENCE 1/3]                   │
│ RESCUED                          │
│ This animal was helped. Thank    │
│ you for caring.                  │
│  [        Open in App        ]   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Let someone without the app understand what happened, where the animal is and whether help is still needed. |
| **Primary CTA** | Open in App → Case Detail (W9) in the app; store link if the app isn't installed |
| **Content rules** | **May show (D108):** evidence (photos/videos, voice note), animal type, reason, exact location pin (D112), current official status or final outcome, help information, Open in App. **Never:** case chat, contact details shared in chat, reporter identity/phone, participant info, responder identity/contact, private coordination details. Responder transport shows only "This animal is being taken to a veterinary hospital" (and the hospital, if shown in the app). Sensitive media blurred until tapped. |
| **States** | *Closed:* outcome wording from docs/06 (Rescued, Could not locate, Closed — Passed away, Cancelled). *Case removed/not found:* "This case isn't available. It may have been removed." + [ Open the app ] (D136). *Loading:* skeleton. |
| **Technical** | Public `noindex` route on the dashboard app; no sign-in; no expiry while the case exists. |
| **Class** | REAL PROTOTYPE |

---

## HS1 · Help & Safety · PUBLIC-10 / PROFILE-06

```
┌──────────────────────────────────┐
│ ← Back            Help & Safety  │
│ Staying safe                     │
│ • Keep a safe distance; don't    │
│   stand in traffic.              │
│ • Don't move an animal hit by a  │
│   vehicle unless it's in         │
│   immediate danger.              │
│ • Don't give food or water to a  │
│   badly injured animal.          │
│ Bitten or scratched?             │
│ • Wash with soap and running     │
│   water for 15 minutes and see   │
│   a doctor the same day.         │
│ Children                         │
│ • Ask an adult. Never approach   │
│   an injured animal.             │
│ Illustrative guidance, to be     │  ← A9: needs vet validation
│ reviewed by a veterinarian.      │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Public safety guidance (D129). |
| **Entry points** | Home (near the directory link) · Safety check (R2) · Profile |
| **Content rules** | Content from docs/07 "Safety content". No medical diagnosis or guarantees. Admin edits it (ADMIN-07). |
| **Class** | REAL PROTOTYPE · copy illustrative until validated |

---

## Prototype classification summary

| Screen | Class |
|---|---|
| DIR1/DIR2, WEB1, HS1 | REAL PROTOTYPE (fictional organisations; illustrative safety copy) |
| Calls | SIMULATED DEMO (disabled) |
