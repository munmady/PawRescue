# Wireframes 01 · Citizen: Home, Reporting, Case Detail, Case chat, Profile (low fidelity)

**Scope:** Welcome → Home → (Account setup WA1–WA3 if signed out; WA5 on failure) → (Location explainer) → Media → What's wrong? → Where is it? → Mobile number → Send → Possible duplicate? → Report sent → Case Detail, plus Case chat, Share, Profile and My Reports. Adoption screens are listed in [docs/04](../docs/04-screens.md#adoption-secondary). The community responder screens (after **Take me to the animal**) are specified in [docs/03](../docs/03-flows-lifecycle.md#community-responder-flow) and wireframed in [wireframes/02](02-community-responder.md).

**Source of truth:** `docs/01`–`07`. These wireframes add no features. Layout only: no colour, type, icons or visual style (the design system comes later).

**Legend**

```
[ Button ]        primary action (one per screen)
( Button )        secondary action
‹ text link ›     tertiary link
[ ] / (•)         chip / selected chip
▢                 image or photo placeholder
░░░               map placeholder
┄┄┄               divider
DEMO              demo-only element (SIMULATED DEMO)
```

**Global prototype rules** (from docs, apply to every screen)

- Bottom navigation is **Home | Adoption | Donation | Profile** (D139; the two-item bars drawn below predate it). My Reports is inside Profile.
- Every call action shows a toast: *"Demo — calling is disabled in this prototype."*
- Notifications appear as in-app banners labelled **Demo**. No OS notification permission request ever.
- A thin persistent **DEMO** banner in demo builds: *"Demo · all organisations and cases are fictional"*.
- Organisation names are fictional (primary: *Lumen Animal Rescue & Shelter*).
- No general social layer: no comments, likes, posts, general (non-case) community chat, activity feeds, system-generated responder movement or counts, leaderboards. **Case chat** (W10) is case-scoped, with official updates pinned at the top.
- **Account: one-time email OTP account verification with required name, email and mobile (D137): Name → Email → Mobile → Email OTP → signed in. No passwords, no Google-only sign-in, no SMS OTP, no magic links.** Browsing (Home, Case Detail, reading case chat, shared links, the public organisations directory) needs no sign-in; sign-in is requested when reporting, tapping Take me to the animal (D111), posting in case chat, listing for adoption, donating food, or opening Profile.
- **Mobile number:** the account mobile given at setup (not verified), shown read-only on every report (no edit, D117). Only the handling verified organisation/hospital sees it.
- **Evidence belongs to the case:** helpers see all photos/videos and the voice note. Reporter identity (name, email, phone) is never shown to helpers, in chat or in shares.
- **Report locking.** Before submission the reporter can change anything. After submission the report is locked; no edit workflow; no media after submission. The only post-submission input is the optional-help answers on Report sent.

---

## Emotional arc → screens

| Moment | Feeling | Screens |
|---|---|---|
| Seeing the animal | Shock, urgency, helplessness | W1 Home (Report an animal in distress) |
| First report only | Impatience: "I just want to help" | WA1–WA3 account setup (name, email, mobile, then a code sent to the email) |
| Reporting | Pressure, shaking hands | W3 Media · W4 What's wrong? · W5 Where is it? · W6 Phone number |
| Uncertainty | "Did it work? Is anyone coming?" | W8 Report sent |
| Reassurance | Something is happening | W9 Case Detail · Looking for help |
| Handoff | "Someone has it" | W9 · Accepted / Help reaching / transport |
| Closure | Need to know | W9 · Under treatment / Outcome · P2 My Reports |

---

## W0 · Welcome (first launch only)

