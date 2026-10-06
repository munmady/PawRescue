# Wireframes 03 · Organisation / veterinary hospital dashboard (low fidelity)

**Scope:** the separate web dashboard (mobile-first PWA) for **registered/verified** veterinary hospitals, rescue organisations and shelter homes. Screen IDs map to [docs/04](../docs/04-screens.md#i-organisation--veterinary-hospital-dashboard-verified-organisations-only) (ORG-01 … ORG-10, ORG-O1 … O7).

**Source of truth:** `docs/01`–`07` (D3, D20, D40, D41, D74/D100, D77, D87/N12, D92, D95/D115/D120, D103, D105, D108, D110, D118, D119, D137). These wireframes add no features. Layout only; drawn at phone width because coordinators mostly work on phones (A6); wider screens reflow.

**Rules for every dashboard screen**

- **Verified organisations only** (D105, D118): onboarded by the platform admin through a backend form. No Apply to join, no pending-verification state.
- Sign-in: one-time email OTP account verification (Name → Email → Mobile → Email OTP, D137). No passwords, no SMS OTP, no email links.
- **Approximate ETA only.** Buttons are verbs: Accept, Mark on the way, Mark team reached, Mark reaching hospital, Confirm arrival, Mark under treatment, Post official update, Confirm, Close case (docs/06).
- Every status change writes a CaseEvent. Calls are disabled in the demo; alerts (web push, email) are SIMULATED DEMO; the realtime inbox is real.
- Responder identity/contact appears **only** to the selected veterinary hospital, **only** after transport starts; never live location (N12).

---

## O1 · Sign in · ORG-01

```
┌──────────────────────────────────┐
│ Organisation dashboard           │
│ For registered organisations     │
│                                  │
│ Name                             │
│ ┌──────────────────────────────┐ │
│ │ Priya                        │ │
│ └──────────────────────────────┘ │
│ Email                            │
│ ┌──────────────────────────────┐ │
│ │ staff@organisation.org       │ │
│ └──────────────────────────────┘ │
│ Mobile number                    │
│ ┌────┬─────────────────────────┐ │
│ │ +91│ 98XXX XXXXX             │ │
│ └────┴─────────────────────────┘ │
│                                  │
│  [         Send code         ]   │
└──────────────────────────────────┘
```

Then the same email-code screen as WA3 (wireframes/01): one-time email OTP account verification (D137). After that, staff stay signed in.

| | |
|---|---|
| **Purpose** | Sign in staff of organisations already onboarded by the admin (D118). |
| **States** | *Sign-in failure:* "Sign-in didn't work" (D106). *Wrong/expired code:* D131 copy. *Account not linked to a verified organisation:* no dashboard access; "This account isn't linked to a registered organisation. Contact the platform team if you think this is a mistake." (D134). |
| **Class** | REAL PROTOTYPE · email OTP SIMULATED DEMO |

---

## O3 · Inbox · ORG-03

```
┌──────────────────────────────────┐
│ Lumen Animal Rescue & Shelter ☰  │
│ (New nearby•) (Ours) (Closed)    │
│ ( List • )  ( Map )              │
│ ┌──────────────────────────────┐ │
│ │ URGENT · Dog · Hit by vehicle│ │
│ │ 2.1 km · reported 6 min ago  │ │
│ │ ▢▢ 2 photos · voice note     │ │
│ │ ( Open )        [ Accept ]   │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Cat · Bleeding / wound       │ │
│ │ 3.0 km · reported 18 min ago │ │
│ │ ( Open )        [ Accept ]   │ │
│ └──────────────────────────────┘ │
│ ‹ Incoming transports (1) ›      │  ← veterinary hospitals only
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Receive and triage cases in realtime. |
| **Primary CTA** | Accept (ORG-O1) or Open → O4 |
| **Content rules** | Tabs: New nearby / Ours / Closed; list and map. Urgency label in words (red family for urgency only). Evidence counts; reporter identity not shown in the list. |
| **States** | *Empty:* "No new cases near you right now." (D134). *Needs attention (timeout):* case marked for admin. *Loading:* skeleton. |
| **Class** | REAL PROTOTYPE (realtime) · alerts SIMULATED DEMO |

---

## O4 · Case detail (organisation) · ORG-04

```
┌──────────────────────────────────┐
│ ← Inbox           Case AR-10245 ⋯│
│ [EVIDENCE 1/2 · swipe]  ▶ 0:21   │
│ LOOKING FOR HELP                 │
│ Dog · Hit by vehicle · URGENT    │
│ 📍 Near Hill Road, Bandra · 2.1 km│
│  ‹ Open in Maps ›                │
│ "The dog is lying near the bus   │
│ stop and can't stand up."        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ Reporter: Priya · 98XXX XXXXX    │  ← handling org only
│  ( Call reporter )               │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ Next step                        │
│ [         Accept          ]      │  ← then the next verb
│ ( Decline )                      │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ Case chat (2 new) ›              │
│ [   Post official update    ]    │
│ Timeline: Reported 6 min ago…    │
└──────────────────────────────────┘
```

**Next-step sequence (one primary verb at a time):** Accept → Mark on the way (enter approximate ETA, ORG-O2) → Mark team reached → Mark reaching hospital → Confirm arrival (Hospital reached) → Mark under treatment → Close case (outcome, ORG-O4). Steps can be skipped forward.


| | |
|---|---|
| **Purpose** | Act on one case: accept, update professional status, coordinate, record outcome. |
| **Content rules** | Full evidence, exact location, reporter first name and mobile (cases they handle). ⋯ menu: Release (ORG-O3), Cancel / correct location pin (ORG-O6). No responder identity unless this hospital is the transport destination (O5). |
| **States** | *Passed away reported:* banner "Someone has reported that this animal has passed away" with **Confirm** (ORG-O5; veterinary hospitals and rescue organisations only, D100). *Accepted by another organisation:* view only. *Offline:* last known state. |
| **Class** | REAL PROTOTYPE |

---

## Overlays · ORG-O1 … O7

**ORG-O1 · Accept / Decline**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Accept this case?              ││
││ Your organisation will be shown││
││ as handling it.                ││
││ [          Accept           ]  ││
││ ( Decline )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

**ORG-O2 · Mark on the way (approximate ETA)**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ About how long until you reach ││
││ the animal?                    ││
││ ( ~5 min ) ( ~10 min ) ( ~20 ) ││
││ ( Other: __ min )              ││
││ Shown as "about" to everyone.  ││
││ [       Mark on the way      ] ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

**ORG-O3 · Release case** (reason required; case returns to Looking for help and other organisations are re-alerted)

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Release this case?             ││
││ It goes back to Looking for    ││
││ help and nearby organisations  ││
││ are alerted again.             ││
││ Reason (required)              ││
││ ┌────────────────────────────┐ ││
││ └────────────────────────────┘ ││
││ [        Release case        ] ││
││ ( Keep case )                  ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

**ORG-O4 · Close case (outcome)**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ How did this case end?         ││
││ ( Released where found )       ││
││ ( Relocated / sheltered )      ││
││ ( Ready for adoption )         ││
││ ( Treated on site )            ││
││ ( Could not locate )           ││
││ ( Passed away )                ││
││ ( Other )                      ││
││ [         Close case         ] ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

Outcome values from docs/03 (`released_at_origin`, `relocated_or_sheltered`, `ready_for_adoption`, `adopted`, `treated_on_site` → shown as **Rescued**; `not_found` → Could not locate; `already_helped`, `owned_animal`, `deceased`, `other`). Passed away from a shelter: only veterinary hospitals and rescue organisations can close as Passed away (D100).


**ORG-O5 · Confirm Passed away** (veterinary hospitals and rescue organisations only)

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Confirm the animal has passed  ││
││ away?                          ││
││ The case will close as "Closed ││
││ — Passed away" and leave Home. ││
││ [          Confirm           ] ││
││ ( Not now )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

**ORG-O6 · Cancel / correct location** · cancel reasons: `duplicate` · `not_genuine` · `outside_service_area` · `other`; location corrections are logged.


**ORG-O7 · Install & alerts prompt** · SIMULATED DEMO explainer; never a real browser permission request.


---

## O5 · Incoming transport (selected veterinary hospital only) · ORG-05

```
┌──────────────────────────────────┐
│ ← Inbox     INCOMING TRANSPORT   │
│ A community responder is         │
│ bringing an animal to you.       │
│ ▢ Dog · Hit by vehicle           │
│ Picked up near Hill Road, Bandra │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ Rahul Mehta · Community          │  ← N12: shown only after
│ Responder                        │  ← transport started
│ rahul@…  ·  98XXX XXXXX          │
│  ( Call responder )              │
│ No live location is shared.      │  ← never
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ [      Confirm arrival      ]    │  ← sets Hospital reached (D110)
│ then: Mark under treatment →     │
│ Close case                       │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Prepare for and confirm a community transport arrival. |
| **Content rules** | Responder name, email, mobile, Community Responder role, case details. Only this hospital sees them, only after transport started (N12). Arrival is confirmed here, not by the responder (D110). |
| **States** | *Responder tapped I've arrived:* "The responder says they've arrived." (D134); status still changes only on Confirm arrival. *Never confirmed:* N10 — Deferred to Next Phase (D127). |
| **Class** | REAL PROTOTYPE |

---

## O6 · Confirmations · ORG-06

```
┌──────────────────────────────────┐
│ ← Inbox          Confirmations   │
│ ┌──────────────────────────────┐ │
│ │ Passed away reported         │ │
│ │ Dog · Bandra · 1 h ago       │ │
│ │ ( Open )       [ Confirm ]   │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Transport arrival            │ │
│ │ Cat · from responder · now   │ │
│ │ ( Open ) [ Confirm arrival ] │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

Pending passed-away reports (veterinary hospitals and rescue organisations only, D100), transport arrivals (receiving hospital only), outcomes. Empty state: "Nothing to confirm right now." (D134).


---

## O7 · Case chat (organisation view) · ORG-07

```
┌──────────────────────────────────┐
│ ← Case            Case chat      │
│ ┌──────────────────────────────┐ │
│ │ OFFICIAL UPDATE        ✓     │ │
│ │ Lumen Animal Rescue & Shelter│ │
│ │ Rescue team has reached the  │ │
│ │ location. Please do not      │ │
│ │ approach unless requested.   │ │
│ └──────────────────────────────┘ │
│ Priya · Reporter                 │
│ He moved behind the blue car.    │
│ ┌──────────────────────────────┐ │
│ │ Write a message…          ➤  │ │
│ └──────────────────────────────┘ │
│ [   Post official update    ]    │
└──────────────────────────────────┘
```

Same thread as citizens see (open to everyone, D101). Official updates are pinned at the top. Staff can post normal messages or official updates; the abuse filter and Message not sent states apply. Flagged messages go to admin (D113).


---

## O8 · Food donation requests · ORG-08

```
┌──────────────────────────────────┐
│ ← Menu     Food donation requests│
│ [     Create a request      ]    │
│ ┌──────────────────────────────┐ │
│ │ Help feed 35 rescued cats    │ │
│ │ and dogs · OPEN              │ │
│ │ 3 products · 12 donations    │ │
│ │ ( View )   ( Mark fulfilled )│ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Create request:**

```
┌──────────────────────────────────┐
│ ← Back        New request        │
│ Need (shown to donors)           │
│ ┌──────────────────────────────┐ │
│ │ Help feed 35 rescued cats…   │ │
│ └──────────────────────────────┘ │
│ Products                         │
│ Whiskas Dry Cat Food · 1 kg ₹XXX │
│ Whiskas Dry Cat Food · 3 kg ₹XXX │
│  ( + Add product )               │
│ Delivered to your registered     │
│ address.                         │
│  [         Publish          ]    │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Ask for specific products; see contributions; mark fulfilled (D95, D120). |
| **Who** | Registered/verified veterinary hospitals, rescue organisations and shelter homes only. |
| **Content rules** | Product name, size, price per item. No cash amounts or free-amount requests. Donations show product, quantity, donor-side statuses (Paid/Failed · Order placed → Out for delivery → Delivered, D124); donor identity visible to the requesting organisation (07). |
| **Class** | REAL PROTOTYPE · payment and delivery SIMULATED DEMO |

---

## O9 · Adoption listings (organisation) · ORG-09

Same form and detail as citizen adoption (ADOPT-02/03, D94): create/edit, status Available / Adopted, remove (D126), conversations per listing. This is the organisation's equivalent of My Adoption Listings.


---

## O10 · Team / Settings (org admin) · ORG-10

```
┌──────────────────────────────────┐
│ ← Menu              Settings     │
│ Organisation                     │
│  Name, type, public profile      │
│  Registered address              │
│  Base location · service radius  │
│  Species · services · hours      │
│  Alert contacts (demo)           │
│ Team                             │
│  Priya · Org admin               │
│  Arjun · Staff        ( Remove ) │
│  ( + Add staff )                 │  ← email + mobile (D133)
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Organisation details used for routing, the public directory and food delivery. |
| **Team** | Org admin adds staff by email and mobile and can remove them (D133). Added staff complete the one-time email OTP account setup (D137). The first members are set up by the platform admin (D118). |
| **Class** | REAL PROTOTYPE |

---

## Flow

```
O1 Sign in (one-time email OTP account setup) ──► O3 Inbox (New nearby / Ours / Closed · List / Map)
                                                 │ Open / Accept
                                                 ▼
                                   O4 Case detail ── Next step: Accept → On the way (ETA) → Team reached
                                     │               → Reaching hospital → Confirm arrival → Under treatment → Close (O4 outcome)
                                     │ ⋯ Release (reason) · Cancel / correct pin
                                     │ Case chat → O7 (Post official update)
                                     │ Passed away reported → Confirm (hospitals, rescue orgs)
                                     ▼
                     O5 Incoming transport (selected hospital only) → Confirm arrival → Under treatment → Close
O6 Confirmations · O8 Food donation requests · O9 Adoption listings · O10 Team / Settings
```

---

## Prototype classification summary

| Screen | Class |
|---|---|
| O1, O3–O10, overlays | REAL PROTOTYPE (fictional organisations, seeded cases) |
| Alerts (web push, email), O7 install prompt, calls, email OTP delivery, food payment/delivery | SIMULATED DEMO |
