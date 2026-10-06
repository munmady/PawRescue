# 03 · Flows & Case Lifecycle

Everything marked **MVP** is REAL PROTOTYPE, running on SIMULATED DEMO data (fictional Mumbai organisations and cases) where noted. FUTURE ARCHITECTURE is not built. **N10 — Deferred to Next Phase** (D109) is not designed. (N7a is locked: D100.) See [01-product.md](01-product.md#prototype-classification).

## Core flow

```
 Home: nearby animals in distress (Map / List, ~5 km)          Report an animal in distress
        │                                                                  │ (sign-in)
        │ open a case                                                      ▼
        │                            Media (1–4) → What's wrong? → Where is it? → Mobile number → SEND
        │                                                                  │
        │                                                       Possible duplicate? → Report sent → Case Detail
        ▼                                                                  │
   Case Detail ◄───────────────────────────────────────────────────────────┘
   (evidence · status · Take me to the animal · Share · Case chat)
        │
   🔴 Looking for help
        │
   ┌────┴───────────────────────────────┬──────────────────────────────┐
   ▼                                    ▼                              ▼
 PROFESSIONAL                       COMMUNITY RESPONDER              No one accepts in time
 🟠 Accepted by organisation        Take me to the animal → safety     │
 🟡 Help reaching in ~N min         check → navigate → reach animal    ▼
 Rescue team reached                (status unchanged; private)      Fallback: call nearby help,
   │                                    │ still Looking for help?      admin alerted,
   ▼                                    ▼ can safely transport?        case stays open
 🔵 Reaching hospital              🔵 Responder taking animal
   │                                    to hospital
   └─────────────┬──────────────────────┘
                 ▼
 Hospital reached ──► Under treatment ──► Rescued / Could not locate / Closed — Passed away / Cancelled
```

Both paths can be active, but a community responder can never override an active professional response. Case chat runs alongside and never changes the status.

---

## Status terminology (canonical)

| Display label | Internal |
|---|---|
| 🔴 Looking for help | `NEW` |
| 🟠 Accepted by organisation (shown as "Accepted by {organisation}") | `ACCEPTED` |
| 🟡 Help reaching in ~N min | `ON_THE_WAY` |
| Rescue team reached | `ON_SITE` |
| 🔵 Reaching hospital (professional only) | `TO_HOSPITAL` |
| 🔵 Responder taking animal to hospital | `RESPONDER_TO_HOSPITAL` |
| Hospital reached | `AT_HOSPITAL` |
| Under treatment | `IN_CARE` |
| Rescued | `CLOSED` + successful outcome |
| Could not locate | `CLOSED` + `not_found` |
| Passed away — awaiting confirmation | `death_reported_pending` flag (status unchanged) |
| Closed — Passed away | `CLOSED` + `deceased` |
| Cancelled | `CANCELLED` |

---

## The reporter's emotional arc

| Moment | What they feel | Design response |
|---|---|---|
| Seeing the animal | Shock, urgency | "Report an animal in distress" is one tap from Home (one-time account setup if not signed in). |
| Reporting | Pressure | Media first, short screens; the account mobile is shown read-only. |
| Just submitted | "Did it work?" | "Report sent." Safety tips. Optional ways to help, clearly not required. |
| Waiting | Anxiety, guilt | Real time stamps; official updates pinned in case chat; notifications for status changes. "It's okay to leave." |
| Handoff | Relief | "Accepted by {organisation}" and an approximate ETA where reliable. |
| Later | Need for closure | Outcome on Case Detail and in Profile → My Reports. |
| Bad outcome | Grief | Gentle copy. No blame. |

---

## Sign-in

**CONFIRMED (D137).** **Account setup and sign-in (D137, LOCKED):** One-time email OTP account verification with required name, email address and mobile number. One-time setup: **Name → Email → Mobile → Email OTP → signed in**. Name is required (not a full/legal name). Any valid email provider (Gmail, Outlook, Yahoo, work email, others). The mobile number is required and stored as profile/contact information; it is **not** verified and **not** used for OTP. A one-time code is sent to the **email address**; entering it completes setup and the user stays signed in. No passwords, no Google-only sign-in, no phone/SMS OTP, no email magic links. Applies to citizens and organisation dashboard members. Email OTP delivery is SIMULATED DEMO in the prototype (no real email).

```text
Sign-in prompt → Name → Email → Mobile → one-time code sent to the email → enter code → signed in → original action resumes
```

**Staying signed in (D122 as amended by D137):** the email OTP is a **one-time setup step**; afterwards the user **stays signed in** and is not asked for a code during normal use. How a user signs back in after Logout or on a new device is **not yet specified**.

**Lost phone:** sign-in does not depend on the mobile (D137), so D121 no longer applies. The mobile still cannot be changed (D117). Account recovery is not specified.

- **Without signing in:** browse Home (Map/List), open Case Detail, open and read case chat, open shared links, browse adoption listings, food donation requests and the Veterinary & Animal Organisations directory.
- **Sign-in required for:** reporting an animal in distress · the responder flow, from the **Take me to the animal** tap, before the safety check (D111) · creating adoption listings · contributing to food donations · sending case chat messages · Profile (My Reports, My Adoption Listings, My Food Donations).
- **Sign-in failure (D106):** "Sign-in didn’t work" · "We couldn’t sign you in. Please try again." · **Try Again**.
- The **mobile number** given at account setup is used for distress reports and community transport; it is not verified and cannot be changed (D117). It is for emergency coordination, never public, and never an authentication factor.

---

## Home and nearby distress cases

**CONFIRMED.** Home is the primary operational screen.

**Hierarchy:** 1 Nearby animals in distress · 2 Report an animal in distress · 3 Secondary adoption · 4 Secondary food donation discovery · 5 Veterinary & Animal Organisations directory link (D128, public). Help & Safety is readable without sign-in (D129).

- **Map view** and **List/Card view** use the **same active distress-case dataset**; the toggle never shows different cases.
- Radius: up to **5 km**.
- **Exact animal location is intentionally visible** to potential helpers, with the case evidence.
- No Responder tab: every user automatically sees nearby active cases.
- Adoption listings and food donation requests never appear on the distress map/list.

**Home visibility (D83, D84).** Home shows active cases where additional community assistance or useful information may still be relevant. Cases at confirmed hospital treatment or a closed outcome leave live Home, except the explicit exceptions below.

| Status | Home | Community action |
|---|---|---|
| 🔴 Looking for help | **YES** | Open the case; **Take me to the animal** |
| 🟠 Accepted by organisation | **YES** | View; professional response active; no community override |
| 🟡 Help reaching in ~N min | **YES** | View; professional help active; no community override |
| Rescue team reached | **YES** | View; professional rescue active; no community transport |
| 🔵 Reaching hospital | **YES** | View; professional transport active; no community transport |
| 🔵 Responder taking animal to hospital | **YES, view only** | No Take me to the animal for others; no override/replacement; no responder name, contact or live location; selected hospital may be shown; removed at Hospital reached |
| Hospital reached | NO | Professional treatment underway |
| Under treatment | NO | Animal in professional care |
| Rescued | NO | Closed |
| Could not locate | **YES for 2 hours** after it is recorded | Chat stays open for location information; then removed from Home, kept in My Reports/history where applicable; never automatically reopened |
| Passed away — awaiting confirmation | **YES** | Visible while confirmation is pending; never silently removed; normal help actions for the current status remain available (D100) |
| Closed — Passed away | NO | Closed |
| Cancelled | NO | Closed |

**Home visibility does not mean permission to intervene or transport.** Reactivating a Could not locate case is **N10 — Deferred to Next Phase**; "Report seen again" is not an automatic reopening mechanism.

**Distress case card:** animal photo/video, animal type, location, reason, current help status, approximate distance, view case, navigation/action where appropriate, Share. No Blue Tick, no social counters, no responder activity.

---

## Report flow (detailed)

**CONFIRMED.** Order:

```
Welcome (first launch only)
→ Home
→ Location permission explainer (first time location is needed)
→ Media
→ What's wrong?
→ Where is it?
→ Mobile number (account mobile; read-only, D117)
→ Send
→ Possible duplicate?
→ Report sent
→ Case Detail
```

Account setup / sign-in (email OTP, D137) is requested when the user starts a report (if not already signed in).

### Media (Add evidence)

- **Required: 1–4 photos/videos**, any combination. Minimum 1, maximum 4. **Add evidence** is disabled at 4.
- Preview and remove before submission. No extra evidence can be added to the report after submission in the MVP.
- **Safety fallback only:** ‹ **I can't safely take a photo or video** › → explicit confirmation → continue with zero media (`no_media`). Never a general skip.
- Reporter evidence is private case information and not publicly discoverable; it is visible to helpers in the app and in privacy-safe shared links.
- Maximum video duration: to be defined during technical implementation.

### What's wrong?

- Species (Dog · Cat · Other) and problem chips (Hit by vehicle · Bleeding / wound · Can't walk or stand · Not responding · Very sick / weak · Trapped / stuck · Other). Urgency is derived. **NEEDS VALIDATION** against organisation triage.
- **Tell us what you saw** (optional) · "Add any details that may help the rescue team." One ChatGPT-style composer for typed text and/or a voice note (playback, delete, re-record). Optional because media is mandatory.

### Where is it?

Current location, map pin, adjustment, search, optional landmark (100 characters).

### Mobile number and Send

- **Required on every report**, for **emergency coordination between the reporter and the relevant organisation/hospital**.
- **Shows the account mobile** given at setup (D137), read-only: there is no phone-number edit feature (D117).
- No OTP or verification at this step. Not public profile information.
- Privacy line: "Only the registered hospital or organisation handling this case will see your number."
- Compact summary with ‹ Edit › links → **Send report**.

### Possible duplicate (after Send)

> **We may already have this animal's case.**
> Someone has reported an animal in this area and help may already be on the way.

Shows the existing case's status. Actions:

- **View existing case** → existing Case Detail; the new report isn't submitted and nothing is attached. Viewing doesn't make the user a responder or add the case to My Reports.
- **I can take this animal to a hospital** → no second case; opens the existing Case Detail with its current status. Professional help active → no override, no competing transport. Still Looking for help → the community responder flow starts at the safety check.
- **This is a different animal** → submit → Report sent.

### Report sent

"Report sent" and alerting status · "You've done the most important part." · "Reporting is free. Reporting doesn't make you responsible for the animal." (**NEEDS VALIDATION**) · Safety tips (subject to veterinary/medical validation) · **Optional ways you can help: only if you're able.** (stay nearby; help transport if the team asks; "Not able to" equal weight) · "These are optional. It's okay to leave." · What happens next card (notification explainer, SIMULATED DEMO) · **View your report**. Closing returns to Home. The case is now in **My Reports**.

### Draft, locking, cancelling

- After the first media item the report is a draft; leaving asks **Discard this report?**.
- After submission the report is locked; later information goes in the case chat.
- Reporter can **Cancel report** (Case Detail ⋯) only while `NEW`; records `cancelled_by_reporter`; never deleted.

### Fields

| Required | Optional | Never asked |
|---|---|---|
| 1–4 photos/videos (or safety fallback) | Tell us what you saw (text and/or voice) | OTP or any verification code at the report step |
| Species, at least one problem | Landmark | Password |
| Location | Optional ways to help (Report sent) | Payment |
| Mobile number | | Anything implying responsibility for the animal |

---

## Case lifecycle

### Principle

**CONFIRMED. Official case status belongs to the animal/case, not to movements of people.** Professional organisation actions change official status. Community responder movement alone never does. **Case chat never changes status.**

### Separate concepts

| Concept | Changed by | Visible to |
|---|---|---|
| **Case status** | Professional organisations; receiving hospital; admin; reporter (cancel while `NEW`); a community responder only by starting transport under the six conditions | Everyone who can see the case and shared links |
| **Professional response** | That organisation | "Accepted by {organisation}" and approximate ETA |
| **Community responder record** | That responder | Private. Only the selected veterinary hospital sees the responder's identity and mobile, only after transport starts (N12, N24). Admin. |
| **Case chat** | Anyone (sending needs sign-in) | Everyone in the app (not in shared links); never changes status |
| **Pending death report** | Reporter/responder report; a verified veterinary hospital or rescue organisation confirms (D100) | Everyone who can see the case |

### Case statuses

| Status | Display | Meaning | Set by |
|---|---|---|---|
| `NEW` | 🔴 Looking for help | No professional acceptance; no community transport | System |
| `ACCEPTED` | 🟠 Accepted by {organisation} | Verified organisation accepted | Organisation |
| `ON_THE_WAY` | 🟡 Help reaching in ~N min | Dispatched with an approximate ETA | Organisation |
| `ON_SITE` | Rescue team reached | Professional team at the animal | Organisation |
| `TO_HOSPITAL` | 🔵 Reaching hospital | **Professional transport only** | Organisation |
| `RESPONDER_TO_HOSPITAL` | 🔵 Responder taking animal to hospital | Community transport to a registered/verified **veterinary hospital**; only from `NEW` | System, when the responder starts transport |
| `AT_HOSPITAL` | Hospital reached | Arrived | Organisation (professional transport); after community transport, **only the selected veterinary hospital confirming arrival** (D110). The responder's arrival tap never sets it |
| `IN_CARE` | Under treatment | Being treated | Receiving hospital or accepting organisation |
| `CLOSED` | Rescued · Could not locate · Closed — Passed away · … | Required outcome | Organisation, receiving hospital, admin |
| `CANCELLED` | Cancelled | Withdrawn before help | Reporter (`NEW` only), organisation, admin |

**Approximate ETA only.** "Help reaching in ~N min" requires an accepting organisation and an approximate ETA (entered by the organisation; SIMULATED DEMO for demo organisations). No real-time tracking.

**Flags:** `urgent` · `needs_attention` (timeout) · `reporter_transporting` (reporter's optional help used by the organisation; distinct from community transport) · `no_media` · `death_reported_pending`.

**Outcomes when `CLOSED`:** `released_at_origin` · `relocated_or_sheltered` · `ready_for_adoption` · `adopted` · `treated_on_site` (all shown as **Rescued**) · `not_found` (**Could not locate**) · `already_helped` · `owned_animal` · `deceased` (**Closed — Passed away**) · `other`.

**Cancellation reasons:** `cancelled_by_reporter` · `reporter_mistake` · `duplicate` · `not_genuine` · `outside_service_area` · `other`.

### Transitions

```
Professional (steps can be skipped forward):
NEW → ACCEPTED → ON_THE_WAY → ON_SITE → TO_HOSPITAL → AT_HOSPITAL → IN_CARE → CLOSED

Community transport (ONLY from NEW, all six conditions, mobile provided, verified veterinary hospital only):
NEW → RESPONDER_TO_HOSPITAL → AT_HOSPITAL → IN_CARE → CLOSED

Passed away confirmed by a verified veterinary hospital or rescue organisation → CLOSED (deceased)
NEW → CANCELLED
ACCEPTED / ON_THE_WAY / ON_SITE → NEW   (professional release; reason required; re-alert)
```

- Forward only, except professional release.
- One active transport per case. No automatic professional/community handover in the MVP.
- **Responder unable to continue: N10 — Deferred to Next Phase (D109).** No MVP rule, UI or automatic status transition. Deferred: cannot continue after reaching the animal or after starting transport, "I can't continue" / "Request help", transfer/handover to another responder or a professional team, replacement responder, cancellation during community transport, related reactivation/reopening (including after Could not locate), automatic handoff transitions, and responder–hospital–rescue organisation coordination in these cases.
- Admin can reassign and cancel cases. **There is no admin reopen in the MVP** (D123); reopening of any kind is **N10 — Deferred to Next Phase**.
- Every status change creates an append-only `CaseEvent`.

### The community transport rule

A community responder does **not** change official status by: viewing the case · tapping Take me to the animal · navigating · approaching · reaching the animal · assessing it · saying they can help · saying they can transport · selecting a hospital · chatting.

Status changes **only when ALL of these occur:**

1. The case is currently **NEW / Looking for help**.
2. The responder reaches the animal.
3. The responder confirms they can **safely** transport the animal.
4. The responder selects a **registered/verified veterinary hospital** (only hospitals; rescue organisations and shelters are not selectable here).
5. The responder informs/calls the hospital as required.
6. The responder starts transport.

**Prerequisite (N24):** before transport can start, the responder must provide or confirm a mobile number.

→ **🔵 Responder taking animal to hospital** (`RESPONDER_TO_HOSPITAL`). Allowed only from `NEW`. If professional help is already active, a community responder cannot override or replace it.

### Permission matrix

| Action | Reporter | Community responder | Org staff (handling / receiving) | Org admin | Platform admin |
|---|:-:|:-:|:-:|:-:|:-:|
| Browse Home and Case Detail (no sign-in needed) | ✅ | ✅ | | | |
| Create case (signed in; mobile required) | ✅ | ✅ | | | |
| Cancel while `NEW` | ✅ | | | | ✅ |
| See reporter phone/email/private profile | own | ❌ | phone ✅ (cases they handle) | phone ✅ | ✅ |
| See responder name/email/mobile/role | | own | ✅ only after transport to them starts | ✅ (same) | ✅ |
| See responder live location | | own | ❌ | ❌ | ❌ |
| Share a case | ✅ | ✅ | ✅ | ✅ | |
| Case chat: view (anyone, no sign-in) / post (any signed-in user), D101 | ✅ | ✅ | ✅ (pinned official updates) | ✅ | moderate |
| Flag a case chat message (signed in, D113) | ✅ | ✅ | | | review |
| Take me to the animal | ✅ | ✅ | | | |
| Start community transport | ✅ | ✅ only under the six conditions | | | |
| Report Passed away (pending) | ✅ | ✅ | | | |
| Confirm Passed away (D100) | ❌ | ❌ | ✅ (verified veterinary hospital or rescue organisation) | ✅ (same) | — (admin review/escalation not yet defined) |
| Record outcome / confirm arrival (community transport: selected veterinary hospital only, D110) | | ❌ | ✅ | ✅ | ✅ |
| Professional status, ETA, treatment | | ❌ | ✅ | ✅ | ✅ |
| Override a professional response | ❌ | ❌ | own only | own only | ✅ |
| Create adoption listing | ✅ | ✅ | ✅ | ✅ | |
| Create food donation request | ❌ | ❌ | ✅ (eligible org types) | ✅ | |
| Contribute to food donation | ✅ | ✅ | | | |
| Grant / revoke Blue Tick | ❌ | ❌ | ❌ | ❌ | ✅ |

### Case Detail

**CONFIRMED. Action-first.** It answers: **What happened? Where is the animal? Does the animal still need my help?** The screen stays fundamentally the same through the lifecycle; only the status/action area changes.

```text
← Animal in distress                         ⋯

[LARGE ANIMAL PHOTO]   (swipe for all 1–4 photos/videos; voice note if added)

🔴 LOOKING FOR HELP

🐕 Injured Dog
📍 Andheri East · 850 m

Hit by vehicle. Dog appears to have an injured rear leg.

🚨 THIS ANIMAL NEEDS HELP

[ TAKE ME TO THE ANIMAL ]

Reported 12 min ago

[ Share ]   [ Case chat ]
```

| Status | Status/action area |
|---|---|
| 🔴 Looking for help | "🚨 This animal needs help" · **Take me to the animal** |
| 🟠 Accepted by organisation / 🟡 Help reaching in ~N min | "Professional help is on the way." Take me to the animal / navigation remains available (N11); no transport/override |
| Rescue team reached / 🔵 Reaching hospital | View only |
| 🔵 Responder taking animal to hospital | "🔵 RESPONDER TAKING ANIMAL TO HOSPITAL · This animal is being taken to a veterinary hospital." Selected hospital may be shown. View only; no responder name/contact/location |
| Hospital reached / Under treatment | View only |
| Could not locate | "The rescue team couldn't find this animal. If you see it, share where in the case chat." |
| Passed away — awaiting confirmation | "Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm." Normal help actions for the current status stay available (e.g. Take me to the animal while Looking for help) (D100) |
| Rescued / Closed — Passed away / Cancelled | Outcome, gentle message |
| No response yet | Fallback: nearby helplines and vets to call (demo: disabled) |

No likes, comments, social feed or engagement mechanics. No reporter identity. Reporter's own case: ⋯ → Cancel report (`NEW`), Report that the animal has passed away. Small case ID (`AR-` placeholder).

### Timeouts

**REC, values NEEDS VALIDATION:** urgent → admin alert 10 min, reporter fallback 15 min; normal → 60 / 90 min; "Did it get help?" at 24 h. Demo shortens them. Movement and chat don't stop timeouts.

---

## Professional response flow

```text
🔴 Looking for help
→ 🟠 Accepted by {organisation}
→ 🟡 Help reaching in ~N min
→ Rescue team reached
→ 🔵 Reaching hospital
→ Hospital reached
→ Under treatment
→ Rescued / Could not locate / Closed — Passed away / Cancelled
```

**Organisation onboarding (D105, D118):** the platform admin reaches out to veterinary hospitals (including government veterinary hospitals), rescue organisations and shelter homes and onboards them, with their dashboard members, through a backend admin form. Only organisations that have already completed verified registration through the platform/admin process are onboarded. There is no in-app application, "application under review" flow or pending-verification dashboard. Unverified organisations cannot access the dashboard, receive cases, create food donation requests or create organisation adoption listings.

Organisations (separate dashboard) receive cases; view reporter information when appropriate and the location; accept; update professional status; post pinned official updates; coordinate rescue; record hospital arrival, treatment and outcome; confirm passed-away reports. Notifications: web push, email, dashboard inbox (SIMULATED DEMO; real infrastructure is pilot scope).

---

## Community responder flow

**CONFIRMED.** Community responders are ordinary users; no registration.

```text
Case Detail
→ Take me to the animal                 (sign-in here if not signed in, D111, D137)
→ Safety check → "I can safely help"
→ Stage 1 navigation: responder → exact animal location   (maps app hand-off; no live tracking)
→ Reach the animal
→ Check the CURRENT case status
→ If professional help is NOT active:
    Assess the animal
    → "Can you safely take this animal to a veterinary hospital?" → Yes
    → Enter / confirm mobile number   (N24; required before transport)
    → Select a registered/verified veterinary hospital   (hospitals only)
    → Call / inform the hospital
    → Confirm and start transport
    → 🔵 Responder taking animal to hospital (RESPONDER_TO_HOSPITAL)
    → Stage 2 navigation: responder + animal → selected veterinary hospital
    → Responder taps "I've arrived" (records arrival on their Transport; status unchanged)
    → Selected hospital confirms arrival → Hospital reached (D110) → Under treatment → Outcome
      (hospital never confirms: N10 — Deferred to Next Phase, D127)
→ If professional help IS active: transport/override unavailable; responder may share information in case chat
```

**Safety check:**

> **Please only approach if it is safe for you and the animal. Injured or frightened animals may behave unpredictably. If the situation is unsafe, wait for a trained rescuer.**
>
> [ I can safely help ]

### Professional help becomes active while travelling (N11, LOCKED)

- Navigation continues to the animal's exact location; "Take me to the animal"/navigation remains available.
- Official status updates normally (e.g. "Help reaching in ~5 min") and the responder is **informed that professional help is on the way**.
- The responder does not take over or change status.
- On reaching the animal, they see the **current** status before any further action. If professional help is active, transport/override actions are unavailable.

### Organisation visibility of the responder (N12, LOCKED)

- **Before** the responder starts transport to a specific hospital: no organisation or hospital sees their identity or contact.
- **After** they reach the animal, confirm safe transport, provide/confirm their mobile number, select the registered/verified veterinary hospital and confirm/start transport: **only that selected veterinary hospital** sees the responder's **name, email, mobile number, Community Responder role**, the case details, and that the responder is transporting the animal to them.
- Responder **live location is never shared**. Responder identity, contact and movement are never public, never visible to other responders, and never shared with unrelated organisations (including rescue organisations handling or alerted on the case).

### Responder mobile number (N24, LOCKED)

- *Amended by D137:* the mobile is collected at account setup (not verified), so it is already on the account. Browsing needs no account.
- **Required before community transport can start**, right after the responder says Yes to "Can you safely take this animal to a veterinary hospital?".
- The responder **confirms** the account mobile, shown read-only (D117).
- Copy: "Your mobile number is required so the veterinary hospital can contact you during transport."
- Shared **only** with the selected registered/verified veterinary hospital, **once transport officially starts**. Not publicly visible, not visible to other community responders, not on Home, not on the public case, not shared with unrelated organisations.
- No OTP at this step.

### Hospital selection and informing

- **Destination = registered/verified veterinary hospital only** (name, distance, approximate ETA). Rescue organisations and shelters are not selectable. The public Veterinary & Animal Organisations directory (which also lists rescue organisations and shelters) is for discovery only, not this workflow.
- Inform step: "You're taking this animal to: {hospital}" · animal · reason · **Call hospital** (demo: disabled) · "I have informed the hospital" · **Start transport**. The selected hospital also gets a case notification (SIMULATED DEMO).

### Not able to transport (locked) and N10 (deferred)

- **Not able to** at "Can you safely take this animal to a veterinary hospital?" → nothing changes (a responder's actions never change status); the case remains as it was (D57).
- **N10 — Deferred to Next Phase (D109):** responder unable to continue after reaching the animal or after starting transport, "I can't continue" / "Request help", transfer/handover, replacement, cancellation during community transport and related reactivation. **No MVP rule, UI or automatic status transition**; not designed.

### Movement privacy

The system never publishes movement ("Rahul is going to the animal"), responder counts or live locations.

---

## Case chat

**CONFIRMED (D101).** One chat per animal distress case. Not a general social chat.

> **Case chat is open to everyone. Anyone can view the conversation, and any signed-in user can participate by sending messages. No case involvement or prior action is required to participate.** Case actions remain permission/state based.

- **Viewing:** anyone can open and read a case chat thread. Sign-in is **not** required just to read.
- **Posting:** the user **must be signed in** (one-time email OTP account verification, D137) before sending a message. There is no anonymous posting.
- **No engagement requirement:** a signed-in user does not need to be the original reporter or a community responder, go to the animal, transport it, or take any other action on the case before chatting. There is no "Join chat" step, eligibility gate or non-participant state.
- Chatting **never** changes official case status, adds the case to My Reports, makes the user a community responder, grants responder permissions, or exposes private phone numbers, email addresses or live location. Users may voluntarily share information under the existing privacy rules.
- Shared links and the web preview **never** show case chat (D93, D108): no messages, no contact details shared in chat, no private coordination details.

**Author information shown:** first name · role (**Reporter**, **Community Responder**, **Organisation/Veterinary Hospital**) · **Blue Tick** if verified · organisation name for registered/verified organisations. Role labels appear where applicable (the case's reporter; users with a community responder record on the case; the handling organisation); other users show their first name only.

**Never auto-exposed:** phone, email, address, live location. The reporter's report phone stays private by default; the handling organisation receives it through official coordination. **Users may voluntarily share** their mobile number.

**Users may share:** text, photos, videos, location details, phone numbers. (Chat media is chat content, not report evidence; the submitted report stays locked.)

**Official messages** from the handling organisation/hospital are pinned or clearly marked at the **top**; community messages appear below.

**Case chat never changes official case status.**

**Abuse filter:** proactive filtering **before** a message is sent; supports English, Hindi, Marathi, Hinglish and Marathi-English mixed language; allows normal urgency, frustration and disagreement; restricts genuine abuse, threats, slurs and harassment. Blocked message copy:

> "Please keep the conversation respectful. Abusive or inappropriate language isn't allowed in case chats."

**Message not sent (D106):** "Message not sent" · "Check your connection and try again." · **Retry**. The unsent message stays available so nothing typed is lost.

**Flag a message:** see [Flagging case chat messages](#flagging-case-chat-messages) (D113).

---

## Flagging case chat messages

**CONFIRMED (D107, narrowed by D113).** Users can flag **individual case chat messages only**. There is no flag action on whole threads, adoption chat, adoption listings, food donation requests or directory listings. **Sign-in is required** to flag (signed-out readers are asked to sign in).

1. Select **Flag message** (the word "Report" is not used, to avoid confusion with "Report an animal in distress")
2. Select a reason: **Abusive or unprofessional language** · **False or misleading information**
3. Optional additional details
4. Submit
5. Confirmation: "Thanks for flagging this. Our team will review it."

Flagging **does not immediately remove or alter** the message; it is submitted for platform/admin review.

---

## Sharing

**CONFIRMED.** Device share sheet (WhatsApp, Telegram, Messages, etc.). **No direct WhatsApp integration.**

- **Includes:** all case evidence (1–4 photos/videos), voice note if available, animal type, reason, location, current help status, live case link.
- **Excludes:** reporter name, email, mobile, private profile information, case chat, private participant information.
- **Link:** opens Case Detail in the app where possible; otherwise a **privacy-safe web preview**. Anyone with the link can open the web preview **without signing in**.

**Shared link / web preview privacy boundary (D108, LOCKED).** The shared link communicates the case itself, not the conversation around it.

| May show | Must not show |
|---|---|
| Animal photo/evidence (and voice note where shared) | **Case-chat messages** |
| Animal type | Reporter identity |
| Reason for distress | Reporter phone number |
| **Exact animal location pin**, same as Case Detail in the app (D112) | Private participant information |
| Current official case status | Community responder identity/contact (unless explicitly intended as public case information) |
| Relevant help information | Phone numbers or other contact details voluntarily shared inside chat |
| Final outcome/status when closed | Private coordination details |
| Open in App action | |

The web preview answers what happened, where the animal is and whether help is still needed. It may say that case updates and coordination happen in the app and offer **Open in App**, but never renders the chat conversation. Inside the app, case chat follows D101 unchanged.
- **Links do not expire** while the case exists and are **not indexable** by search engines.
- **Active case:** shows the latest current status. **After closure:** shows the outcome/status, not an active emergency.
- Sharing doesn't add the case to My Reports.

---

## Notifications

**CONFIRMED (N16).** Users receive notifications **only for cases where they are directly involved:**

- cases they reported;
- cases where they became a community responder **and started transporting** the animal.

They may include: case status updates · important case changes · new case-chat messages · professional help becoming active · important responder/transport updates.

**No "Nearby animal distress" notification setting.** Nearby cases are discovered through Home Map/List. Organisation notifications are separate (dashboard inbox, web push, email). All notifications are SIMULATED DEMO in the prototype.

## My Reports

**CONFIRMED (N13).** Inside Profile. A case appears only when:

1. the user **reported** it (immediately after submission), or
2. the user became a community responder **and actually started transporting** it to a selected registered/verified veterinary hospital.

Not added for: viewing, seeing on map/list, sharing, opening, tapping Take me to the animal, reaching, assessing, saying they can help, or selecting a hospital without starting transport.

My Reports means: **cases I reported** and **cases I personally transported to care**.

---

## Animal cannot be found

The organisation can call the reporter and use the case chat; the case stays active while searching. If not found, it closes as **Could not locate**, stays on Home for **2 hours** with chat open for location information, then leaves Home and remains in history/My Reports. It is **not** automatically reopened; reactivation is **N10 — Deferred to Next Phase**.

## Animal passes away

- Reporter, community responder, organisation or hospital may **report** "Passed away".
- A reporter/responder report becomes **Passed away — awaiting confirmation** (`death_reported_pending`; status unchanged). They can report the death and provide evidence/details, but **cannot independently confirm** the final outcome.
- **While pending (N7a, D100, LOCKED):** stays visible on Home; never silently removed; normal help/emergency actions for the current status remain available.
- A registered/verified **veterinary hospital or animal rescue organisation** **confirms** → **Closed — Passed away**; removed from Home; history and timestamps kept. Such an organisation's own report is itself the confirmation.
- **No organisation available:** the case **remains pending**. Admin review/escalation may be defined later; nothing is defined now.
- Never silently overwrite an existing professional outcome/history.

---

## Veterinary & Animal Organisations directory

**CONFIRMED (N14, D102).** **Public:** anyone can browse it without sign-in through a public entry point (Home, D128); it is not linked from Profile (D138). Lists registered/verified **veterinary hospitals**, **animal rescue organisations** and **animal shelter homes** with name, organisation type, registered/verified status, location, distance, address, contact information, services, and availability/opening where applicable. **Informational/discovery only**, not the emergency workflow. Community transport selection uses only registered/verified **veterinary hospitals**, within the transport flow (D99). (The no-response fallback in Case Detail may still list nearby helplines and vets for calling.)

---

## Adoption

**CONFIRMED (N20).** Secondary, separate from emergency cases and outside the emergency lifecycle.

- **Who:** ordinary users and registered/verified organisations (signed in).
- **Fields:** photos · animal type (Dog / Cat / Other) · name if known · approximate age · gender · location · short description · temperament/behaviour · special needs if any · vaccination status (Vaccinated / Partially vaccinated / Not vaccinated / Unknown) · optional vaccination details · adoption requirements · poster information. **Required (D135):** photos (1+), animal type, approximate age, gender (Male / Female / Unknown), location, description, vaccination status; the rest optional.
- **Status:** **Available** or **Adopted** only.
- **Action:** **Chat with poster.** The poster's phone number is never publicly displayed; people may voluntarily share contact details in chat.
- **My Adoption Listings (D103):** in Profile; posters view their own listings, edit them, see status, mark Adopted, **remove** a listing (D126) and open the conversations for each listing. Verified organisations manage their listings in the dashboard.
- **Interested users (D125)** return to a conversation by reopening the listing and tapping Chat with poster; there is no separate adoption-chat list.
- Never on the emergency distress map/list.

## Food donations

**CONFIRMED (N21).** Secondary, **product-based**. Not generic cash donation, arbitrary money transfer, or volunteer-created requests.

- **Who can create requests:** registered/verified veterinary hospitals, animal rescue organisations and animal shelter homes (D120). Individual users/volunteers and unverified organisations cannot.
- **Who can contribute:** any signed-in user (account required, D115); every donation appears in their My Food Donations.
- The organisation specifies the actual products needed.

```text
Lumen Animal Rescue & Shelter
🐾 Food Donation Request
Help feed 35 rescued cats and dogs.

Select one product to donate
🐱 Whiskas Dry Cat Food — 1 kg   ₹XXX
🐱 Whiskas Dry Cat Food — 3 kg   ₹XXX
🐱 Whiskas Dry Cat Food — 5 kg   ₹XXX

[ Choose & Donate ]
```

**Flow:** Donation request → select one product → confirm quantity → payment → donation placed → product delivered to the organisation's **registered address** → organisation marks the request **fulfilled**.

**Build class:** request, product selection and fulfilment are REAL PROTOTYPE; **payment and delivery are SIMULATED DEMO** (no real payments or logistics in the prototype). Product names and prices in the demo are illustrative placeholders (`₹XXX`).

**My Food Donations (D104):** in Profile. Statuses (D124): payment **Paid / Failed**; delivery **Order placed → Out for delivery → Delivered**; fulfilment **Open / Fulfilled** (from the request). Donation history; each donation opens to show its current status with, where applicable, organisation, product, quantity, donation amount, payment status, donation date, delivery status and fulfilment status. Payment and delivery statuses are simulated in the prototype.

---

## Blue Tick — Responsible Reporter

**CONFIRMED (D81, D82).** The only recognition. Stars, points, StarTransaction, badge thresholds, rankings, streaks, leaderboards and scores are removed.

- **Granted and revoked only by the platform/admin.** Never automatic; no numerical score or formula.
- **Eligibility may consider:** genuine distress reports · accurate/useful information · appropriate system use · no repeated misuse/spam/fabricated reports/abuse.
- **Revocation** sets `NOT_VERIFIED`.
- **Meaning:** "Verified by the platform as a responsible reporter." Not a professional rescuer, veterinarian, NGO or government representative, or trained emergency responder.
- **Shown:** Profile ("Responsible Reporter ✓ · Recognised for responsible animal distress reporting.") and next to verified participants' names in case chat.
- **Not shown:** Home map, Home case cards, adoption listings, rankings or comparative surfaces.
- **No special permissions.**

## Your Impact

**CONFIRMED (N15).** Factual contribution summary in Profile:

- Distress cases reported
- Animals transported to care
- Adoption listings created
- Food donations contributed/arranged

**Not shown:** cases successfully resolved, Stars, points, rankings, leaderboards, badges, streaks, scores, comparative metrics. **Your Impact never determines Blue Tick eligibility.**

---

## Failure scenarios

| Scenario | Behaviour |
|---|---|
| Nobody accepts | Timeout → admin alert → reporter fallback (nearby helplines/vets; demo calls disabled); case stays Looking for help and on Home. "Did it get help?" at 24 h. |
| Team can't find the animal | Organisation calls reporter / uses chat; closes Could not locate; on Home for 2 h; no automatic reopening (N10). |
| Location wrong | Organisation corrects pin (logged). |
| Animal has died | Passed away — awaiting confirmation (on Home; help actions remain) → confirmed by a verified veterinary hospital or rescue organisation → Closed — Passed away; no organisation available → stays pending (D100). |
| Organisation releases | Back to Looking for help; re-alert. |
| Responder can't safely transport | No change. |
| Professional accepted while responder travelled | Navigation continues; responder informed; at the animal, transport/override unavailable (N11). |
| Responder can't continue (after reaching or during transport) | **N10 — Deferred to Next Phase** (D109). No MVP behaviour defined. |
| Chat claims progress | No status change. |
| Abusive chat message | Blocked before sending with the respectful-conversation message. |
| No network | Error with retry; draft kept. Offline queue is FUTURE ARCHITECTURE. |

---

## Journeys

Set in Mumbai. All organisations are fictional (e.g. **Lumen Animal Rescue & Shelter**, a registered shelter home onboarded by the admin (D119); **Lumen Animal Rescue & Vet Care** as a fictional registered hospital). Calls are disabled and notifications simulated in the prototype.

1. **Report (MVP).** Priya browses Home, taps Report an animal in distress, sets up her account (name, email, mobile, then the code sent to her email), adds a photo and voice note, confirms location, her account mobile is shown → Report sent → case appears in My Reports; she's notified when Lumen Animal Rescue & Shelter accepts.
2. **Organisation (MVP).** Staff accept, set "~8 min", post a pinned official update, mark Rescue team reached → Reaching hospital → Hospital reached → Under treatment → Rescued.
3. **Community transport (MVP).** Rahul (signed in) taps Take me to the animal on a Looking for help case, passes the safety check, navigates (status unchanged), reaches the dog, confirms safe transport, confirms his mobile number, selects a registered veterinary hospital, calls it, starts transport → Responder taking animal to hospital. Only now does that hospital (and no one else) see his name, email, mobile and role; the case is added to his My Reports and he gets notifications.
4. **Professional becomes active while travelling (MVP, N11).** While Rahul travels, Lumen accepts; he's told help is on the way, navigation continues, and at the animal transport is unavailable. He shares what he sees in case chat (open to everyone).
5. **Duplicate (MVP).** "I can take this animal to a hospital" opens the existing case; responder flow only if still Looking for help.
6. **Passed away (MVP).** Reporter reports → awaiting confirmation → Lumen Animal Rescue & Vet Care (hospital) confirms → Closed — Passed away. (Lumen Animal Rescue & Shelter is a shelter and does not confirm, D100, D119.)
7. **Adoption (MVP, secondary).** Neha lists a kitten (Available, vaccination status Unknown); interested people chat with her; she manages it from Profile → My Adoption Listings and marks it Adopted.
8. **Food donation (MVP, secondary).** Lumen Animal Rescue & Shelter (a registered shelter home, D119) posts a request for Whiskas products; Arjun chooses the 3 kg pack, confirms quantity, pays (simulated); delivery to the registered address (simulated); Lumen marks fulfilled. Arjun opens Profile → My Food Donations to see its status; his Your Impact shows one food donation.
9. **Sterilisation (FUTURE, V1.5).** Not in MVP.