```
┌──────────────────────────────────┐
│ DEMO banner                      │
│                                  │
│        ▢ illustration            │
│   (people helping an animal)     │
│                                  │
│  Help animals in distress        │
│  near you.                       │
│  See who needs help, report an   │
│  animal, and follow it to care.  │
│                                  │
│  [         Get started        ]  │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | One short welcome. No carousel, no phone verification. |
| **Primary CTA** | Get started → W1 Home (W2 location explainer first if location is needed and not yet asked) |
| **Sign-in** | Not required here. Account setup / sign-in (email OTP, D137) is requested when the user first takes a signed-in action (report, Take me to the animal, posting in chat, adoption listing, food donation, Profile). |
| **Navigation** | Never shown again. |
| **Feeling** | "This is simple. I can help." |
| **Class** | REAL PROTOTYPE |

---

## W1 · Home

Home (Map and List) is now specified in detail in **[wireframes/01-home.md](01-home.md)** (H1–H10). The report flow below starts from Home's **Report an animal in distress** action.

---

## W2 · Location permission explainer (sheet, first time location is needed)

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Share your location            ││
││                                ││
││ We use it to show animals in   ││
││ distress near you and to tell  ││
││ rescuers where an animal is.   ││
││ Never in the background.       ││
││                                ││
││ [      Allow location       ]  ││
││ ( Not now )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Explain location honestly before the OS prompt. Shown once, on Home (nearby cases) or the first report, whichever needs it first. |
| **Primary CTA** | Allow location → real OS location prompt |
| **Secondary** | Not now → continue; location can be set on the map |
| **Required / optional** | Optional. Denial never blocks reporting. |
| **Feeling** | "Fair enough, that makes sense." |
| **Class** | REAL PROTOTYPE (real OS location permission; not the notification prompt) |

---

## WA · Account setup / sign-in (when a signed-out user starts a report)

Shown right after **Report an animal in distress** if the user isn't signed in (same screens for Take me to the animal, posting in chat, adoption, food donations and Profile). **D137 (LOCKED): one-time email OTP account verification with required name, email address and mobile number.** Flow: **Name → Email → Mobile → Email OTP → signed in.** Any valid email provider; no passwords, no Google-only sign-in, no phone/SMS OTP, no email magic links. The mobile is contact information only (not verified, never used for OTP; cannot be changed, D117). After setup the user stays signed in. **Email OTP delivery is SIMULATED DEMO** (no real email). Signing back in after Logout or on a new device is **not yet specified**.

### WA1 · Sign-in prompt (sheet) · AUTH-01

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Sign in to report              ││
││                                ││
││ Sign in to report, chat and    ││
││ keep your reports. It takes    ││
││ a minute, once.                ││
││                                ││
││ [         Continue         ]   ││
││ ( Not now )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

### WA2 · Account setup: name, email, mobile · AUTH-04

```
┌──────────────────────────────────┐
│ ‹ Back                           │
│ Set up your account              │
│                                  │
│ Name                             │  ← required; not a full/legal name
│ ┌──────────────────────────────┐ │
│ │ Priya                        │ │
│ └──────────────────────────────┘ │
│ Email                            │  ← any provider
│ ┌──────────────────────────────┐ │
│ │ you@example.com              │ │
│ └──────────────────────────────┘ │
│ Mobile number                    │  ← contact only; not verified
│ ┌────┬─────────────────────────┐ │
│ │ +91│ 98XXX XXXXX             │ │
│ └────┴─────────────────────────┘ │
│ We'll send a one-time code to    │  ← draft copy
│ your email. Rescue teams use     │
│ your mobile to reach you; it     │
│ can't be changed later.          │  ← D117
│                                  │
│  [         Send code         ]   │
└──────────────────────────────────┘
```

### WA3 · Enter the email code · AUTH-05

```
┌──────────────────────────────────┐
│ ‹ Back                           │
│ Check your email                 │
│ Enter the code we sent to        │
│ you@example.com                  │
│                                  │
│   [ ][ ][ ][ ][ ][ ]             │  ← length set during build
│                                  │
│ DEMO · code: shown here          │  ← simulated, no real email
│                                  │
│ ‹ Resend code ›                  │
│                                  │
│  [           Verify          ]   │
└──────────────────────────────────┘
```

~~WA4 · Complete sign-up~~ · **Retired (D137):** the name is now collected first, on WA2.

### WA5 · Sign-in didn't work · AUTH-03

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Sign-in didn't work            ││
││ We couldn't sign you in.       ││
││ Please try again.              ││
││                                ││
││ [         Try Again        ]   ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | One-time account setup without leaving the report: the user returns to the report flow as soon as the email code is verified. |
| **Primary CTA** | WA1 Continue → WA2 Send code → WA3 Verify → signed in → **back to the report** (W2 location explainer if needed, then W3 Media). |
| **Secondary** | WA1 Not now → back to Home (no draft yet) · WA3 Resend code · Back |
| **Required / optional** | Name, email, mobile and the email code are all required. No password. |
| **States** | *Invalid email / mobile:* inline hints (mobile: "Check the number. It should be 10 digits.", STATE-E01). *Sending code / verifying:* button progress. *Wrong code:* "That code isn't right. Check it and try again." *Expired code:* "This code has expired. Tap Resend code to get a new one." (D131). *Failure:* WA5 (D106). |
| **Content rules** | Name, email and mobile are private (case chat shows the first name only); never shown to helpers in shares. No Google button, no password field, no SMS code, no email link. |
| **Not specified (open)** | Signing back in after Logout or on a new device · account uniqueness · editing name or email. |
| **Feeling** | "Quick, and only once." |
| **Class** | REAL PROTOTYPE · email OTP delivery SIMULATED DEMO |

---

## W3 · Media (Add evidence)

One unified "Add evidence" experience for photos and videos. **Required: 1–4 media items** (any combination). The only way to continue with zero items is the explicit safety exception (W3d).

### W3a · Capture

```
┌──────────────────────────────────┐
│ ✕                      ⚡ flash   │
│                                  │
│        live camera view          │
│                                  │
│  Stay safe. Keep your distance.  │
│                                  │
│        PHOTO  ·  video           │  ← mode switch
│   ▢gallery    ( ◯ )      0 / 4   │  ← shutter large, centred; counter
│                                  │
│ ‹ I can't safely take a photo or video ›
└──────────────────────────────────┘
```

Recording a video: `photo · VIDEO` · `● 0:07  ( ■ )  2 / 4`

### W3b · Your evidence (tray)

```
┌──────────────────────────────────┐
│ ✕                       3 / 4    │
│ Your evidence                    │
│ Add 1 to 4 photos or videos.     │
│                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │ ▢  ✕ │ │ ▢  ✕ │ │ ▶  ✕ │       │  ← tap = preview · ✕ = remove
│ │      │ │      │ │ 0:12 │       │
│ └──────┘ └──────┘ └──────┘       │
│ ┌──────┐                         │
│ │  +   │  Add evidence           │  ← disabled at 4 / 4
│ └──────┘                         │
│                                  │
│  [          Continue          ]  │  ← enabled at 1+ item
└──────────────────────────────────┘
```

### W3c · Preview (full screen)

```
┌──────────────────────────────────┐
│ ‹ Back                 2 of 3    │
│      ▢ photo   or   ▶ video      │
│  ( Remove )                      │
└──────────────────────────────────┘
```

### W3d · Safety exception (sheet)

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ That's okay. Your safety       ││
││ comes first.                   ││
││                                ││
││ You can still send a report    ││
││ without a photo or video. It   ││
││ will be marked "No media:      ││
││ reporter couldn't capture      ││
││ safely" for the rescue team.   ││
││                                ││
││ Details in "Tell us what you   ││
││ saw" and an exact location     ││
││ will help them most.           ││
││                                ││
││ [ Continue without media    ]  ││
││ ( Go back and add evidence )   ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Collect 1–4 photos/videos of the animal. |
| **Primary CTA** | W3a: Shutter / start-stop → W3b. W3b: **Continue** → W4 (needs ≥1 item). |
| **Secondary** | Gallery · Flash · Add evidence · Preview (W3c) · Remove · ‹ I can't safely take a photo or video › → W3d · ✕ |
| **Required / optional** | **At least 1, at most 4 items.** The safety exception is only for unsafe situations, never a general skip. |
| **States** | *0 items:* Continue disabled, "Add at least 1 photo or video." *4 items:* Add evidence and shutter disabled, "Maximum 4 reached. Remove one to add another." *Gallery pick over 4:* first 4 added, "Only 4 can be added." *Camera denied:* "Camera access is off" + Choose from gallery + safety exception link. |
| **Navigation** | ✕ with no items → back to Home. ✕ with items → **"Discard this report?"** (Discard / Keep reporting). Draft saved from the first item. W3d Continue without media → W4 with `no_media`. |
| **Feeling** | Focused. The safety exception says "your safety matters more", never "you failed". |
| **Class** | REAL PROTOTYPE |

---

## W4 · What's wrong?

```
┌──────────────────────────────────┐
│ ‹ Back                Step 2 of 4│
│ ▢▢▶ (evidence thumbnails)        │
│                                  │
│ Which animal?                    │
│ ( Dog )  ( Cat )  ( Other )      │
│                                  │
│ What's wrong? Pick any that fit. │
│ [ ] Hit by vehicle               │
│ [ ] Bleeding / wound             │
│ [ ] Can't walk or stand          │
│ [ ] Not responding               │
│ [ ] Very sick / weak             │
│ [ ] Trapped / stuck              │
│ [ ] Other                        │
│                                  │
│ Tell us what you saw  (optional) │
│ Add any details that may help    │
│ the rescue team.                 │
│ ┌──────────────────────────────┐ │
│ │ Type here…               🎤  │ │  ← composer
│ └──────────────────────────────┘ │
│ ‹ Is this your pet? ›            │
│  [          Continue          ]  │  ← disabled until species + 1 problem
└──────────────────────────────────┘
```

### Composer states

```
Empty           │ Type here…               🎤  │
Typing          │ The dog is lying near the    │
                │ bus stop and can't stand up▌🎤│
