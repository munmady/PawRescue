# 07 · Privacy, Safety, Assumptions & Risks

## Who sees what

| Data | Reporter (own) | Any app user (helper) | Case chat (open to everyone in the app) | Handling org / selected hospital | Shared link / web preview | Admin |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Reporter mobile number | ✅ | ❌ | ❌ (unless the reporter voluntarily shares it) | ✅ (official coordination) | ❌ | ✅ |
| Reporter email, private profile | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Reporter first name + "Reporter" role | ✅ | only in case chat, if they post | ✅ | ✅ | ❌ | ✅ |
| Case evidence (1–4 photos/videos), voice note, description | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exact animal location | ✅ | ✅ intentionally | ✅ | ✅ | ✅ | ✅ |
| Animal type, reason, status, time | ✅ | ✅ | ✅ | ✅ | ✅ (current status or outcome) | ✅ |
| Accepting organisation name, approximate ETA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Case chat messages | ✅ | ✅ view without sign-in; post when signed in (D101) | ✅ | ✅ | ❌ (D108) | ✅ |
| Contact details voluntarily shared in chat | own | ✅ in the app only (as chat content) | ✅ | ✅ | ❌ (D108) | ✅ |
| Community responder first name + role (chat) | — | only in case chat, if they post | ✅ (if they post) | ✅ | ❌ | ✅ |
| Community responder name, email, mobile | — | ❌ | ❌ (unless voluntarily shared) | ✅ **only the selected veterinary hospital, only after transport starts** (not other organisations) | ❌ | ✅ |
| Community responder live location / movement | — | ❌ | ❌ | ❌ | ❌ | ❌ |
| "Responder taking animal to hospital" + selected hospital | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Blue Tick | own (Profile) | only next to names in case chat (not on map, cards, adoption listings) | ✅ next to name | ✅ | ❌ | ✅ |
| Your Impact | own | ❌ | ❌ | ❌ | ❌ | ✅ |
| Adoption listing details | — | ✅ | — | ✅ | — | ✅ |
| Adoption poster phone | — | ❌ (unless voluntarily shared in chat) | — | — | — | ✅ |
| Food donor identity | own | ❌ | — | ✅ (requesting organisation) | — | ✅ |
| Own donation history and status (My Food Donations) | own | ❌ | — | — | — | ✅ |
| Directory listings (verified organisations' public details) | ✅ | ✅ (no sign-in) | — | ✅ | — | ✅ |
| Message flags (who flagged what) | own | ❌ | ❌ | ❌ | — | ✅ |

**Reporter evidence is private and not publicly discoverable:** no public galleries, feeds, indexed pages or browsable listings. Helpers see it in the app and through privacy-safe shared links so they can identify the animal. Evidence belongs to the case, not to a reporter profile.

## Privacy decisions

| Topic | Decision |
|---|---|
| **Authentication** | **Account setup and sign-in (D137, LOCKED):** One-time email OTP account verification with required name, email address and mobile number. One-time setup: **Name → Email → Mobile → Email OTP → signed in**. Name is required (not a full/legal name). Any valid email provider (Gmail, Outlook, Yahoo, work email, others). The mobile number is required and stored as profile/contact information; it is **not** verified and **not** used for OTP. A one-time code is sent to the **email address**; entering it completes setup and the user stays signed in. No passwords, no Google-only sign-in, no phone/SMS OTP, no email magic links. Applies to citizens and organisation dashboard members. Email OTP delivery is SIMULATED DEMO in the prototype (no real email). Browsing without an account shows only what any helper can see. |
| **Reporter mobile** | Required per report for emergency coordination; the account mobile given at setup (D137; not verified), fixed (D117); never public profile. Private by default; handling organisation receives it through official coordination. |
| **Exact animal location** | Intentionally visible to potential helpers and in shares. Captured only during reporting; no background location or history. |
| **Community responders** | Movement private (no "Rahul is going to the animal", no counts, no live location to anyone). Identity and contact (including the mobile number collected before transport, N24) go only to the selected veterinary hospital after transport starts (N12); never to rescue organisations, other responders or public surfaces. |
| **Case chat** | **Case chat is open to everyone. Anyone can view the conversation, and any signed-in user can participate by sending messages. No case involvement or prior action is required to participate.** (D101). Reading needs no sign-in; posting requires a signed-in account (D137); no anonymous posting; no eligibility gate. Chat never changes status, adds to My Reports or makes anyone a responder. Shows first name, role where applicable, Blue Tick, organisation name. Not included in shared links/web preview. Never auto-exposes phone, email, address or live location; users may voluntarily share text, photos, videos, location details or phone numbers. Proactive multilingual abuse filter. |
| **Sharing** | Device share sheet; evidence + case info + live link. Excludes reporter name/email/mobile, private profile, case chat and participant info. Links don't expire while the case exists and are not search-indexed; anyone with the link sees privacy-safe case information. After closure, the outcome is shown. |
| **Shared link vs case chat (D108)** | **Boundary:** the shared link/web preview communicates the case (evidence, type, reason, the exact animal location pin as in the app (D112), current official status, help information, final outcome, Open in App), never the conversation. It never shows case-chat messages, contact details voluntarily shared in chat, reporter identity/phone, private participant information, responder identity/contact or private coordination details. Case chat stays readable by anyone **inside the app** (D101); being open in the app does not make it part of shared links. |
| **Adoption** | Poster phone never publicly displayed; contact via chat and voluntary sharing. |
| **Food donations** | Organisation's registered address used for delivery; payment and delivery simulated in the prototype. No generic cash donations. Donors see their own history in My Food Donations. |
| **Organisations** | Only organisations that completed verified registration through the platform/admin process are onboarded; no in-app application; unverified organisations get no dashboard, cases, food requests or organisation adoption listings (D105). The public directory shows verified organisations' public details only. |
| **Flag message (D113)** | Case chat messages only; sign-in required. Flag message → reason (abusive or unprofessional language / false or misleading information) → optional details → submit → "Thanks for flagging this. Our team will review it." The message isn't removed or altered on flagging; platform/admin reviews. Who flagged is never shown to others. |
| **Blue Tick** | Platform/admin grant/revoke only; Profile and case chat only; no special permissions; not a professional credential. |
| **Your Impact** | Own view only; factual counts; never comparative; not used for Blue Tick. |
| **Children** | No age gate in the prototype; safety copy tells children to ask an adult. Age policy **NEEDS LEGAL VALIDATION** (DPDP). |
| **Data rights** | Consent, purpose limitation, Indian region hosting. Export/delete: FUTURE ARCHITECTURE. **NEEDS LEGAL VALIDATION.** |
| **Demo** | No real phone numbers or emails; calls disabled. |

## Trust features (MVP)

Verified organisations/hospitals/shelters only (verified registration through the platform/admin process; no in-app applications) · only verified organisations post pinned official updates · only registered/verified hospitals selectable for transport · approximate ETAs only · live shared links show current status or outcome · Passed away closes only after confirmation by a verified veterinary hospital or rescue organisation · Blue Tick granted only by the platform.

## Community responder safety

> **Please only approach if it is safe for you and the animal. Injured or frightened animals may behave unpredictably. If the situation is unsafe, wait for a trained rescuer.**
>
> [ I can safely help ]

- Never pressure physical intervention; "Not able to" always equal weight.
- If professional help becomes active while travelling, the responder is told; at the animal, transport/override is unavailable (N11).
- Official updates in chat carry safety instructions.
- Nothing rewards approaching, navigating, arriving first or chatting (no points, scores or leaderboards).

## Safety content

Shown on Report sent and in Help / Safety, which is public (D129). **All medical/first-aid copy must be professionally/veterinarily validated before real-world deployment;** prototype copy is illustrative.

- Keep a safe distance; don't stand in traffic.
- Don't move an animal hit by a vehicle unless it's in immediate danger; don't give food or water to a badly injured animal.
- If bitten or scratched, wash with soap and running water for 15 minutes and see a doctor the same day.
- Children: ask an adult; never approach an injured animal.

## Abuse prevention

- Account (one-time email OTP verification with name, email and mobile, D137) for reporting, responding, posting in chat, listings and donations.
- Mobile collected at account setup (not verified) and never editable (D117); it is never used for sign-in.
- Organisations can cancel as `not_genuine`; admin can block users and suspend organisations.
- **Case chat pre-send abuse filter** (English, Hindi, Marathi, Hinglish, Marathi-English): blocks genuine abuse, threats, slurs and harassment; allows urgency, frustration and disagreement. Message: "Please keep the conversation respectful. Abusive or inappropriate language isn't allowed in case chats."
- **Flag message (D113)** on individual case chat messages only (signed in): Flag message → reason → optional details → submit → confirmation. No immediate removal; admin review and moderation. Adoption listings, food requests and directory listings have no user flag action; admin moderates them directly.
- Duplicate check; duplicate "I can take this animal to a hospital" never creates a second case.
- Community transport only to registered/verified veterinary hospitals after informing them.
- Food donation requests only from verified veterinary hospitals, rescue organisations and shelter homes (D120).
- Blue Tick only by platform decision; revocable for serious misuse.

---

## Assumptions register

| # | Assumption | Label |
|---|---|---|
| A1 | Organisations will accept cases from an app rather than only WhatsApp | NEEDS VALIDATION |
| A2 | Problem chips match organisation triage | NEEDS VALIDATION |
| A3 | Timeout values are realistic | NEEDS VALIDATION |
| A4 | Reporters will share a mobile number with the rescuing organisation | ASSUMPTION |
| A5 | Mobile numbers given at account setup (not verified) are genuine often enough for coordination (D137) | NEEDS VALIDATION |
| A6 | Coordinators work mostly on phones | ASSUMPTION |
| A7 | Most users are on Android | ASSUMPTION |
| A8 | "Reporting is free / doesn't make you responsible" is accurate | NEEDS VALIDATION |
| A9 | First-aid/safety guidance is safe as written | NEEDS VALIDATION (vet) |
| A10 | Age policy | NEEDS LEGAL VALIDATION |
| A11 | Exact locations and evidence visible to helpers and via links do more good than harm | NEEDS VALIDATION |
| A12 | Ordinary users transport only when safe | NEEDS VALIDATION |
| A13 | Registered hospitals accept animals brought by responders after a call | NEEDS VALIDATION |
| A14 | Organisations keep up with confirmations | NEEDS VALIDATION |
| A15 | The pre-send filter works acceptably across mixed-language chat | NEEDS VALIDATION |
| A16 | Users accept one-time email OTP account setup before a first report | NEEDS VALIDATION |
| A17 | Organisations will create and fulfil product-based food requests | NEEDS VALIDATION |

## Risks

| Category | Risk | Mitigation |
|---|---|---|
| Product | Organisations don't respond | Partners first, admin dispatch, fallback, community responders |
| Product | Secondary areas dilute the mission | Secondary on Home; never on the distress map/list |
| Product | Chat drifts into social chatter | Case-scoped, official updates pinned, no likes/feeds |
| Abuse | Open chat attracts spam or abuse from people unrelated to the case | Pre-send multilingual filter, sign-in to post, Flag message, admin moderation, user blocking |
| Operational | Confirmations not kept up | Confirmations view, alerts |
| Safety | Responders hurt or rushing | Safety check, N11 behaviour, no rewards for approaching |
| Safety / privacy | Locations and evidence misused via forwarded links | No reporter identity; no case chat or chat-shared contact details in links (D108); non-indexed links; admin block |
| Privacy | Users voluntarily share numbers in chat and are contacted unwantedly | Voluntary only; report/block; moderation |
| Privacy | Responder details exposed beyond the destination hospital | Reveal only after transport starts, only to the selected veterinary hospital; no live location |
| Abuse | Fake or abusive adoption listings | Chat-only contact, admin moderation (no user flag action on listings, D113) |
| Abuse | Misused food donations | Only verified veterinary hospitals, rescue organisations and shelter homes create requests (D120); simulated payments in prototype; real payment/delivery partner in pilot |
| Access | Account setup (name, email, mobile, email code) adds friction before a first report; real email delivery reliability (A16) | Validate before pilot; email OTP simulated in the prototype |
| Legal | DPDP obligations; payments compliance in a real pilot | Legal review before pilot |
| Portfolio | Reviewers can't see the full loop | Demo mode |

## Interview themes (future pilot)

Organisations and hospitals (official updates, confirmations, receiving responder transports, food request needs); past reporters and helpers (safety, sharing numbers, chat use, email OTP account setup, Blue Tick meaning); vets (what the public should do while waiting/transporting).
