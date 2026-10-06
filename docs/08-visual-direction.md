# 08 · Visual direction (exploration)

**Status: EXPLORATION, no direction chosen.** Three distinct visual directions for the same product, tested on the four Home screens from [wireframes/01-home.md](../wireframes/01-home.md): H1 Map default, H2 Selected case, H4 List, H5 Empty nearby. The UX structure, Home hierarchy, status rules and copy are unchanged; only the visual language differs.

**Visual examples:** [design/explorations/home-visual-directions.html](../design/explorations/home-visual-directions.html) (open in a browser). Photography appears as placeholders showing each direction's treatment; maps are illustrative drawings, not a map-provider decision. All content is fictional Mumbai prototype content.

**Relationship to [06-design-voice.md](06-design-voice.md):** these explorations keep its rules (red family only for urgency; status never by colour alone; sunlight readability; Indic-ready type; no childish illustration; Blue Tick quiet; dark mode later). 06 suggests "one confident, warm primary colour for help actions": Direction 02 follows that literally; Directions 01 and 03 deliberately test cooler primaries so the choice is informed. Whichever direction is chosen, 06 will be updated to match.

**Shared rules in all three directions**

- Emergency information wins over decoration: *animal → where → what happened → does it need help → what can I do*.
- **Status = icon + text label + colour**, never colour alone. Red-family colour is used only for **Looking for help**.
- One strong action per view (Take me to the animal or Report an animal in distress); everything secondary is quieter.
- The secondary row (adoption, food donations, directory, Help & Safety) stays text-weight in every direction.
- No responder identity, counts or movement anywhere; markers sit at the animal's location.

**Status icon vocabulary (shared, Tabler outline icons as placeholders)**

| Status | Icon | Label |
|---|---|---|
| Looking for help | siren (`urgent`) | Looking for help |
| Accepted by organisation | check circle | Accepted by {organisation} |
| Help reaching in ~N min | clock | Help reaching in ~N min |
| Rescue team reached | pin with check | Rescue team reached |
| Reaching hospital | ambulance | Reaching hospital |
| Responder taking animal to hospital | route | Responder taking animal to hospital |

---

## Direction 01 · Signal (civic / trusted response)

**Philosophy.** "Something I would trust during an urgent situation." A calm, highly legible response tool: structure, not decoration, does the work. Status is spelled out, actions are unmistakable, and the map is a clear operational surface. Modern civic product, not a government portal.

**Colour**

| Role | Value | Note |
|---|---|---|
| Primary (help actions) | Response teal `#0F4C5C` | Calm authority; high contrast with white |
| Background | `#F5F6F4` | Slightly warm off-white, not clinical |
| Surface | `#FFFFFF` | Header, sheets, list rows |
| Primary text | `#121619` | |
| Secondary text | `#55606A` | |
| Urgent (Looking for help) | `#C21F32` | Only red in the system |
| Other statuses | muted, desaturated hues (slate blue, dark amber, green, steel, violet) | Low saturation so urgency stands out |
| Map | Light neutral base, white roads, soft water/park tints | Quiet canvas for markers |

**Typography.** IBM Plex Sans (with IBM Plex Sans Devanagari for later localisation). Engineered, neutral, excellent at small sizes and in sunlight. Titles 600, body 400; status labels in small caps with letter-spacing for scan speed.

**Shape language.** 8px controls and buttons, 10px cards, 16px sheet top corners. Hairline borders and dividers over shadows; list = dense divided rows, not floating cards. Segmented Map/List control.

**Component language.** Header on white with a divider; full-width primary buttons; status chip = left accent bar + icon + uppercase label on a faint tint; circular markers filled with the status colour, the urgent one larger with a halo.

**Photography.** Square, consistent crops; neutral colour grade; the animal centred and identifiable; evidence first, emotion second. Sensitive images blurred until tapped.

**Map treatment.** A light, low-noise "operations" map: muted base, clear roads, the 5 km area as a thin dashed ring, the user as a solid dot. Markers are the only saturated elements.

**Strengths.** Highest status legibility and density; fastest scanning; scales effortlessly to the organisation dashboard and admin; strong accessibility.
**Potential weaknesses.** Less emotionally expressive; could feel utilitarian or "default" without strong photography; less memorable as a hero screen.
**Portfolio suitability.** Demonstrates rigour, systems thinking and accessibility maturity. Strong for a product-design-led case study; less striking visually.

---

## Direction 02 · Kindred (human / warm / premium)

**Philosophy.** "Technology that genuinely cares." Warm paper tones, generous whitespace and real animal photography carry the emotion; a soft editorial serif gives the product a human voice. Warm and premium, never cute.

**Colour**

| Role | Value | Note |
|---|---|---|
| Primary (help actions) | Banyan green `#2E5A4B` | Grounded, natural, trustworthy; not a pet-app pastel |
| Background | Paper `#F4EEE5` | Warm neutral foundation |
| Surface | `#FBF8F2` | Sheets and cards |
| Primary text | Warm ink `#2A221C` | |
| Secondary text | `#7A6C5F` | |
| Urgent (Looking for help) | Clay red `#A8322A` | Warm but unmistakable |
| Accent | Saffron `#B07A1E` | Help reaching / warmth, used sparingly |
| Map | Warm paper map, soft sage parks, muted water | Feels printed, not embedded |