Recording       │ ● Recording 0:14  ∿∿∿∿∿      │
                │ ( ✕ Cancel )        ( ■ Stop )│
Voice note      │ ( ▶ ) ∿∿∿∿∿∿∿∿  0:21         │
recorded        │ ( 🗑 Delete )  ( ↺ Re-record )│
                │ Add text too (optional)…     │
Mic off         │ Type here…               🎤̸  │
                Microphone access is off. You can still type.
```

| | |
|---|---|
| **Purpose** | Species and problem in a few taps; optional details by text, voice or both. |
| **Primary CTA** | Continue → W5 |
| **Required / optional** | Species (one) and at least one problem required. **Tell us what you saw is optional.** No severity question. |
| **States** | Continue disabled with hint. Composer: empty · typing · recording · voice note recorded (playback / delete / re-record) · text + voice · mic denied. Re-record confirms "Replace your voice note?". *`no_media` path:* helper line "Without a photo or video, details here help the team most." |
| **Navigation** | Linear, "Step 2 of 4". Back → W3b. Draft saved. Leaving the flow → "Discard this report?". |
| **Class** | REAL PROTOTYPE |

---

## W5 · Where is it?

```
┌──────────────────────────────────┐
│ ‹ Back                Step 3 of 4│
│ Where is the animal?             │
│ ┌──────────────────────────────┐ │
│ │░░░░░░░░░░░ 📍 ░░░░░░░░░░░░░░░│ │  ← draggable pin
│ └──────────────────────────────┘ │
│ ( ◉ Use current location )       │
│ Near Hill Road, Bandra West      │
│ ‹ Search for a place ›           │
│                                  │
│ Landmark (optional)              │
│ ┌──────────────────────────────┐ │
│ │ e.g. outside the chai stall… │ │
│ └──────────────────────────────┘ │
│  [          Continue          ]  │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | An accurate animal location (current location, map selection, adjustment). |
| **Primary CTA** | Continue → W6 |
| **Required / optional** | Location required. Landmark optional. |
| **States** | *Locating:* "Finding your location…". *Low accuracy:* "Your location is approximate. Drag the pin to the exact spot." *Location off:* search or pick on map; Continue disabled until a location is set. |
| **Navigation** | Back keeps everything. Leaving → "Discard this report?". |
| **Feeling** | "I've told them exactly where." |
| **Class** | REAL PROTOTYPE |

