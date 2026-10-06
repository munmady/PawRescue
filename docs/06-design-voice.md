# 06 · Design & Voice

Direction only. The design system (tokens, specific colours, components) is created later.

## The feeling

**A calm, competent friend who knows what to do.** Emergency information is clear and high priority without sensationalising the situation.

The product should feel: **trustworthy · warm · calm · humane · action-oriented · premium · simple · modern · responsible**.

Avoid: excessive gamification, childish visuals, noisy social-media patterns, aggressive red everywhere, unnecessary animation, clutter, manipulative urgency, guilt-based copy. It should not look like a government portal, a hospital management system, a generic NGO website asking for money, an enterprise dashboard, or a social network.

---

## Visual direction

| Area | Direction |
|---|---|
| **Overall** | Clean, airy, photo-led. Generous spacing, soft rounded shapes (not bubbly). One clear action per screen. **Home leads with nearby animals in distress**; the report action is prominent but secondary; adoption, food donations, the directory link and Help & Safety (D128, D129) are visually quieter and never overpower emergencies. |
| **Typography** | A humanist or friendly sans-serif **with good Devanagari and other Indic companions**, for later localisation. Body at least 16 pt; status labels clear and larger. Two weights at most per screen. |
| **Colour philosophy** | Warm neutral backgrounds, not stark white or clinical blue. **One confident, warm primary colour for help actions** ("Take me to the animal", "Report an animal in distress"). **Red-family colours only for urgency** (e.g. "Looking for help"), never decoration and never everywhere. Distinct, calm colours for Accepted / Help reaching / transport / treatment states, always paired with text. A calm success colour for good outcomes. Readable in **direct sunlight**. Dark mode for night-time use. |
| **Photography** | Real photos of animals **recovered, healthy, with people** in marketing and empty states. Case photos are the reporter's evidence: injury media blurred by default ("tap to view") except for the handling organisation. No graphic images in marketing or empty states. |
| **Icons** | Rounded line icons with a consistent stroke, plus a custom set for the problem chips. Icons always paired with text. |
| **Cards** | The distress case card is the core Home element: photo, animal, location, reason, status, distance, view/action, Share. No cards inside cards; no social counters (likes, comments, helpers). The dashboard may be denser but stays calm. |
| **Map** | Clean, low-noise base map; status-coloured pins with labels; a selected-case preview card. Shows exactly the same cases as the List view (N5). Not a heat map, not a live-tracking map. Adoption listings never appear on it. |
| **Case chat** | A calm, utilitarian thread, not a social feed. The **official update area is pinned at the top** and visually distinct (e.g. an "Official update" label, organisation name and verified mark, a contained panel), so rescue instructions are never buried. Community messages below, plain, with no likes, reactions-as-ranking or profile pages. |
| **Evidence** | Case Detail shows all 1–4 photos/videos (swipeable) and a simple voice-note player. Injury media blurred by default with "tap to view". |
| **Blue Tick** | A single, quiet recognition indicator ("Responsible Reporter ✓") on the profile, and a small tick next to a name in case chat. Must look different from the "Official update" treatment and from organisation verified marks, so it never reads as a professional credential. Not a game mechanic: no points, counters, levels, progress bars, confetti or locked achievements. |
| **Illustration** | For Welcome, empty states and guides. Warm and simple. **Never illustrate injured animals**; illustrate people helping and animals recovered. |
| **Motion** | Calm and purposeful. Gentle status transitions. A small warm moment on good outcomes. **No celebration on sad outcomes.** Respect reduce-motion. |

## Accessibility and real-world conditions

- WCAG AA contrast minimum; aim higher for outdoor use.
- Tap targets at least 48 dp. The report flow works **one-handed**.
- Screen-reader labels on every chip, button, map pin and status.
- Works on **low-end Android** and slow connections: compressed images, skeleton loaders, no heavy animations.
- Plain language (roughly 6th-grade reading level). Ready for localisation.
- Never rely on colour alone for urgency or status.

---

## Voice

