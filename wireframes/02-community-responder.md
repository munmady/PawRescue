# Wireframes 02 · Community responder (low fidelity)

**Scope:** Case Detail → **Take me to the animal** → safety check → stage 1 navigation → at the animal (status check) → transport decision → mobile confirmation → veterinary hospital selection → inform hospital & start transport → stage 2 navigation → arrival → treatment/outcome visibility. Screen IDs map to [docs/04](../docs/04-screens.md#d-community-responder-no-registration-sign-in-at-take-me-to-the-animal-d111) (RESP-01 … RESP-09).

**Source of truth:** `docs/01`–`07` (D39, D53–D58, D86/N11, D87/N12, D98/N24, D99, D110, D111, D117, D127, D137, D109/N10). These wireframes add no features. Layout only: no colour, type, icons or visual style. Legend, global rules and the sign-up screens (WA1–WA3, WA5) are in [wireframes/01](01-citizen-reporting.md).

**Rules that apply to every screen here**

- **No registration, no Responder tab, no opt-in.** Any signed-in user can respond; sign-in happens at the **Take me to the animal** tap (D111) via the one-time email OTP account setup, WA1–WA3 (D137).
- **Movement is private.** The system never shows "Rahul is going to the animal", responder counts or live location to anyone (D55). Navigation is a hand-off to the phone's maps app; no live tracking.
- **Status belongs to the animal.** Nothing here changes `case.status` except **Start transport** (only from Looking for help, all conditions met) → 🔵 Responder taking animal to hospital. "Hospital reached" is set only when the hospital confirms (D110).
- **Never override professional help.** If professional help is active, transport actions are unavailable (N11).
- **"Not able to" always has equal weight.** Never pressure physical intervention.
- **N10 — Deferred to Next Phase:** no "I can't continue", "Request help", handover, replacement or cancellation controls during the journey. Not designed.
- Calls show *"Demo — calling is disabled in this prototype."*

---

## R1 · Take me to the animal (from Case Detail W9) · RESP-01

The entry is the primary action on W9 (wireframes/01) for 🔴 Looking for help, and stays available (navigation only) while 🟠/🟡 professional help is active (N11). Not shown for Rescue team reached, Reaching hospital, Responder taking animal to hospital, or closed cases.

| | |
|---|---|
| **Primary CTA** | **Take me to the animal** → signed out: WA1–WA3, WA5 (wireframes/01) → R2 · signed in: R2 |
| **Effect** | Creates the user's private responder record (no status change). Their case chat messages now show the Community Responder label (anyone signed in can already post, D101). |
| **Class** | REAL PROTOTYPE |

---

## R2 · Safety check (sheet) · RESP-02 · STATE-W01

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Before you go                  ││
││                                ││
││ Please only approach if it is  ││
││ safe for you and the animal.   ││
││ Injured or frightened animals  ││
││ may behave unpredictably. If   ││
││ the situation is unsafe, wait  ││
││ for a trained rescuer.         ││
││                                ││
││ [     I can safely help      ] ││
││ ( Not now )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Lightweight safety acknowledgement before approaching (D44). Not a tutorial. |
| **Primary CTA** | I can safely help → R3 |
| **Secondary** | Not now → back to W9 (nothing recorded beyond the private responder record) |
| **Content rules** | Locked safety copy. Link to the public Help & Safety guide (D129) may sit below the buttons. |
| **Feeling** | "They care about my safety too." |
| **Class** | REAL PROTOTYPE |

---

## R3 · Stage 1 navigation (to the animal) · RESP-03

```
┌──────────────────────────────────┐
│ ← Case                           │
│ Going to the animal              │
│ ┌──────────────────────────────┐ │
│ │ ▢ photo · Injured dog        │ │
│ │ Hit by vehicle               │ │
│ │ Near Hill Road, Bandra West  │ │
│ │ about 850 m away             │ │
│ └──────────────────────────────┘ │
│  [      Open in Maps        ]    │  ← maps-app hand-off
│                                  │
│ Status: Looking for help         │
│ ‹ Case chat ›                    │
│                                  │
│  [  I've reached the animal  ]   │  ← secondary weight until near
└──────────────────────────────────┘
```

**N11 banner (STATE-W03)**, shown at the top of R3 if professional help becomes active while travelling:

```
┌──────────────────────────────────┐
│ Professional help is on the way. │
│ You can continue to the animal   │
│ and share what you see.          │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Get the responder to the **exact animal location** (D54) without tracking them. |
| **Primary CTA** | Open in Maps (hand-off) · I've reached the animal → R4 |
| **Secondary** | Case chat (CHAT-02) · Back to Case |
| **Content rules** | Exact location, evidence thumbnail, current status. No live tracking, no ETA for the responder shown to anyone, no other responders listed. |
| **States** | *Professional help became active:* N11 banner; navigation continues. *Case closed/cancelled meanwhile:* status line updates; R4 will show it. *Location off:* map and address still shown. |
| **Class** | REAL PROTOTYPE · navigation via maps-app hand-off |

---

## R4 · At the animal: status check · RESP-04

**R4a · Still Looking for help**

```
┌──────────────────────────────────┐
│ ← Case                           │
│ You've reached the animal        │
│                                  │
│ Current status                   │
│ LOOKING FOR HELP                 │
│ No rescue team has accepted yet. │
│                                  │
│ Keep a safe distance while you   │
│ check the animal.                │
│                                  │
│  [          Continue         ]   │
│ ‹ Case chat ›                    │
└──────────────────────────────────┘
```

**R4b · Professional help already active (STATE-W04)**

```
┌──────────────────────────────────┐
│ ← Case                           │
│ You've reached the animal        │
│                                  │
│ Professional help is already on  │
│ the way. Accepted by Lumen       │
│ Animal Rescue & Shelter ·        │
│ approximately 5 min away.        │
│                                  │
│ You can share what you see in    │
│ the case chat.                   │
│                                  │
│  [        Case chat         ]    │
│ ( Back to case )                 │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Always re-check the **current** status before any further action (D57, N11). |
| **Primary CTA** | R4a: Continue → R5 · R4b: Case chat |
| **Content rules** | R4b shows no transport or override action. Copy from docs/06 ("Professional help is already on the way…"). |
| **States** | *Responder taking animal to hospital (someone else):* view only, as W9. *Closed / cancelled:* outcome message, Back to case. |
| **Class** | REAL PROTOTYPE |

---

## R5 · Transport decision · RESP-05a

```
┌──────────────────────────────────┐
│ ← Back                           │
│ Can you safely take this animal  │
│ to a veterinary hospital?        │
│                                  │
│ Only if you're able and it's     │
│ safe for you and the animal.     │
│                                  │
│ ( Yes, I can )  ( Not able to )  │
└──────────────────────────────────┘
```

**Not able to (STATE-C08):**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ That's okay. The case stays    ││
││ open for rescue teams.         ││
││                                ││
││ [       Back to case        ]  ││
││ ‹ Case chat ›                  ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Explicit, unpressured decision. Equal weight for both answers. |
| **Primary CTA** | Yes, I can → R6 · Not able to → STATE-C08 → W9 (status unchanged) |
| **Class** | REAL PROTOTYPE |

---

## R6 · Mobile number (N24) · RESP-05

```
┌──────────────────────────────────┐
│ ← Back                           │
│ Your mobile number               │
│ ┌────┬─────────────────────────┐ │
│ │ +91│ 98XXX XXXXX             │ │  ← account mobile; read-only (D117)
│ └────┴─────────────────────────┘ │
│ Your mobile number is required   │
│ so the veterinary hospital can   │
│ contact you during transport.    │
│                                  │
│ Only the hospital you choose     │
│ will see it, once you start      │
│ transport.                       │
│                                  │
│  [   Confirm and continue    ]   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Confirm the contact the hospital will use (N24, D98, D117). |
| **Primary CTA** | Confirm and continue → R7 |
| **Content rules** | Locked copy. Read-only account mobile (given at setup, not verified); no edit, no OTP. Never shown to other responders or publicly (N12). |
| **Class** | REAL PROTOTYPE |

---

## R7 · Select a veterinary hospital · RESP-06

```
┌──────────────────────────────────┐
│ ← Back                           │
│ Choose a veterinary hospital     │
│ Registered hospitals near you    │
│ ┌──────────────────────────────┐ │
│ │ Lumen Animal Rescue & Vet    │ │
│ │ Care · 2.1 km · ~10 min      │ │
│ │                  ( Select )  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Saathi Vet Hospital (demo)   │ │
│ │ 3.4 km · ~15 min             │ │
│ │                  ( Select )  │ │
│ └──────────────────────────────┘ │
│ ‹ Show more ›                    │  ← fictional demo entries
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Pick the destination: **registered/verified veterinary hospitals only** (D99). |
| **Primary CTA** | Select → R8 |
| **Content rules** | Name, distance, approximate ETA. **Rescue organisations and shelters are never listed here.** This is not the public directory. Hospital names are fictional in the demo. |
| **States** | *None nearby:* **Deferred to Next Phase** (D132); not designed. *Loading:* skeleton. |
| **Class** | REAL PROTOTYPE (SIMULATED DEMO entries) |

---

## R8 · Inform the hospital & start transport · RESP-07

```
┌──────────────────────────────────┐
│ ← Back                           │
│ You're taking this animal to:    │
│ Lumen Animal Rescue & Vet Care   │
│ 2.1 km · ~10 min                 │
│                                  │
│ ▢ Injured dog · Hit by vehicle   │
│                                  │
│  ( Call hospital )               │  ← demo: calling disabled toast
│                                  │
│ [ ] I have informed the hospital │  ← required
│                                  │
│  [      Start transport      ]   │  ← enabled after the tick
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Phone coordination, then the only responder action that changes status. |
| **Primary CTA** | **Start transport** → case becomes 🔵 Responder taking animal to hospital → R9. The hospital now sees the responder's name, email, mobile and role (N12); the case enters the responder's My Reports; notifications start. |
| **Content rules** | Allowed only if the case is still Looking for help when tapped. If professional help became active meanwhile, show R4b instead (no override). |
| **Class** | REAL PROTOTYPE · calls SIMULATED DEMO (disabled) |

---

## R9 · Stage 2 navigation (to the hospital) · RESP-08

```
┌──────────────────────────────────┐
│ ← Case                           │
│ RESPONDER TAKING ANIMAL TO       │
│ HOSPITAL                         │
│ To: Lumen Animal Rescue & Vet    │
│ Care · 2.1 km                    │
│                                  │
│  [       Open in Maps       ]    │  ← maps-app hand-off
│                                  │
│ ‹ Case chat ›                    │
│                                  │
│  [        I've arrived       ]   │  ← records arrival only (D110)
└──────────────────────────────────┘
```

**After I've arrived (waiting for the hospital):**

```
┌──────────────────────────────────┐
│ Waiting for the hospital to      │  ← draft copy
│ confirm the animal arrived.      │
│                                  │
│ Status: Responder taking animal  │
│ to hospital                      │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Get responder and animal to the selected hospital; arrival is confirmed by the hospital, not the responder. |
| **Primary CTA** | Open in Maps · I've arrived (Transport `arrived`; case status unchanged) |
| **Content rules** | No "I can't continue", "Request help", handover or cancel controls (**N10 — Deferred to Next Phase**). Hospital never confirming: also N10 (D127). Others see the case as view only (STATE-L04). |
| **Class** | REAL PROTOTYPE |

---

## R10 · After the hospital confirms · RESP-09

No new screen. The hospital's **Confirm arrival** (ORG-05) sets Hospital reached (D110); Case Detail (W9) then shows Hospital reached → Under treatment → outcome, with the transporter notified (simulated) and the case in **My Reports** (P2). Your Impact counts "animals transported to care".


---

## Flow

```
W9 Case Detail ──Take me to the animal──► (WA1–WA3, WA5 if signed out) ──► R2 Safety check
                                                                      │ I can safely help
                                                                      ▼
                                               R3 Stage 1 navigation (N11 banner if pro help becomes active)
                                                                      │ I've reached the animal
                                                                      ▼
                                               R4 Status check ──professional active──► R4b (chat only)
                                                                      │ still Looking for help
                                                                      ▼
                                               R5 Can you safely take it? ──Not able to──► C08 → W9
                                                                      │ Yes
                                                                      ▼
                                               R6 Confirm account mobile (read-only)
                                                                      ▼
                                               R7 Select veterinary hospital (hospitals only)
                                                                      ▼
                                               R8 Call / "I have informed" → Start transport
                                                                      │  status → RESPONDER_TO_HOSPITAL
                                                                      ▼
                                               R9 Stage 2 navigation → I've arrived (no status change)
                                                                      │ hospital confirms (ORG-05)
                                                                      ▼
                                               W9 Hospital reached → Under treatment → outcome · My Reports
```

Not designed (**N10 — Deferred to Next Phase**): can't continue after reaching or during transport, request help, handover, replacement, cancellation during transport, reopening, hospital never confirming.

---

## Prototype classification summary

| Screen | Class |
|---|---|
| R1–R10 | REAL PROTOTYPE (SIMULATED DEMO hospitals and cases) |
| Calls, notifications | SIMULATED DEMO |
| Maps | Hand-off to the device maps app; no live tracking |