---

## W6 · Phone number and Send

```
┌──────────────────────────────────┐
│ ‹ Back                Step 4 of 4│
│ Your mobile number               │
│ So the rescue team can reach     │
│ you if they need help finding    │
│ the animal.                      │
│ ┌────┬─────────────────────────┐ │
│ │ +91│ 98XXX XXXXX             │ │  ← account mobile; read-only
│ └────┴─────────────────────────┘ │
│ This is the mobile number on     │  ← D117: no edit
│ your account.                    │
│ Only the registered hospital or  │
│ organisation handling this case  │
│ will see your number.            │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ Your report                      │
│ ▢▢▶ 3 items             ‹ Edit › │  ← or "No media: couldn't capture safely"
│ Dog · Hit by vehicle    ‹ Edit › │
│ Details: text ✓ · voice ✓        │
│ Near Hill Road, Bandra  ‹ Edit › │
│                                  │
│  [         Send report        ]  │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Confirm the required mobile number for coordination and send. **No OTP at this step**: the number is the account mobile given at setup (D137; not verified), shown read-only; it cannot be changed (D117). |
| **Primary CTA** | **Send report** → duplicate check → W7 (if a possible duplicate) or submit → W8 |
| **Secondary** | ‹ Edit › links back to W3b / W4 / W5 · Back → W5 |
| **Required / optional** | Mobile number required on every report (always the account mobile). |
| **States** | *Sending:* button shows "Sending your report…". *Send failed:* "That didn't send. Your report is saved. Try again." |
| **Feeling** | "Of course they need to reach me." |
| **Class** | REAL PROTOTYPE |

---

## W7 · Possible duplicate (sheet, after Send)

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ We may already have this       ││
││ animal's case.                 ││
││                                ││
││ Someone has reported an animal ││
││ in this area and help may      ││
││ already be on the way.         ││
││                                ││
││ ▢  Dog · 🟠 Accepted by Lumen  ││
││    Animal Rescue · 20 min ago  ││
││                                ││
││ [    View existing case     ]  ││
││ ( I can take this animal to a  ││
││   hospital )                   ││
││ ( This is a different animal ) ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Avoid duplicate cases without blocking a genuinely new one. No automatic merging. |
| **Primary CTA** | View existing case → W9 for that case. The new report is not submitted; its media and details are not attached. |
| **Secondary** | **I can take this animal to a hospital** → **no second case**; opens the existing W9 showing its current status. Professional help active → no override and no competing transport. Still Looking for help → community responder flow starts (Safety check → I can safely help → navigate → reach → re-check status → safe transport → confirm account mobile → registered/verified veterinary hospital → call/inform → Start transport). · This is a different animal → submit → W8 |
| **Content rules** | Shows the existing case's current status and evidence. "View existing case" does not make the user a responder. |
| **Feeling** | Relief: "Help may already be on the way." |
| **Class** | REAL PROTOTYPE |

---

## W8 · Report sent

```
┌──────────────────────────────────┐
│ DEMO banner                    ✕ │
│  Report sent.                    │
│  We're alerting rescue teams     │
│  near you.                       │
│                                  │
│  You've done the most important  │
│  part. Reporting is free and     │
│  doesn't make you responsible    │
│  for the animal.                 │
│ ┌──────────────────────────────┐ │
│ │ What happens next      DEMO  │ │
│ │ We'll update you when a team │ │
│ │ accepts and as the animal    │ │
│ │ gets care.                   │ │
│ │ ( Turn on updates )          │ │  ← opens W8a
│ └──────────────────────────────┘ │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  Stay safe                       │
│  • Keep a safe distance.         │
│  • Don't stand in traffic.       │
│  • Bitten or scratched? Wash 15  │
│    min with soap and water; see  │
│    a doctor today.               │
│  • Children: ask an adult.       │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  Optional ways you can help:     │
│  only if you're able.            │
│  Can you stay nearby for a while?│
│  ( Yes ) ( About 15 min ) ( Not able to )
│  Could you help transport the    │
│  animal, if the team asks?       │
│  ( Yes )        ( Not able to )  │
│  These are optional. It's okay   │
│  to leave.                       │
│                                  │
│  [      View your report      ]  │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Confirm the report is out, keep the reporter safe, offer (never ask for) optional help. |
| **Primary CTA** | **View your report** → W9 |
| **Secondary** | Turn on updates → W8a · optional-help chips · ✕ → **Home** |
| **Required / optional** | Nothing required. "Not able to" has equal visual weight. Report itself is locked. |
| **Navigation** | Close returns to Home (never back into the report). |
| **Feeling** | "It worked. I'm allowed to go." |
| **Class** | REAL PROTOTYPE · W8a SIMULATED DEMO |

