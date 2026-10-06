# Wireframes 01 · Home (low fidelity)

**Question Home answers:** *"What animals near me need help right now?"*

**Scope:** the Home experience in both views of one dataset: **Map** and **List** of active distress cases within **up to 5 km**, the **Report an animal in distress** action, secondary entry points, empty / signed-out / location states, and how Home reflects official status changes. Screen IDs map to [docs/04](../docs/04-screens.md#a-public--browse-no-sign-in): PUBLIC-02 (List) and PUBLIC-03 (Map). This file replaces the earlier W1 section of [wireframes/01-citizen-reporting.md](01-citizen-reporting.md), which now points here.

**Source of truth:** docs/01–07 and the decision log. Most relevant: D48 (Home | Profile), D49 (Home, 5 km), D54 (exact location visible), D55 (private movement), D56/D39 (status rule), D83/D84/D100 (Home visibility), D86/N11 (professional help active), D93/D108 (sharing), D101 (case chat), D111 (sign-in at Take me to the animal), D128/D129 (secondary entries), D130 (empty copy), D137 (account setup). These wireframes **add no product functionality**; anything missing is listed under *Open questions*.

**Not decided here:** visual style, colours, type, iconography, map provider, map styling, motion. Marker "tokens" below describe **states**, not final symbols.

---

## Principles for this screen

1. **Emergency first.** Nearby cases and the Report action dominate. Adoption, food donations, the directory and Help & Safety are one quiet row, never cards of equal weight.
2. **One dataset, two views.** Map and List show exactly the same cases (same query, same filters, same order of truth). Switching never changes what is shown.
3. **Status belongs to the animal.** Markers, cards and sheets show only the **official case status**. Nothing about people's movement is shown or implied: no responder names, counts, live locations or "someone is going".
4. **Visibility is not permission.** A case being on Home never means anyone may intervene; actions depend on status (N11, D84).
5. **Quick decision layer.** The selected-case sheet helps someone decide in seconds; **Case Detail** remains the deeper destination.
6. **Browse freely, sign in to act.** Everything on Home is viewable without an account; account setup appears only when an identity action starts (D111, D137).

---

## Component vocabulary (wireframe level)

| Component | Role | Notes |
|---|---|---|
| **Header** | "Animals near you" + supporting line "Help an animal nearby" | Supporting line is optional (draft copy) |
| **Location context control** | Shows the area Home is centred on, e.g. `📍 Near Bandra West · within 5 km` | Tap → re-centre on current location, or set a location on the map when location is off (W2 / STATE-P02). The 5 km radius is fixed (no radius picker) |
| **View toggle** | `( Map ) ( List )` segmented control | Remembers the last view on the device (draft behaviour) |
| **Case marker** | One per visible case at the **exact animal location** | Shows a status token (below). No people markers other than "you" |
| **"You" indicator** | User's current/approximate position | Only when location is allowed. Never shown to anyone else |
| **Case sheet** | Bottom sheet for the selected marker (Map) | Quick decision layer; expands into nothing more than itself; **View case** opens Case Detail |
| **Case card** | One per case (List) | Same fields as the case sheet, in scan-friendly form |
| **Report CTA** | `[ Report an animal in distress ]` | Always visible on Home (floating above the bottom nav in Map; pinned at the top of List) |
| **Secondary row** | `‹ Adopt a pet › ‹ Food donations › ‹ Vets & organisations › ‹ Help & Safety ›` | Text-weight links, one row (wraps), below the emergency content |
| **Bottom navigation** | `Home │ Adoption │ Donation │ Profile` | Four destinations (D139, supersedes D48's two; the bars drawn below predate it). Home is the default tab |

### Marker / status tokens

Tokens are placeholders for final marker design. Every token is always paired with a **text label** in sheets and cards (never colour alone).

| Token | Official status (label) | On Home? | Marker emphasis (wireframe) | Primary action in sheet/card |
|---|---|---|---|---|
| `[!]` | 🔴 Looking for help (`NEW`) | Yes | **Highest** (only red-family state) | **TAKE ME TO THE ANIMAL** |
| `[A]` | 🟠 Accepted by {organisation} (`ACCEPTED`) | Yes | Medium | View case (Take me to the animal stays available as a secondary action, navigation only, N11) |
| `[~]` | 🟡 Help reaching in ~N min (`ON_THE_WAY`) | Yes | Medium | As above |
| `[T]` | Rescue team reached (`ON_SITE`) | Yes | Low | View case (view only) |
| `[H]` | 🔵 Reaching hospital (`TO_HOSPITAL`, professional) | Yes | Low | View case (view only) |
| `[C]` | 🔵 Responder taking animal to hospital (`RESPONDER_TO_HOSPITAL`) | Yes, **view only** | Low | View case (view only; no Take me to the animal) |
| `[?]` | Could not locate (`CLOSED` + `not_found`) | Yes, **2 hours only** (D84) | Low, muted | View case → case chat ("seen it? share where") |
| `+ pending` | Passed away — awaiting confirmation (flag on the current status) | Yes (D100) | Adds a small "pending" note to the underlying token | Actions of the **underlying** status remain |
| — | Hospital reached · Under treatment · Rescued · Closed — Passed away · Cancelled | **No** | No marker | — |

No marker, card, sheet or label ever shows a community responder's name, contact, movement or live location.

---

## H1 · Home — Map (default)

```
┌──────────────────────────────────┐
│ DEMO banner                      │
│ Animals near you                 │
│ Help an animal nearby            │  ← optional supporting line
│ 📍 Near Bandra West · within 5 km │  ← location context control
│ ( Map • )  ( List )              │
│ ┌──────────────────────────────┐ │
│ │░░░░[!]░░░░░░░░░░░░░░░[~]░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░░ (you) ░░░░░░░░░░░░│ │  ← approximate position
│ │░░[A]░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░[C]░░░░░░░░│ │
│ │░░░░░░░[!]░░░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │  ← 5 km area; no closed cases
│ └──────────────────────────────┘ │
│ 6 animals need attention nearby  │
│ [ Report an animal in distress ] │  ← floating, always visible
│ ‹Adopt a pet›  ‹Food donations›  │
│ ‹ Vets & organisations ›         │
│ ‹ Help & Safety ›                │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Show where help is needed nearby, at a glance, and make reporting one tap away. |
| **Entry point** | App open (after W0 Welcome on first launch) · Home tab · ✕ from Report sent · back from Case Detail |
| **Layout hierarchy** | 1 Header + location context · 2 View toggle · 3 **Map with case markers** (largest area) · 4 Count line · 5 **Report an animal in distress** · 6 Secondary row (quiet) · 7 Bottom navigation |
| **Content hierarchy** | Markers ranked by emphasis: Looking for help first; professional/transport states quieter. The count line reflects the same dataset as List (draft copy). |
| **Primary CTA** | Tap a marker → H2 case sheet. Report an animal in distress → account setup if needed (WA1–WA3) → reporting flow (W2/W3, wireframes/01-citizen-reporting). |
| **Secondary** | Toggle → List (H3). Location control → re-centre / set location. Secondary row → Adoption, Food donations, Directory, Help & Safety (H9). |
| **Interaction** | Pan/zoom within the area; markers stay at exact animal locations. Overlapping markers group into a count bubble that expands on tap (wireframe suggestion). Status updates arrive in realtime: tokens change in place; cases that leave Home disappear (see H8). |
| **States** | Loading (skeleton map + 'Finding animals near you…', draft) · Location off (STATE-P02) · Empty (H5) · Offline (last known cases + 'You're offline' note) · Signed out (H10) |
| **Edge cases** | Many cases in one spot (grouping) · user outside any covered area (same as empty, H5) · a case changes status while visible (H8). |
| **Class** | REAL PROTOTYPE (SIMULATED DEMO cases) |

---

## H2 · Home — Map with a selected case (Looking for help)

```
┌──────────────────────────────────┐
│ Animals near you                 │
│ 📍 Near Bandra West · within 5 km │
│ ( Map • )  ( List )              │
│ ┌──────────────────────────────┐ │
│ │░░░░[!]◉░░░░░░░░░░░░░[~]░░░░░░│ │  ← selected marker
│ │░░░░░░░░░░░ (you) ░░░░░░░░░░░░│ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │  ← case sheet (drag down to close)
│ │ ▢ photo 1/3   Injured Dog    │ │
│ │               Hit by vehicle │ │
│ │ 📍 Near Hill Road, Andheri E │  │
│ │    850 m away                │ │
│ │ LOOKING FOR HELP · 12 min ago│ │
│ │ [ TAKE ME TO THE ANIMAL    ] │ │
│ │ ( View case )    ( Share )   │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | A quick decision layer: is this animal close, what's wrong, does it still need help, and can I go? |
| **Entry point** | Tap a marker on H1 (or swipe between nearby cases inside the sheet, wireframe suggestion). |
| **Content (in order)** | Evidence thumbnail (first photo/video; sensitive media blurred until tapped) · animal type · reason for distress · location (exact area/landmark) · distance · **official status** + reported time · primary action · View case · Share |
| **Primary CTA** | **TAKE ME TO THE ANIMAL** → account setup if signed out (D111, D137) → safety check (R2) → responder flow (wireframes/02). |
| **Secondary** | View case → Case Detail (W9) · Share → device share sheet (live link; never reporter identity or case chat, D108). |
| **Status rule** | Opening the sheet, viewing the case, tapping Take me to the animal, navigating, reaching or assessing **never** changes the status shown here. |
| **Interaction** | Tapping another marker swaps the sheet content; tapping empty map or dragging down closes it. The Report CTA stays reachable (behind the sheet's top edge or after closing). |
| **Must not contain** | Likes, comments, stars, ratings, reactions, followers, responder names/counts, reporter identity. |
| **Class** | REAL PROTOTYPE |

---

## H3 · Home — List (structure)

```
┌──────────────────────────────────┐
│ Animals near you                 │
│ 📍 Near Bandra West · within 5 km │
│ ( Map )  ( List • )              │
│ [ Report an animal in distress ] │  ← pinned at top of List
│ ┌──────────────────────────────┐ │
│ │ ▢     <Animal type>          │ │
│ │ photo <Area> · <distance>    │ │
│ │       <Reason>               │ │
│ │       <STATUS LABEL> · <age> │ │
│ │ [ <primary action> ] (Share) │ │
│ └──────────────────────────────┘ │
│ … more cards …                   │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ ‹Adopt a pet›  ‹Food donations›  │
│ ‹ Vets & organisations ›         │
│ ‹ Help & Safety ›                │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Scan the same nearby cases as text, for users who prefer lists or have weak map skills/data. |
| **Entry point** | Toggle from Map (H1). |
| **Dataset** | Identical to Map: same query, same cases (docs/05 "Home feed"). No list-only content. |
| **Card anatomy** | Photo · animal type · area · distance · reason · official status + time · primary action for that status · Share. Tap anywhere else on the card → Case Detail. |
| **Primary CTA per card** | From the status token table: Looking for help → **Take me to the animal**; all other states → **View case**. |
| **Order** | **Open question:** list order is not decided in the docs (nearest first vs most urgent first vs newest). Wireframe shows Looking for help cases first, then by distance, as a placeholder. |
| **Class** | REAL PROTOTYPE |

---

## H4 · Home — List with active cases (example content)

Mumbai examples are fictional prototype content.

```
┌──────────────────────────────────┐
│ Animals near you                 │
│ 📍 Near Andheri East · within 5 km│
│ ( Map )  ( List • )              │
│ [ Report an animal in distress ] │
│ ┌──────────────────────────────┐ │
│ │ ▢  Injured Dog               │ │
│ │    Andheri East · 850 m      │ │
│ │    Hit by vehicle            │ │
│ │    LOOKING FOR HELP · 12 min │ │
│ │ [ TAKE ME TO THE ANIMAL ]  ⇪ │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢  Injured Cat               │ │
│ │    Powai · 1.8 km            │ │
│ │    Bleeding / wound          │ │
│ │    HELP REACHING IN ~8 MIN   │ │
│ │ ( View case )              ⇪ │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢  Dog · Can't walk          │ │
│ │    Jogeshwari · 2.4 km       │ │
│ │    RESPONDER TAKING ANIMAL   │ │
│ │    TO HOSPITAL               │ │
│ │ ( View case )              ⇪ │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

`⇪` = Share (placeholder glyph).


| | |
|---|---|
| **Content rules** | Exact area and distance are shown (D54). No reporter identity. No responder identity or activity. Professional states show the organisation name only inside Case Detail/sheet copy, never people. |
| **States** | Loading (skeleton cards) · pull to refresh (wireframe suggestion; realtime updates also apply). |

---

## H5 · Home — Empty nearby state

```
┌──────────────────────────────────┐
│ Animals near you                 │
│ 📍 Near Bandra West · within 5 km │
│ ( Map • )  ( List )              │
│ ┌──────────────────────────────┐ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░░ (you) ░░░░░░░░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ └──────────────────────────────┘ │
│ No animals near you need help    │  ← locked copy (STATE-M01)
│ right now.                       │
│ There are no active cases within │  ← draft supporting line
│ 5 km of you.                     │
│ [ Report an animal in distress ] │
│ ‹Adopt a pet›  ‹Food donations›  │
│ ‹ Vets & organisations ›         │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Reassure without implying there are no animals in distress anywhere; keep reporting obvious. |
| **Copy** | Headline is the locked STATE-M01 copy. The supporting line scopes it to the 5 km area (draft). Never "No animals in Mumbai need help". |
| **Primary CTA** | Report an animal in distress. |
| **Same in List** | List shows the same message and CTA in place of cards. |
| **Edge cases** | Location off → STATE-P02 instead ("Turn on location to see animals near you" + set location on map). Offline → offline note, not empty. |

---

## H6 · Home — Responder taking animal to hospital (RESPONDER_TO_HOSPITAL)

```
┌──────────────────────────────────┐
│ ( Map • )  ( List )              │
│ ┌──────────────────────────────┐ │
│ │░░░░░░░░░░░[C]◉░░░░░░░░░░░░░░░│ │  ← marker at the pickup location
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢ photo        Dog           │ │
│ │                Can't walk    │ │
│ │ 📍 Jogeshwari · 2.4 km       │  │
│ │ RESPONDER TAKING ANIMAL TO   │ │
│ │ HOSPITAL                     │ │
│ │ This animal is being taken   │ │
│ │ to a veterinary hospital.    │ │
│ │ To: Lumen Animal Rescue & Vet│ │  ← selected hospital may be shown
│ │ Care                         │ │
│ │ ( View case )    ( Share )   │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Keep the case visible (the animal hasn't reached care yet) while making clear no one else should act. |
| **Rules** | Visible on Map and List, **view only** (D84). **No** Take me to the animal, no override or replacement. **No** responder name, contact, movement or live location; the marker stays at the case location (not a moving responder). Removed from Home when the hospital confirms arrival (Hospital reached, D110). |
| **For the transporter themselves** | Their own view is stage 2 navigation (R9, wireframes/02), not this sheet. |
| **Edge cases** | Hospital never confirms arrival → N10 — Deferred to Next Phase (D127): the case simply stays in this state; Home shows nothing extra. |

---

## H7 · Home — Professional help active

**H7a · Accepted / Help reaching (N11)**

```
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │
│ │ ▢ photo        Injured Cat   │ │
│ │                Bleeding      │ │
│ │ 📍 Powai · 1.8 km            │  │
│ │ HELP REACHING IN ~8 MIN      │ │
│ │ Accepted by Lumen Animal     │ │
│ │ Rescue & Shelter             │ │
│ │ Professional help is on the  │ │
│ │ way. You can still share     │ │
│ │ useful information.          │ │
│ │ [ View case ]   ( Share )    │ │
│ │ ‹ Take me to the animal ›    │ │  ← secondary; navigation only
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**H7b · Rescue team reached / Reaching hospital (view only)**

```
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │
│ │ ▢ photo        Injured Dog   │ │
│ │ 📍 Andheri East · 850 m      │  │
│ │ RESCUE TEAM REACHED          │ │
│ │ The rescue team is with the  │ │
│ │ animal.                      │ │
│ │ [ View case ]   ( Share )    │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Show that professional help is active, discourage duplicate action, but keep the door open to useful information. |
| **H7a rules** | Copy from docs/06 ("Professional help is on the way. You can still share useful information."). Take me to the animal stays available as a **secondary** link (navigation only, N11); at the animal, transport/override is unavailable (R4b). ETA is always approximate ("~"). |
| **H7b rules** | View only. No Take me to the animal. |
| **Content rules** | Organisation name shown (it is public case information); no staff names. |

---

## H8 · Home — case and status transition considerations

How Home reacts when a visible case changes. All changes come from **official status changes** only (professional actions, hospital confirmation, the transporter's Start transport, cancellation, closure). Community movement and chat never change Home.

| Change | Map / List behaviour | Open sheet behaviour |
|---|---|---|
| Looking for help → Accepted / Help reaching | Token `[!]` → `[A]` / `[~]` in place | Primary action becomes View case; Take me to the animal becomes a secondary link (H7a). A user already travelling is told via the N11 banner (R3), not via Home |
| Looking for help → Responder taking animal to hospital | Token → `[C]` | Primary action becomes View case; Take me to the animal disappears (H6) |
| Any active state → Hospital reached / Under treatment | Marker/card **removed** | Sheet shows the new status with a short "This animal has reached care" note (draft) and View case; closes on dismiss |
| → Could not locate | Token → `[?]` (muted) for **2 hours**, then removed (D84) | Shows "The rescue team couldn't find this animal. If you see it, share where in the case chat." |
| Passed away reported (pending) | Same token + "pending" note; stays on Home (D100) | Status line adds "Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm." Actions of the current status remain |
| → Closed — Passed away / Rescued / Cancelled | Removed | Outcome message; closes on dismiss |
| Professional release (back to Looking for help) | Token → `[!]` | Take me to the animal returns as primary |

**Never shown on Home:** "someone is going", responder counts, "X people viewing", responder location, chat activity.

---

## H9 · Home — secondary feature access

| Entry (label, draft) | Destination | Sign-in | Notes |
|---|---|---|---|
| ‹ Adopt a pet › | Adoption list (AD1, wireframes/04) | Browse: no · List/chat: account | Never mixed into the distress map/list |
| ‹ Food donations › | Food donation requests (FD1) | Browse: no · Donate: account | Product-based only |
| ‹ Vets & organisations › | Public directory (DIR1, wireframes/05) | No | Information only; not the transport destination picker |
| ‹ Help & Safety › | Help & Safety (HS1) | No | Public (D129) |

**Placement:** one quiet text row (wrapping to two lines on small phones) under the emergency content: below the Report CTA on Map, after the cards on List. Never cards, banners or carousels; never above the cases or the Report action. Order follows D128 (see *Contradictions* below).

---

## H10 · Home — signed-out browsing

Everything on H1–H9 is visible **without an account**. Only identity actions start account setup (D137: Name → Email → Mobile → Email OTP → signed in).

| Action from Home | Signed out |
|---|---|
| View map/list, open a case sheet, open Case Detail, read case chat, Share | Allowed |
| Secondary entries (adoption list, food requests, directory, Help & Safety) | Allowed (browse) |
| **Report an animal in distress** | → WA1 account setup → back into the report flow |
| **Take me to the animal** | → WA1 account setup → safety check (D111) |
| Post in case chat, list for adoption, donate food | → WA1 account setup |
| Profile tab | → WA1 account setup |

No sign-in banner or nag on Home; the prompt appears only at the moment of action. WA1 "Not now" returns to Home exactly where the user was. The WA1 sheet title follows the action (draft): "Sign in to help this animal" (Take me to the animal), "Sign in to report" (Report), with the line "It takes a minute, once: name, email, mobile, then a code sent to your email." (D137).

---

## Other Home states

| State | Behaviour |
|---|---|
| **First location use** | W2 location explainer (sheet) before the OS prompt; "Not now" keeps Home usable with a manually set location |
| **Location off / denied** | STATE-P02: "Turn on location to see animals near you" + set location on the map; distances hidden until a location exists |
| **Loading** | Skeleton markers/cards; "Finding animals near you…" (draft) |
| **Offline** | Last known cases with "You're offline. This may not be the latest update." |
| **Demo** | DEMO banner; seeded fictional Mumbai cases at every visible status |

---

## Flow

```
App open ─► H1 Map ⇄ H3/H4 List ─────────────────────────────┐
   │ tap marker / card                                         │
   ▼                                                           │
H2 case sheet ── TAKE ME TO THE ANIMAL ─► (WA1–WA3 if signed out) ─► R2 safety check ─► responder flow (wireframes/02)
   │ View case ─► W9 Case Detail                               │
   │ Share ─► device share sheet (live link)                    │
   │                                                           │
Report an animal in distress ─► (WA1–WA3) ─► W2 / W3 reporting flow (wireframes/01-citizen-reporting)
Secondary row ─► AD1 · FD1 · DIR1 · HS1
Bottom nav ─► Profile (P1; account needed)
```

---

## Contradictions with locked decisions (not resolved here)

1. **Secondary entry order.** The Home brief lists *Directory → Adopt a pet → Food donations*. Locked **D128** sets *adoption → food donations → directory* (with Help & Safety, D129). This wireframe follows D128 until a decision changes it.
2. **"No marker for closed cases" vs D84.** Locked **D84** keeps **Could not locate** (a `CLOSED` outcome) visible on Home for 2 hours. This wireframe follows D84 (muted `[?]` token). Other closed outcomes have no marker.

## Open questions (not decided in the docs)

1. **List order:** nearest first, most urgent first (urgency is derived, docs/03) or newest first? Placeholder: Looking for help first, then distance.
2. **Map default zoom / framing** of the 5 km area and whether markers outside the current viewport are indicated (wireframe suggestion only).
3. **Marker grouping** for overlapping cases (count bubble is a wireframe suggestion, not a product rule).
4. **Draft copy** to confirm (also): contextual WA1 titles such as "Sign in to help this animal".
5. **Draft copy** to confirm: supporting line "Help an animal nearby", count line "6 animals need attention nearby", empty supporting line "There are no active cases within 5 km of you.", loading line, "This animal has reached care".
6. **Earlier W1 label "Navigate"** on list cards (old wireframe) is replaced here by the documented **Take me to the animal** action, so that every navigation goes through the safety check (D44, D111).

---

## Prototype classification summary

| Screen / state | Class |
|---|---|
| H1–H10, other Home states | REAL PROTOTYPE (SIMULATED DEMO cases; fictional Mumbai content) |
| Map provider, styling, marker visuals | Not decided (design phase) |