**Typography.** Fraunces (display serif) for screen titles and animal names; Mukta (by Ek Type, Latin + Devanagari) for all UI, controls and status. Serif = the human voice; sans = the reliable system.

**Shape language.** Generous radii where it helps warmth: 14px buttons, 18–22px cards, 28px sheet top; the map itself is an inset rounded panel. Soft, low shadows; underline tabs instead of a segmented control.

**Component language.** Photo-led: map markers are circular **animal photo** thumbnails ringed in the status colour with a small status badge; list cards lead with a large image; status pills are soft tints with icon + sentence-case label.

**Photography.** The emotional core. Eye-level, natural light, warm grade, the animal's face visible, dignity always (no graphic injury in previews; sensitive media blurred). Real photos, never illustrations of animals.

**Map treatment.** A warm, editorial "paper" map inset within the page, with photo markers making each case feel like an individual animal rather than a data point.

**Strengths.** Highest emotional connection; very distinctive and premium; strong hero imagery; humane tone matches the product's mission.
**Potential weaknesses.** Photo-led cards are slower to scan and show fewer cases per screen; softer status treatment reduces urgency contrast; harder to carry into dense dashboard screens; depends heavily on photo quality (user-generated evidence will vary).
**Portfolio suitability.** Most beautiful screens for a case study; must show clearly that emergency clarity was not sacrificed.

---

## Direction 03 · Pulse (modern / bold / digital)

**Philosophy.** "A next-generation emergency-response network." A deep, quiet map surface with luminous case markers, a crisp white action panel, big numerals for distance and time, and sharp, confident status blocks. Technology-forward but humane.

**Colour**

| Role | Value | Note |
|---|---|---|
| Primary (help actions) | Cobalt `#1D3EE8` | Confident, digital, trustworthy |
| Map / header surface | Map ink `#0D141D` | Dark operational canvas |
| Panel surface | `#FFFFFF` (list background `#EEF0F3`) | Light action area keeps reading comfortable |
| Primary text | `#0A0E13` | |
| Secondary text | `#5A6472` | |
| Urgent (Looking for help) | Alert red `#E8333F` | Glows on the dark map |
| Other statuses | Clear, saturated set (cobalt, amber, green, sky, violet) | Each paired with icon + text |
| Map | Deep ink base, subtle road lines, faint parks/water, blue 5 km ring | Product-specific, not a generic map |

**Typography.** Anek Latin (variable width; the Anek family covers Devanagari, by Ek Type). Wide, heavy headlines; condensed numerals for distance and ETA; one family with many voices.

**Shape language.** Sharp: 4–5px controls and buttons, 6px cards, 12px sheet top. Diamond markers. Status chips are solid blocks; list cards carry a 4px status edge.

**Component language.** Floating dark header over the map; white action panel with a cobalt top edge; big "5" case count and "850 m" distance numerals; data rows with small uppercase labels (Location · Reported); solid status blocks with icon.

**Photography.** Tight, high-contrast crops with a cool grade so photos sit comfortably on dark surfaces; small uppercase metadata captions.

**Map treatment.** The map is the hero: a dark, calm canvas where red urgent markers glow with a halo and other states are clearly coloured diamonds. Feels like a purpose-built network view, not Google Maps.

**Strengths.** Most contemporary and memorable; strongest contrast for urgent cases; numbers make distance/time instantly scannable; strong hero screen.
**Potential weaknesses.** Dark map can feel colder or "for experts" if overdone; more colours in the status set to manage; risk of drifting toward a tech-dashboard look; dark surfaces need care in bright sunlight.
**Portfolio suitability.** Highest visual impact; must demonstrate that it remains humane and readable outdoors.

---

## Comparison

| Criteria | Direction 01 · Signal | Direction 02 · Kindred | Direction 03 · Pulse |
|---|---|---|---|
| Trust | Very high: calm, legible, institutional without being bureaucratic | High: warmth builds personal trust; slightly less operational | High: confident and precise; the dark map must stay calm |
| Emotional connection | Moderate: relies on content more than form | Very high: photography and serif voice carry compassion | Moderate: energy and momentum more than tenderness |
| Emergency clarity | Very high: strongest status legibility and density | Good: photo-led cards scan slower; softer status pills | Very high: strongest contrast, big numerals, unmistakable urgent marker |
| Modernity | Good: contemporary but restrained | Good: editorial and premium rather than "tech" | Very high: most contemporary and distinctive |
| Portfolio impact | Solid: rigour and systems thinking; less memorable | Strong: beautiful hero shots; risk of lifestyle-app feel | Strong: most memorable hero; must prove it stays humane |
| Scalability | Very high: simple tokens; easy dashboard/admin reuse | Moderate: serif and photo-led layouts harder in dense screens | High: sharp tokens scale; dark/light split needs care |

No direction is selected. The chosen direction (or a deliberate blend) will become the basis of the design system.