### W8a · Notification explainer (sheet)

Opens only from ( Turn on updates ), never on its own or on a timer. **Must not trigger or imply a real OS/browser notification permission request.**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ DEMO                           ││
││ Get updates about this animal? ││
││ [       Turn on updates     ]  ││
││ ( Not now )                    ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

---

## W9 · Case Detail (action-first)

```
┌──────────────────────────────────┐
│ ← Animal in distress           ⋯ │
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │  [EVIDENCE 1/3 · swipe ◂ ▸]  │ │  ← all photos/videos; blurred by default if sensitive
│ │                              │ │
│ └──────────────────────────────┘ │
│ ( ▶ Voice note 0:21 )            │  ← if added
│ 🔴 LOOKING FOR HELP              │
│                                  │
│ 🐕 Injured Dog                   │
│ 📍 Andheri East · 850 m          │
│                                  │
│ Hit by vehicle. Dog appears to   │
│ have an injured rear leg.        │
│                                  │
│ 🚨 THIS ANIMAL NEEDS HELP        │
│                                  │
│ [   TAKE ME TO THE ANIMAL     ]  │
│                                  │
│ Reported 12 min ago              │
│ ( Share )      ( 💬 Case chat )  │
│ OFFICIAL · Lumen Rescue & Shelter│  ← latest official update preview,
│ "Please don't approach."         │    when one exists
│                                  │
│ Case AR-10245                    │  ← small, placeholder prefix
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Answer: What happened? Where is the animal? Does it still need my help? |
| **Hierarchy** | 1 Evidence (all photos/videos, voice note) · 2 Status · 3 Animal + location/distance · 4 What happened · 5 Help prompt + main action · 6 Reported time · 7 Share, Case chat |
| **Primary CTA** | **Take me to the animal** → safety check → responder flow (docs/03). Shown for Looking for help; also stays available (navigation only, no transport or override) while professional help is active (N11, locked). For Rescue team reached, Reaching hospital, Responder taking animal to hospital and Could not locate the case is view/information only (case chat). |
| **Secondary** | Share → device share sheet (photos/videos, voice note, type, reason, location, current status, live link; never reporter name/email/phone/account or case chat, D108) · Case chat → W10 · ⋯ (reporter's own case: Cancel report while `NEW` → W9b; Report that the animal has passed away → W9c) · Call organisation once accepted (reporter; demo toast) |
| **Must not contain** | Reporter identity, comments, likes, posts, discussion threads on the screen, volunteer activity feeds, system-generated "Rahul is approaching" / "5 people are helping", leaderboards, excessive medical information, donation prompts, public galleries. |
| **Navigation** | From Home card/pin, W7, W8, My Reports, or a demo notification. |
| **Class** | REAL PROTOTYPE |

### W9 · Wording by state

| Status | Status line and copy | Main action |
|---|---|---|
| 🔴 Looking for help | "🚨 This animal needs help" | **Take me to the animal** |
| No response yet (fallback) | "We haven't confirmed a team yet. Here's what you can do right now." + nearby helplines and vets (Call: demo toast) + ‹ Only if you're able and it's safe: taking the animal to a vet yourself › | Take me to the animal / Call a helpline |
| Did it get help? (24 h) | "Did the animal get help?" | Yes, I found help · No · Don't know |
| 🟠 Accepted by organisation | "Lumen Animal Rescue & Shelter has accepted this case." "Professional help is already active." | Take me to the animal stays available (N11); no override |
| 🟡 Help reaching in ~N min | "Help is approximately 5 min away." "Professional help is already active." | As above |
| Rescue team reached | "The rescue team is with the animal." | View only |
| 🔵 Reaching hospital | "The rescue team is taking the animal to {hospital}." | View only |
| 🔵 Responder taking animal to hospital | **🔵 RESPONDER TAKING ANIMAL TO HOSPITAL** · "This animal is being taken to a veterinary hospital." Selected hospital may be shown. No responder name, contact or live location. | View only (no Take me to the animal) |
| Hospital reached | "The animal arrived at {hospital}." | View only |
| Under treatment | "Under treatment." + latest update | View only |
| Rescued | Outcome message, "Thank you for stopping to help." | Done |
| Could not locate | "The team couldn't find this animal. If you see it, share where in the case chat." (on Home for 2 hours) | Case chat (reactivation: N10 — Deferred to Next Phase) |
| Passed away — awaiting confirmation | "Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm." | Normal help actions for the current status remain (D100) |
| Closed — Passed away (confirmed) | Gentle message, no emoji; removed from Home | Done |
| Cancelled | "This report was cancelled. Rescue teams are no longer being alerted." | — |

States: *Loading:* skeleton. *Can't load:* "We couldn't load this case. ‹ Try again ›". *Offline:* last known status + "You're offline. This may not be the latest update."

### W9b · Cancel report (dialog)

Only the original reporter, only while 🔴 Looking for help.

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Cancel this report?            ││
││ Rescue teams will stop being   ││
││ alerted about this animal.     ││
││ The report stays in your       ││
││ history.                       ││
││ ( Keep report )                ││
││ [      Cancel report        ]  ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

No reason asked; records `cancelled_by_reporter`. If a team accepts first: "A rescue team has just accepted this report, so it can no longer be cancelled here." Cancelled cases stay in My Reports.

### W9c · Animal passed away (dialog)

Reporter (via ⋯) or community responder. **Does not close the case.**

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Has the animal passed away?    ││
││ We're sorry. We'll let a       ││
││ veterinary hospital or rescue  ││
││ organisation know so they can  ││
││ confirm it.                    ││
││ ( Back )                       ││
││ [   Yes, it has passed away  ] ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

Records the report and timestamp; the case shows "Passed away — awaiting confirmation". Only confirmation by a registered/verified veterinary hospital or rescue organisation closes it ("Closed — Passed away"), after which it leaves the Home map/list and keeps its history. No Stars. Never overwrites an existing professional outcome. If no organisation is available, it stays pending (D100).

---

## W10 · Case chat

```
┌──────────────────────────────────┐
│ ← Injured dog · Andheri East     │
│ ┌──────────────────────────────┐ │
│ │ OFFICIAL UPDATE          ✓   │ │  ← pinned, persistent, visually distinct
│ │ Lumen Animal Rescue & Shelter│ │
│ │ Rescue team has reached the  │ │
│ │ location. Please do not      │ │
│ │ approach the animal unless   │ │
│ │ requested.          4:20 pm  │ │
│ └──────────────────────────────┘ │
│ Community messages               │
│ Neha · Reporter ✓                │  ← first name · role · Blue Tick if verified
│ I can see the dog near the       │
│ petrol pump.            4:05 pm  │
│ Arjun · Community Responder      │
│ The dog has moved behind the     │
│ blue car.  ▢ photo      4:11 pm  │  ← photos/videos/location allowed
│ Rahul · Community Responder      │
│ I am at the location now.        │
│                         4:14 pm  │
│ ┌──────────────────────────────┐ │
│ │ Write a message…          ➤  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Let anyone exchange useful information about this specific animal and its location. Not a general social chat. **Case chat is open to everyone; case actions remain permission/state based** (D101). |
| **Participants** | **Case chat is open to everyone. Anyone can view the conversation, and any signed-in user can participate by sending messages. No case involvement or prior action is required to participate.** (D101). Reading needs no sign-in; sending requires a signed-in account (D137), never anonymous. No need to be the reporter or a responder, no case action first, no Join chat, no non-participant state. Chatting never changes status, adds to My Reports or makes anyone a responder. Role labels where applicable: the reporter, users with a community responder record, the handling organisation/hospital. |
| **Hierarchy** | 1 Official update area (always at the top, persistent) · 2 Community messages · 3 Composer |
| **Rules** | **Chat never changes the case status** ("I'm going there" changes nothing). Each message author shows **first name, role where applicable (Reporter / Community Responder / Organisation/Veterinary Hospital), Blue Tick if verified, organisation name** for organisations. The system never auto-exposes phone, email, address or live location; users may voluntarily share text, photos, videos, location details or their phone number. **Proactive abuse filter** before sending (English, Hindi, Marathi, Hinglish, Marathi-English); blocked: "Please keep the conversation respectful. Abusive or inappropriate language isn't allowed in case chats." No likes or reactions-as-ranking. **Blue Tick** appears next to the name of any participant the platform has verified as a responsible reporter; it is visually distinct from the official update area and confers no special permissions or professional status. Nothing in chat earns points or rewards. |
| **States** | *No official update yet:* "No official updates yet". *Empty:* "Share anything that helps the rescue team find this animal." *Message blocked by filter:* respectful-conversation message; text kept in the composer. *Message not sent (D106):* "Message not sent" · "Check your connection and try again." · **Retry**; the message stays available. *Flag message (D113):* signed-in users only → reason (Abusive or unprofessional language / False or misleading information) → optional details → submit → "Thanks for flagging this. Our team will review it."; message not removed on flagging. *Message hidden:* only after admin review. |
| **Class** | REAL PROTOTYPE |