**Calm, kind, clear, honest.** Speak like a person, not a system. Short sentences. Never blame. Never overpromise. Never guilt-trip. Never imply medical diagnosis or guarantee rescue times.

### Rules

1. Lead with what matters for the animal and the person, not the system state.
2. Case IDs are secondary (small text, for support). The "AR-" prefix is a temporary placeholder.
3. "The dog" / "the cat" until the organisation gives a name.
4. Status copy answers: what happened, where the animal is, and whether it still needs help.
5. ETAs are always approximate ("about", "approximately").
6. Emoji only for status markers and positive outcomes, sparingly.
7. Never say "successfully". Never show error codes.
8. Bad news is stated plainly, kindly, and without graphic detail.
9. Optional help is always worded as an offer ("only if you're able"). Say **"Not able to"**, never "No".
10. The system never describes community responders' movements to others ("Rahul is approaching", "3 people are helping"). People may write about themselves in the case chat; the product never turns that into status.
11. Recognition copy is neutral ("Responsible Reporter", "Verified reporting", "Blue Tick"). Never "Top rescuer", "Hero", "Champion", "Points", "Earn", "Rank" or "Score", and never language implying professional qualifications ("certified rescuer", "trained responder", "vet", "official").
12. Medical and safety copy is illustrative in the prototype and subject to veterinary/medical validation before real use.
13. Official updates in the case chat are short, clear instructions from the handling organisation, labelled as official.
14. System copy and shares never reveal anyone's phone number, email, address or live location. In case chat, users may voluntarily share their own details; the product never does it for them.

Organisation names in the examples below ("Lumen Animal Rescue & Shelter") are fictional and do not represent any real organisation.

### Copy by situation

