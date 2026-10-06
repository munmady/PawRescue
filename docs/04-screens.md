# 04 · Screens

**Build class** (see [01-product.md](01-product.md#prototype-classification)): screens are **REAL PROTOTYPE** populated with **SIMULATED DEMO** data unless marked otherwise. Demo mode is SIMULATED DEMO. This is the **screen inventory and UX architecture**, not visual design.

Screen IDs are stable references for wireframes. Existing wireframe IDs from [wireframes/01-citizen-reporting.md](../wireframes/01-citizen-reporting.md) are shown in brackets (e.g. W9).

Rules for every screen:

- **Calls are disabled in the demo** ("Demo — calling is disabled in this prototype."). No real phone numbers.
- **Notifications are simulated** (labelled in-app demo notifications); no real push/email.
- **No social layer:** no likes, comments, posts, open social feeds, activity feeds, leaderboards, rankings, points or browsable public case pages. (Case chat is case-scoped and open to everyone, D101; it is not a social feed.)
- **Reporter and responder identity/contact/live location are never shown publicly.**
- **Flag message:** only individual case chat messages can be flagged (STATE-R01, D113). Adoption listings, food donation requests and directory listings have no flag/report action. Flagging never removes or alters the message.
- **Case Detail is one screen.** Its status/action area changes through the lifecycle (STATE-L01–L12); statuses are not separate screens.

## Navigation

### Mobile app: LOCKED

```
┌──────────────────────────────────────┐
│ 🏠 Home │ 🐾 Adoption │ (● Report) │ 🛍 Donation │ 👤 Profile │
└──────────────────────────────────────┘
```

- **Home, Adoption, (Report), Donation, Profile** (D139, D140; was Home and Profile only, D48). The centre Report is a raised action button that opens REPORT-01, not a tab. Adoption = ADOPT-01, Donation = FOOD-01. My Reports, My Adoption Listings and My Food Donations are inside Profile, not tabs.
- No Report, Responder, Community, Rewards, Adoption, Donations or Chat tabs.
- Case chat is reached from Case Detail; adoption chat from a listing or My Adoption Listings; food donations from Home.
- The **Veterinary & Animal Organisations directory is public** (D102): it has a public entry point usable without sign-in; it is not linked from Profile (D138). Its public entry point is **Home section 5**, after food donations: "Find veterinary hospitals & animal organisations" (D128). **Help & Safety is also public** (D129).

### Organisation dashboard (separate; verified organisations only)

**Inbox · Confirmations · Food donation requests · Adoption listings · Team · Settings**

Only already registered/verified veterinary hospitals, rescue organisations and shelter homes, onboarded by the platform/admin, can access the dashboard. **There is no in-app application or pending-verification state** (D105).

### Admin

**Live operations · Cases · Organisations · Users & flags · Flagged messages & moderation · Blue Tick · Content**

---

## A. Public / Browse (no sign-in)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| PUBLIC-01 | Welcome [W0] | First-time user | One short value screen | First launch only | Get started | PUBLIC-02 |
| PUBLIC-02 | Home · List [H3/H4, wireframes/01-home] | Anyone | 1 Nearby animals in distress (~5 km) · 2 Report an animal in distress · 3 Adoption · 4 Food donations · 5 Directory link (D128) and Help & Safety (D129). Distress cards: photo/video, type, location, reason, status, distance, view, navigation where appropriate, Share; no Blue Tick | App open | Open a case | PUBLIC-04, REPORT-01, ADOPT-01, FOOD-01 |
| PUBLIC-03 | Home · Map [H1/H2, wireframes/01-home] | Anyone | Same dataset as the list: exact-location pins with status labels, preview card. No adoption listings or food requests | Map/List toggle | Open a case | PUBLIC-04 |
| PUBLIC-04 | Case Detail [W9] | Anyone | Action-first: what happened, where is the animal, does it still need help. ← Animal in distress · ⋯; large photo (swipe all 1–4; voice note); status; animal; location + distance; what happened; status/action area; reported time; Share; Case chat. No likes, comments or feed | Card, pin, share link, My Reports, notification | Status-dependent (STATE-L01–L12) | RESP-01, CHAT-01, STATE-O10 |
| PUBLIC-05 | Web case preview [WEB1] | Anyone with the link (no sign-in) | Privacy-safe (D108): evidence, voice note, animal type, reason, **exact animal location pin, same as the app (D112)**, **current** official status (active) or **final outcome** (closed), relevant help information; may note that updates/coordination happen in the app. **Never** case-chat messages, contact details shared in chat, reporter identity/phone, private participant info, responder identity/contact or private coordination details. Not indexed; no expiry while the case exists | Shared link | **Open in App** | App: PUBLIC-04 |
| PUBLIC-06 | Adoption list (= ADOPT-01) | Anyone | Browse listings | Adoption tab (D139); Home section | Open | PUBLIC-07 |
| PUBLIC-07 | Adoption listing detail (= ADOPT-02) | Anyone | View a listing | PUBLIC-06 | Chat with poster | AUTH-01 → ADOPT-05 |
| PUBLIC-08 | Food donation requests (= FOOD-01) | Anyone | Discover verified organisations' product requests | Donation tab (D139); Home section | Open | FOOD-02 |
| PUBLIC-09 | Veterinary & Animal Organisations directory [DIR1/DIR2] | Anyone (no sign-in; Home section 5, D128) | Verified veterinary hospitals, rescue organisations and shelter homes: name, organisation type, registered/verified status, location, distance, address, contact, services, availability/opening where applicable. Informational/discovery only; **not** an emergency workflow and **not** the transport destination picker. | Public entry point (Home section 5); not linked from Profile (D138) | Call (demo: disabled) | — |
| PUBLIC-10 | Help & Safety (= PROFILE-06) [HS1] | Anyone (no sign-in) | First-aid and safety guide (subject to vet review, A9) | Home (near the directory link), Safety check, Profile | Read | — |

## B. Authentication (one-time email OTP account verification, D137)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| AUTH-01 | Sign-in prompt (sheet) [WA1] | Signed-out user | Shown in context when an account action starts: report, Take me to the animal (D111), posting/flagging in case chat, adoption listing/chat, food donation, Profile | Any gated action | Continue | AUTH-04 |
| ~~AUTH-02~~ | ~~Google account chooser~~ | — | **Retired (D114, D137).** No Google-only sign-in | — | — | — |
| AUTH-03 | Sign-in failure (D106) [WA5] | Signed-out user | Title **"Sign-in didn’t work"** · Message **"We couldn’t sign you in. Please try again."** | AUTH-04/05 fails | **Try Again** | AUTH-04 |
| AUTH-04 | Account setup: Name → Email → Mobile [WA2] | Signed-out user | Name (required; not a full/legal name), any valid email address, mobile number (required; contact info, not verified) | AUTH-01 | Send code (to the email) | AUTH-05 |
| AUTH-05 | Email OTP [WA3] | Signed-out user | Enter the one-time code sent to the **email** (SIMULATED DEMO: no real email). Completes the one-time setup; the user stays signed in | AUTH-04 | Verify | Original action resumes |
| ~~AUTH-06~~ | ~~Complete sign-up~~ | — | **Retired (D137).** The name is collected first, in AUTH-04 | — | — | — |

Flow: **Name → Email → Mobile → Email OTP → signed in** (D137). No passwords, no Google-only sign-in, no phone/SMS OTP, no email magic links. Applies to citizens and organisation dashboard members. The account mobile is shown on reports (REPORT-07) and confirmed before community transport (RESP-05); it is not an authentication factor. **Not yet specified:** signing back in after Logout or on a new device, account recovery, account uniqueness, profile editing.

## C. Animal distress reporting (sign-in required)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| REPORT-01 | Report entry | Anyone | "Report an animal in distress" on Home | Home | Tap | AUTH-01 if needed → REPORT-02/03 |
| REPORT-02 | Location explainer (sheet) [W2] | Reporter | First time location is needed; clear reason, no manipulative language | REPORT-01 | Allow location / Not now | REPORT-03 |
| REPORT-03 | Media · capture [W3a] | Reporter | Photos/videos; gallery | REPORT-01 | Shutter | REPORT-04 |
| REPORT-04 | Media · evidence tray [W3b] | Reporter | 1–4 items, "x / 4", remove; Add evidence disabled at 4 | REPORT-03 | Continue (1+ items) | REPORT-05 |
| REPORT-04a | Media · full-screen preview [W3c] | Reporter | Inspect/remove one item | Tray item | Remove / Back | REPORT-04 |
| REPORT-04b | Safety fallback (sheet) [W3d] | Reporter | "I can't safely take a photo or video", explicit confirmation → `no_media` | REPORT-03/04 | Continue without media / Go back | REPORT-05 |
| REPORT-05 | What's wrong? [W4] | Reporter | Species, problem chips, optional **Tell us what you saw** composer (text + voice note: playback, delete, re-record) | REPORT-04 | Continue | REPORT-06 |
| REPORT-06 | Where is it? [W5] | Reporter | Map pin, current location, search, landmark | REPORT-05 | Continue | REPORT-07 |
| REPORT-07 | Mobile number & Send [W6] | Reporter | Required; shows the account mobile from setup, read-only (no edit, D117); privacy line; summary with ‹ Edit ›. No OTP at this step | REPORT-06 | **Send report** | STATE-D01 or REPORT-08 |
| REPORT-08 | Report sent [W8] | Reporter | Safety block; optional help ("Not able to" equal weight); "These are optional. It's okay to leave."; What happens next (DEMO) | Send / "This is a different animal" | **View your report** (✕ → Home) | PUBLIC-04 |
| REPORT-08a | Notification explainer (sheet) [W8a] | Reporter | From "Turn on updates" only; SIMULATED DEMO; no real permission request | REPORT-08 | Turn on / Not now | REPORT-08 |

Report states (validation, permissions, errors): STATE-P02–P05, STATE-E01–E04, STATE-C01–C03.

## D. Community responder (no registration; sign-in at Take me to the animal, D111)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| RESP-01 | Take me to the animal [R1] | Any user (sign-in required at this tap, D111) | Start helping (Looking for help; also available while professional help is active, without transport/override, N11) | PUBLIC-04 | Tap | AUTH-01 if needed → RESP-02 |
| RESP-02 | Safety check (sheet) [R2] | Responder | Locked safety copy | RESP-01 | **I can safely help** | RESP-03 |
| RESP-03 | Stage 1 navigation [R3] | Responder | Maps hand-off to the exact animal location; no live tracking; banner if professional help becomes active (STATE-W03) | RESP-02 | I've reached the animal | RESP-04 |
| RESP-04 | At the animal: status check + assess [R4a/R4b] | Responder | Shows the **current** status first. Looking for help → assess; professional active → transport/override unavailable (STATE-W04) | RESP-03 | Continue | RESP-05a / case chat |
| RESP-05a | "Can you safely take this animal to a veterinary hospital?" [R5] | Responder | Decision | RESP-04 | Yes / Not able to | RESP-05 / STATE-C08 |
| RESP-05 | Mobile number (N24) [R6] | Responder | Confirm the account mobile, shown read-only (D117). "Your mobile number is required so the veterinary hospital can contact you during transport." Shared only with the selected veterinary hospital once transport starts. No OTP | RESP-05a → Yes | Continue | RESP-06 |
| RESP-06 | Select veterinary hospital [R7] | Responder | Registered/verified **veterinary hospitals only**: name, distance, approximate ETA. Rescue organisations and shelters are not listed | RESP-05 | Select | RESP-07 |
| RESP-07 | Inform hospital & start transport [R8] | Responder | "You're taking this animal to: {hospital}", Call hospital (demo: disabled), "I have informed the hospital" | RESP-06 | **Start transport** → `RESPONDER_TO_HOSPITAL` | RESP-08 |
| RESP-08 | Stage 2 navigation [R9] | Transporter | Responder + animal → selected veterinary hospital; maps hand-off. The arrival tap records arrival only; the case shows Hospital reached once the hospital confirms (D110). Hospital never confirms: N10 — Deferred to Next Phase (D127) | RESP-07 | I've arrived | PUBLIC-04 |
| RESP-09 | Treatment/outcome visibility [R10] | Transporter | Not a separate screen: Case Detail + notifications + My Reports | Notification / My Reports | View | PUBLIC-04 |

**N10 — Deferred to Next Phase** (D109): responder unable to continue after reaching the animal or after starting transport, "I can't continue" / "Request help", transfer/handover, replacement responder, cancellation during community transport and related reactivation. **No MVP screen, state or automatic status transition.**

## E. Case chat (open to everyone, D101)

> Case chat is open to everyone. Anyone can view the conversation, and any signed-in user can participate by sending messages. No case involvement or prior action is required to participate.

Viewing needs no sign-in. Sending a message requires a signed-in account (D137); there is no anonymous posting.

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| CHAT-01 | Chat entry | Anyone (no sign-in to view) | "Case chat" on Case Detail opens the thread directly for reading; **no eligibility gate, no Join chat, no non-participant state** | PUBLIC-04 | Open | CHAT-02 |
| CHAT-02 | Case chat [W10] | View: anyone · Post: signed-in users only (D137) | One thread per case. Pinned **official updates** at top; community messages below; composer (signed-out users are asked to sign in when they try to send) | CHAT-01, notification | Send | AUTH-01 if signed out, then the message is sent |
| CHAT-03 | Author labels | Everyone | First name; role label where applicable (**Reporter / Community Responder / Organisation/Veterinary Hospital**); Blue Tick if verified (tooltip: "Verified by the platform as a responsible reporter."); organisation name | In CHAT-02 | — | — |
| CHAT-04 | Official update area | Everyone | Pinned, persistent, visually distinct; "No official updates yet" when empty | In CHAT-02 | — | — |
| CHAT-05 | Attachments | Sender | Photos, videos, location details (chat content, not report evidence) | Composer | Attach / Send | CHAT-02 |
| CHAT-06 | Voluntary phone sharing | Sender | Users may type their own number; the system never inserts phone, email, address or live location | Composer | Send | CHAT-02 |
| CHAT-07 | Message blocked (pre-send filter) | Sender | "Please keep the conversation respectful. Abusive or inappropriate language isn't allowed in case chats." Text kept in the composer | Send | Edit | CHAT-02 |
| CHAT-08 | Message not sent (D106) | Sender | Title **"Message not sent"** · Message **"Check your connection and try again."** The unsent message stays available so nothing typed is lost | Send fails | **Retry** | CHAT-02 |
| CHAT-09 | Flag message | Signed-in users (AUTH-01 if signed out) | STATE-R01 (D113) | Message menu | **Flag message** | CHAT-02 |
| CHAT-10 | Empty / loading | Everyone | Empty: "Share anything that helps the rescue team find this animal." Loading: skeleton | — | — | — |

Chatting never changes case status, never adds the case to My Reports and never makes anyone a responder.

## F. Profile (sign-in required)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| PROFILE-01 | Profile [P1] | Signed-in user | Basic account info (email, name); links to everything below | Profile tab (AUTH-01 if needed) | Open a section | Below |
| PROFILE-01a | Responsible Reporter ✓ (section) | Verified users | "Recognised for responsible animal distress reporting." Only when `VERIFIED`; no progress or "earn" UI | PROFILE-01 | — | — |
| PROFILE-01b | Your Impact (section) | Signed-in user | Distress cases reported · animals transported to care · adoption listings created · food donations contributed/arranged | PROFILE-01 | — | — |
| PROFILE-01c | Mobile (view only) | Signed-in user | Given at account setup; not verified; coordination only; cannot be changed (D117) | PROFILE-01 | — | — |
| PROFILE-02 | My Reports [P2] | Signed-in user | Cases I reported + cases I personally transported to care; active and closed (incl. cancelled; never deleted). Opening one shows Case Detail (no separate history screen) | PROFILE-01 | Open a case | PUBLIC-04 |
| PROFILE-03 | My Adoption Listings (= ADOPT-06) | Listing creators | Own listings with status (Available/Adopted); edit; mark Adopted; remove (D126); conversations per listing | PROFILE-01 | Open listing / conversations | ADOPT-02, ADOPT-03, ADOPT-05 |
| PROFILE-04 | My Food Donations (= FOOD-06) | Donors | Donation history | PROFILE-01 | Open a donation | PROFILE-04a |
| PROFILE-04a | Donation detail (= FOOD-06a) | Donor | Organisation, product, quantity, amount, payment status, date, delivery status, fulfilment status (current status) | PROFILE-04 | — | PROFILE-04 |
| PROFILE-05 | Notification settings | Signed-in user | Updates for cases I reported or transported; no "Nearby animal distress" setting (SIMULATED DEMO) | PROFILE-01 | Toggle | — |
| PROFILE-06 | Help / Safety (= PUBLIC-10) | Anyone | First-aid and safety guide (subject to vet review); public (D129); also linked from Profile | PROFILE-01 | Read | — |
| PROFILE-07 | Privacy | Signed-in user | What's stored and who sees it. Export/delete: FUTURE ARCHITECTURE | PROFILE-01 | Read | — |
| PROFILE-08 | Terms | Signed-in user | Portfolio demo notice | PROFILE-01 | Read | — |
| PROFILE-09 | ~~Directory link~~ *Retired by D138: Profile no longer links to the directory (PUBLIC-09 is reached from Home).* | — | — | — | — | — |
| PROFILE-10 | Logout | Signed-in user | Sign out (how to sign back in is not yet specified) | PROFILE-01 | Log out | PUBLIC-02 |

No Stars, points, badges, achievements, rankings, streaks or comparisons.

## G. Adoption (secondary; never on the distress map/list)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| ADOPT-01 | Adoption list (= PUBLIC-06) [AD1] | Anyone | Cards: photo, type, name, age, area, status (Available/Adopted). No Blue Tick | Home section | Open | ADOPT-02 |
| ADOPT-02 | Listing detail (= PUBLIC-07) [AD2] | Anyone | Photos, type, name, approximate age, gender, location, description, temperament, special needs, vaccination status (Vaccinated / Partially vaccinated / Not vaccinated / Unknown) + optional details, adoption requirements, poster information. **No poster phone shown.** Poster sees Edit / Mark Adopted. | ADOPT-01, PROFILE-03 | **Chat with poster** | AUTH-01 → ADOPT-05 |
| ADOPT-03 | Create / edit listing [AD3] | Users; verified organisations (dashboard: ORG-09) | All fields above; required: photos (1+), type, approximate age, gender, location, description, vaccination status (D135) | Adoption list "Create listing"; ADOPT-02/ADOPT-06 (poster) | Publish / Save | ADOPT-02 |
| ADOPT-04 | Mark Adopted [AD4] | Poster | Status Available → Adopted | ADOPT-02, ADOPT-06 | Mark Adopted | ADOPT-02 |
| ADOPT-05 | Adoption chat [AD5] | Interested user ↔ poster | Interested users return via the listing (D125). Messages; contact details only if voluntarily shared; same abuse filter and Message not sent state | ADOPT-02, ADOPT-06 | Send | — |
| ADOPT-06 | My Adoption Listings (= PROFILE-03) [AD6] | Poster | Manage own listings and their conversations; remove a listing (D126) | Profile | Open / Edit / Mark Adopted / Remove | ADOPT-02–05 |

No pet-management functionality.

## H. Food donations (secondary; product-based)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| FOOD-01 | Food donation requests (= PUBLIC-08) [FD1] | Anyone | Request cards from verified veterinary hospitals, rescue organisations and shelter homes (D120) (name, need, e.g. "Help feed 35 rescued cats and dogs") | Home section | Open | FOOD-02 |
| FOOD-02 | Request detail [FD2] | Anyone | Organisation, request text, product options with size and price (₹XXX), "Select one product to donate" | FOOD-01 | **Choose & Donate** | AUTH-01 → FOOD-03 |
| FOOD-03 | Confirm quantity [FD3] | Donor | Selected product, quantity | FOOD-02 | Continue | FOOD-04 |
| FOOD-04 | Payment [FD4] | Donor | SIMULATED DEMO payment. Failed: "Payment didn't go through. You haven't been charged. Try again." (D135) | FOOD-03 | Pay | FOOD-05 |
| FOOD-05 | Donation placed [FD5] | Donor | Delivered to the organisation's registered address (SIMULATED DEMO delivery) | FOOD-04 | Done | FOOD-02 / PROFILE-04 |
| FOOD-06 | My Food Donations (= PROFILE-04) [FD6] | Donor | Donation history | Profile | Open a donation | FOOD-06a |
| FOOD-06a | Donation detail (= PROFILE-04a) | Donor | Current status (D124): payment Paid/Failed · delivery Order placed → Out for delivery → Delivered · fulfilment Open/Fulfilled | FOOD-06 | — | — |
| FOOD-07 | Request fulfilled (variant of FOOD-02) | Anyone | Organisation marked the request fulfilled; no longer accepts donations | Organisation action | — | — |

No generic cash donation, no free-amount transfers, no user-created requests.

## I. Organisation / veterinary hospital dashboard (verified organisations only)

| ID | Screen / State | User | Purpose | Entry Point | Primary Action | Exit / Next |
|---|---|---|---|---|---|---|
| ORG-01 | Sign in [O1] | Members of verified organisations | One-time email OTP account verification (D137); no password, no SMS OTP, no magic link. Accounts not linked to a verified organisation get no dashboard access: "This account isn't linked to a registered organisation. Contact the platform team if you think this is a mistake." (D134) | Dashboard URL | Continue | ORG-03 |
| ~~ORG-02~~ | ~~Apply to join~~ | — | **Retired (D105).** No in-app application, "application under review" or pending-verification dashboard. Organisations are verified and onboarded through the platform/admin process outside the app | — | — | — |
| ORG-03 | Inbox [O3] | Staff | New nearby / Ours / Closed; list + map; realtime. Empty: "No new cases near you right now." (D134) | Sign-in, alert | Open case | ORG-04 |
| ORG-04 | Case detail [O4] | Staff | Full evidence, location, reporter information when appropriate (incl. mobile); case chat with **Post official update** (pinned); Next step: Accept → On the way (approximate ETA) → Rescue team reached → Reaching hospital → Hospital reached → Under treatment → Close | ORG-03 | Next step | ORG-O1–O6 |
| ORG-05 | Incoming transport [O5] | **Selected veterinary hospital only** | Case details; responder **name, email, mobile, Community Responder role** (only after transport started; no live location) | Transport start (simulated alert) | **Confirm arrival** (sets Hospital reached, D110) → Under treatment → Close | ORG-04 |
| ORG-06 | Confirmations [O6] | Staff | Passed-away reports (confirmed by verified veterinary hospitals and rescue organisations, D100); transport arrivals; outcomes | Dashboard nav | Confirm | ORG-04 |
| ORG-07 | Case chat (organisation view) [O7] | Staff | CHAT-02 plus the official-update composer | ORG-04 | Post official update | — |
| ORG-08 | Food donation requests [O8] | Verified veterinary hospitals, rescue organisations and shelter homes (D120) | Create request (products, sizes, prices, need text), see contributions, **mark fulfilled** | Dashboard nav | Create / Mark fulfilled | — |
| ORG-09 | Adoption listings [O9] | Verified organisations | Create/edit, mark Adopted, chats (the organisation's equivalent of My Adoption Listings) | Dashboard nav | — | — |
| ORG-10 | Team / Settings [O10] | Org admin | Members: add / remove staff by email + mobile (D133); radius, services, hours, registered address, public profile | Dashboard nav | Save | — |

**Organisation overlays:** ORG-O1 Accept / Decline · ORG-O2 Set approximate ETA · ORG-O3 Release (reason required; back to Looking for help; re-alert) · ORG-O4 Close with outcome · ORG-O5 Confirm Passed away · ORG-O6 Cancel (e.g. `not_genuine`) / correct location pin (logged) · ORG-O7 Install & alerts prompt (SIMULATED DEMO; no real permission request).

Organisation notifications: dashboard inbox, web push, email (SIMULATED DEMO).

## Admin

| ID | Screen | Purpose / key components |
|---|---|---|
| ADMIN-01 | Live operations | Unaccepted cases: timers, alerts, nearby organisations, active transports, pending passed-away confirmations (view only; with no organisation available they stay pending; admin review/escalation not yet defined, D100) |
| ADMIN-02 | Cases | Reassign, cancel. No reopen in the MVP (D123; N10 — Deferred to Next Phase) |
| ADMIN-03 | Organisations | Onboard organisations (incl. government veterinary hospitals) and their dashboard members through the backend admin form (D118); verification state (incl. shelters); suspend; directory visibility; food-request eligibility. No in-app applications (D105) |
| ADMIN-04 | Users & flags | Block/unblock |
| ADMIN-05 | Flagged messages & moderation | Flagged case chat messages with reason and details (D113); abuse-filter logs; adoption/food/directory content moderated by admin directly; review and act |
| ADMIN-06 | Blue Tick | Grant / revoke Responsible Reporter; user reporting history, status, audit. No scores |
| ADMIN-07 | Content | Safety text editor |

---

## J. States and overlays

| ID | State | Where | Behaviour / copy |
|---|---|---|---|
| **Permissions** | | | |
| STATE-P01 | Location explainer | REPORT-02 | Allow location / Not now |
| STATE-P02 | Location off (Home) | PUBLIC-02/03 | "Turn on location to see animals near you" + set location on map |
| STATE-P03 | Locating / low accuracy / location off | REPORT-06 | "Finding your location…" · "Your location is approximate. Drag the pin to the exact spot." · search or pick on map |
| STATE-P04 | Camera denied | REPORT-03 | "Camera access is off" + Choose from gallery + safety fallback link |
| STATE-P05 | Microphone denied | REPORT-05 composer | Text still available |
| STATE-P06 | Notification explainers | REPORT-08a, ORG-O7 | Simulated; never a real OS/browser permission request |
| **Loading** | | | |
| STATE-G01 | Skeletons / progress | Home, My Reports, chat, lists | Skeleton cards; "Sending your report…" |
| **Empty** | | | |
| STATE-M01 | Empty Home | PUBLIC-02 | "No animals near you need help right now." + Report |
| STATE-M02 | Empty My Reports | PROFILE-02 | "No reports yet. Cases you report or take to care will appear here." |
| STATE-M03 | Chat empty / no official updates | CHAT-02 | See CHAT-04, CHAT-10 |
| STATE-M04 | Empty adoption, food requests, directory, My Adoption Listings, My Food Donations | Lists | (D130) Adoption: "No animals listed for adoption near you right now." · Food requests: "No food donation requests right now." · Directory: "No organisations listed near you yet." · My Adoption Listings: "You haven't listed an animal for adoption." · My Food Donations: "You haven't donated food yet." |
| **Errors** | | | |
| STATE-E01 | Invalid mobile number | AUTH-04 (account setup only; the number is fixed afterwards, D117) | "Check the number. It should be 10 digits." |
| STATE-E02 | Report send failed | REPORT-07 | "That didn't send. Your report is saved. Try again." |
| STATE-E03 | No network | Anywhere | Error with retry; draft kept. Offline queue is FUTURE ARCHITECTURE |
| STATE-E04 | Media limits | REPORT-04 | 0 items: "Add at least 1 photo or video." · 4 items: "Maximum 4 reached. Remove one to add another." · gallery over 4: "Only 4 can be added." |
| STATE-E05 | Cancel blocked | STATE-C04 | "A rescue team has just accepted this report, so it can no longer be cancelled here." |
| STATE-E06 | Sign-in failure | AUTH-03 | "Sign-in didn’t work" · "We couldn’t sign you in. Please try again." · Try Again |
| STATE-E08 | Wrong / expired email code | AUTH-05 [WA3] | Wrong: "That code isn't right. Check it and try again." · Expired: "This code has expired. Tap Resend code to get a new one." (D131) |
| STATE-E07 | Message not sent | CHAT-08, ADOPT-05 | "Message not sent" · "Check your connection and try again." · Retry; message kept |
| **Confirmations / dialogs** | | | |
| STATE-C01 | Discard this report? | Report flow | Discard / Keep reporting |
| STATE-C02 | Replace your voice note? | REPORT-05 | |
| STATE-C03 | Safety fallback | REPORT-04b | |
| STATE-C04 | Cancel report [W9b] | Reporter's own case, `NEW` only | Neutral; records `cancelled_by_reporter` |
| STATE-C05 | Animal passed away [W9c] | Reporter/responder ⋯ | Does not close the case |
| STATE-C06 | Demo call disabled | Any call action | "Demo — calling is disabled in this prototype." |
| STATE-C07 | Start transport | RESP-07 | |
| STATE-C08 | Not able to transport | RESP-05a | "That's okay. The case stays open for rescue teams." |
| **Flag message (D113)** | | | |
| STATE-R01 | Flag message (sheet) | Individual case chat messages only; signed in | 1 **Flag message** → 2 reason: "Abusive or unprofessional language" · "False or misleading information" → 3 optional details → 4 Submit → 5 "Thanks for flagging this. Our team will review it." Message is not removed or altered; platform/admin review |
| **Warnings / special flows** | | | |
| STATE-W01 | Safety check | RESP-02 | Locked copy |
| STATE-W02 | Sensitive media | Evidence everywhere | Blurred until tapped |
| STATE-W03 | Professional help became active while travelling (N11) | RESP-03 | "Professional help is on the way. You can continue to the animal and share what you see." |
| STATE-W04 | Professional help already active at the animal | RESP-04 | Transport/override unavailable; case chat available |
| STATE-D01 | Possible duplicate (sheet) [W7] | After Send | "We may already have this animal's case." · View existing case · I can take this animal to a hospital · This is a different animal |
| STATE-O10 | Share (device share sheet) | PUBLIC-04 | Evidence, voice note, type, reason, location, current status, live link. Never reporter name/email/mobile, private profile, case chat or participant info (D108) |
| STATE-O11 | Shared link resolution | Link | App → Case Detail (chat available in the app per D101); otherwise PUBLIC-05 (no chat, D108); closed cases show the outcome |

### Case Detail lifecycle variants (status/action area of PUBLIC-04)

| ID | Status | Action area |
|---|---|---|
| STATE-L01 | 🔴 Looking for help | "🚨 This animal needs help" · **Take me to the animal** |
| STATE-L02 | 🟠 Accepted / 🟡 Help reaching ~N min | "Professional help is on the way." Take me to the animal remains (N11); no transport/override |
| STATE-L03 | Rescue team reached / 🔵 Reaching hospital | View only |
| STATE-L04 | 🔵 Responder taking animal to hospital (others) | "This animal is being taken to a veterinary hospital." Selected hospital may be shown; no responder name/contact/location; no Take me to the animal |
| STATE-L04t | Same, transporter's own view | RESP-08 |
| STATE-L05 | Hospital reached / Under treatment | View only; off Home |
| STATE-L06 | Rescued | Outcome, warm message |
| STATE-L07 | Could not locate | "If you see it, share where in the case chat." On Home for 2 hours; no reopen action (N10 — Deferred to Next Phase) |
| STATE-L08 | Passed away — awaiting confirmation | "Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm." Stays on Home; normal help actions for the current status remain (D100) |
| STATE-L09 | Closed — Passed away | Gentle message, no emoji; off Home |
| STATE-L10 | Cancelled | Neutral message |
| STATE-L11 | No response yet | Fallback: nearby helplines and vets to call (demo: disabled) |
| STATE-L12 | Reporter's own case | ⋯ Cancel report (`NEW`), Report that the animal has passed away |

---

## Demo mode (SIMULATED DEMO)

| Element | Behaviour |
|---|---|
| Demo banner | "Demo · all organisations and cases are fictional" |
| Role switcher | Citizen, Org staff (**Lumen Animal Rescue & Shelter**), Hospital staff, Admin |
| Simulated organisation | Accepts new cases, posts official updates, advances statuses with approximate ETAs |
| Outcome picker | Rescued, Could not locate, Passed away, no response |
| Short timeouts | Seconds instead of minutes (incl. the 2-hour Could not locate window) |
| Simulated payment and delivery | Food donations complete without real money or logistics; payment and delivery statuses shown in My Food Donations are simulated |
| Seeded data | Mumbai cases at every status with chats, adoption listings, food donation requests and donations, a Blue Tick user and a non-verified user |
| Calls disabled / simulated notifications / reset | As above |

Demo mode is unreachable when the demo flag is off.