---

## P1 · Profile

```
┌──────────────────────────────────┐
│ Mandar · mandar@…                │  ← account info, private
│ Mobile: 98XXX XXXXX              │  ← read-only (D117); not verified
│ ┌──────────────────────────────┐ │
│ │ Responsible Reporter ✓       │ │  ← Blue Tick, only when VERIFIED
│ │ Recognised for responsible   │ │
│ │ animal distress reporting.   │ │
│ └──────────────────────────────┘ │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ Your Impact  (factual)           │
│ 🐶 12 distress cases reported    │
│ 🚑 5 animals transported to care │
│ 🏠 1 adoption listing created    │
│ 🍲 3 food donations contributed  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ ‹ My Reports ›                   │
│ ‹ My Adoption Listings ›         │
│ ‹ My Food Donations ›            │
│ ‹ Notification settings ›        │
│ ‹ Help & Safety ›                │
│ ‹ Privacy ›                      │
│ ‹ Terms ›                        │
│ ‹ Logout ›                       │
├──────────────────────────────────┤
│        Home        │   Profile   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Personal space and recognition: thank you, not competition. |
| **Content rules** | Own account info, mobile number (view only, D117), Blue Tick — Responsible Reporter (when `VERIFIED`; granted/revoked only by the platform; means "verified as a responsible reporter", never a professional qualification), and factual Your Impact (distress cases reported, animals transported to care, adoption listings created, food donations contributed/arranged; never used for Blue Tick). **No Stars, points, badges, levels, achievements, leaderboards, rankings, comparisons, streaks or "earn" prompts.** |
| **Navigation** | Tab root (sign-in required; failure state: "Sign-in didn’t work" · "We couldn’t sign you in. Please try again." · Try Again). My Reports → P2. **My Adoption Listings** (D103): own listings, edit, status, mark Adopted, conversations. **My Food Donations** (D104): donation history and per-donation status. Help & Safety: first-aid & safety guide. **Veterinary & Animal Organisations:** link to the **public** directory (also reachable without sign-in, D102): registered/verified veterinary hospitals, rescue organisations and shelter homes (name, location/distance, services, contact, availability); discovery only, not the emergency workflow. Notification settings: updates for cases I reported or transported; no "nearby distress" setting. Logout signs out. |
| **Feeling** | Appreciated. |
| **Class** | REAL PROTOTYPE |

## P2 · My Reports (inside Profile)

```
┌──────────────────────────────────┐
│ ← Profile        My Reports      │
│ ( Active )  ( Closed )           │
│ ┌──────────────────────────────┐ │
│ │ ▢ Dog · 🟠 Accepted by Lumen…│ │
│ │   Updated 4 min ago        › │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢ Cat · Under treatment      │ │
│ │   Reported 1 day ago       › │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | **Cases I reported** (added immediately after submission) and **cases I personally transported to care** (added when I started transport). Not added for viewing, sharing, Take me to the animal, reaching, assessing, or selecting a hospital without starting transport. Closed includes cancelled cases (never deleted). |
| **Primary CTA** | Open a case → W9 |
| **States** | *Empty:* "No reports yet. Cases you report or take to care will appear here." *Loading:* skeleton cards. |
| **Navigation** | Inside Profile. Not a bottom navigation item. |
| **Class** | REAL PROTOTYPE |