| Situation | ❌ Avoid | ✅ Prefer |
|---|---|---|
| Home section | "🔥 URGENT CASES!!!" | "Animals near you that need help" |
| Looking for help | "Status: NEW." | "🔴 Looking for help · This animal needs help" |
| Submitted | "Case #AR-10245 created successfully." | "Report sent. We're alerting rescue teams near you." |
| Mobile number | "Verify your number" / "Enter OTP" | "Your mobile number lets the rescue team reach you. Only the registered hospital or organisation handling this case will see it." (Shown read-only: "This is the mobile number on your account." D117) |
| Sign in | "Create an account to continue!!" | "Sign in to report, chat and keep your reports." (Name, email and mobile; a one-time code is sent to your email.) |
| Duplicate | "Duplicate detected." | "We may already have this animal's case. Someone has reported an animal in this area and help may already be on the way." |
| Accepted | "Status: ACCEPTED." | "Accepted by Lumen Animal Rescue & Shelter." |
| Help reaching (professional only) | "Arriving in 5 min." | "Help is approximately 5 min away." |
| Reaching hospital (professional) | "Status changed to TO_HOSPITAL." | "The rescue team is taking the dog to XYZ Veterinary Hospital." |
| Responder taking animal to hospital | "Reaching hospital." (reserved for professional transport) / "Rahul is taking…" (exposes the responder) / "Help this animal" (invites a second responder) | "🔵 Responder taking animal to hospital · This animal is being taken to a veterinary hospital." Selected hospital may be named. (Exact copy flexible.) |
| Community movement | System status "Rahul is going to the animal." / "Responder approaching" | (Never generated by the system.) |
| Official update (chat) | "FYI: status update" | "OFFICIAL UPDATE · Lumen Animal Rescue & Shelter — Rescue team has reached the location. Please do not approach the animal unless requested." |
| Share text | "Shared by Priya Sharma, 98XXX…" | "🐕 Injured dog · Hit by vehicle · Andheri East · 🔴 Looking for help. See the latest status: {link}" |
| Passed away pending | "Case closed. Animal dead." | "Someone has reported that this animal has passed away. Waiting for a veterinary hospital or rescue organisation to confirm." |
| Adoption | "Call the owner now" | "Chat with the poster to ask about adopting." |
| Safety check | "Hurry, the animal needs you!" | "Please only approach if it is safe for you and the animal. Injured or frightened animals may behave unpredictably. If the situation is unsafe, wait for a trained rescuer." |
| Can't transport | "Are you sure? The animal may suffer." | "That's okay. The case stays open for rescue teams." |
| Professional already active | "You can't help." | "Professional help is already on the way. Accepted by Lumen Animal Rescue & Shelter · approximately 5 min away." |
| Treatment update | "Medical record updated." | "Update from Lumen Animal Rescue & Shelter: his leg has been treated and he's resting." |
| Rescued | "Case closed: RELEASED." | "He's healed and back on his street. Thank you for stopping to help." |
| Death | "Outcome: DECEASED." | "We're sorry. The dog didn't survive. Because you stopped, he wasn't alone. Thank you for helping." |
| Could not locate | "Animal not found. Case closed." | "The team searched but couldn't find the dog. If you see him, share where in the case chat." |
| No response | "No organisation available." | "We haven't confirmed a team yet. Here's what you can do right now." |
| Recognition | "You're a Top Rescuer! +10 points" / "Rank #3 in Mumbai" / "Certified rescuer" | "Responsible Reporter ✓ — Recognised for responsible animal distress reporting." |
| Blue Tick in chat (tooltip) | "Verified rescuer" / "Official" | "Verified by the platform as a responsible reporter." |
| Thanks after reporting | "You earned points!" | "Thank you for reporting this animal." |
| Optional help | "Please stay with the animal." | "Only if you're able: can you stay nearby for a while?" with "Not able to" as an equal option |
| Call tapped (prototype) | "Call failed." | "Demo — calling is disabled in this prototype." |
| Error | "Error 500." | "That didn't send. Your report is saved. Try again." |
| Leaving a draft | (silently discard) | "Discard this report?" |
| Empty Home | "No data." | "No animals near you need help right now." |
| Could not locate (on Home) | "Case closed. Not found." | "The rescue team couldn't find this animal. If you see it, share where in the case chat." |
| Professional help active (on Home) | "Taken. Nothing to do." | "Professional help is on the way. You can still share useful information." |
| Empty My Reports | "No data." | "No reports yet. Cases you report or take to care will appear here." |
| Professional help became active while travelling | "Stop, you're not needed." | "Professional help is on the way. You can continue to the animal and share what you see." |
| Chat message blocked | "Your message violates policy." | "Please keep the conversation respectful. Abusive or inappropriate language isn't allowed in case chats." |
| Chat message failed | "Error: send failed." (and losing the text) | "Message not sent" · "Check your connection and try again." · Retry (the message is kept) |
| Flag a chat message | "Report" (clashes with "Report an animal") / "Report abuse!" | "Flag message" · reasons "Abusive or unprofessional language" / "False or misleading information" · "Thanks for flagging this. Our team will review it." |
| Account-setup email code wrong / expired | "Invalid OTP." / "Error: code expired." | "That code isn't right. Check it and try again." · "This code has expired. Tap Resend code to get a new one." |
| Sign-in failed | "Authentication error." | "Sign-in didn’t work" · "We couldn’t sign you in. Please try again." · Try Again |
| Chat role labels | Full names, phone numbers | "Priya · Reporter" · "Rahul · Community Responder ✓" · "Lumen Animal Rescue & Shelter · Organisation" |
| Adoption status | "Sold" / "Taken" | "Available" · "Adopted" |
| Food donation request | "Donate money now!" / "Any amount helps" | "Help feed 35 rescued cats and dogs. Select one product to donate." |
| Food donation placed | "Payment successful!" | "Thank you. Your donation will be delivered to Lumen Animal Rescue & Shelter." |

### Organisation dashboard voice

Same warmth, more direct: "Urgent · Dog · Hit by vehicle · 2.1 km · reported 6 min ago". Buttons are verbs: Accept, Mark on the way, Mark team reached, Mark reaching hospital, Confirm arrival, Mark under treatment, Post official update, Confirm, Close case.