---

## Flow

```
W0 Welcome (first launch only) ──► W1 Home (List ⇄ Map) ◄────────────────────────────┐
                                     │                │                               │
                       open a case   │                │ Report an animal in distress  │
                                     ▼                ▼                               │
                                  W9 Case      (WA1–WA3 if signed out · W2 first time) │
                                  Detail              ▼                               │
                                     │         W3 Media (1–4) ──‹I can't safely›──► W3d
                                     │                ▼                    │          │
                                     │         W4 What's wrong? ◄──────────┘          │
                                     │                ▼                               │
                                     │         W5 Where is it?                        │
                                     │                ▼                               │
                                     │         W6 Mobile number → Send report         │
                                     │                ▼                               │
                                     │      possible duplicate? ─yes─► W7             │
                                     │                │ no      View existing case ─► W9 (existing)
                                     │                │         I can take this animal ─► W9 (existing); responder flow only if still Looking for help
                                     │                │◄─────── This is a different animal
                                     │                ▼
                                     │         W8 Report sent ──Turn on updates──► W8a (DEMO)
                                     │                │ View your report     │ ✕ ─────────────┘
                                     ▼                ▼
                                  W9 Case Detail ──Take me to the animal──► safety check → responder flow (docs/03)
                                     │ Case chat → W10 · Share → device share sheet (live link)
                                     │ ⋯ Cancel report (own, Looking for help) → W9b
                                     │ ⋯ Passed away → W9c
                                     ▼
                              P1 Profile → P2 My Reports → W9
```

Leaving W3–W6 after the first media item always asks **"Discard this report?"**. Signed-out users pass through WA1–WA3 (one-time account setup) before W2/W3; there is no report draft until the first media item.

---

## Prototype classification summary

| Screen | Class |
|---|---|
| W0, W1a/b, W2, WA1–WA3, WA5, W3a–W3d, W4, W5, W6, W7, W8, W9, W9b, W9c, W10, P1, P2 | REAL PROTOTYPE (with SIMULATED DEMO seed data, fictional organisations, disabled calls) |
| W8a, demo banner, demo notifications, call toast, email OTP delivery (WA3 demo code) | SIMULATED DEMO |
| Community responder screens (see wireframes/02), Adoption, Food donations, Organisations directory, web case preview | Not wireframed in this file (see docs/04 screen inventory) |
