# Wireframes 04 · Adoption and food donations (low fidelity)

**Scope:** the two secondary areas. Adoption: list → detail → chat with poster; create / edit; My Adoption Listings (mark Adopted, remove). Food donations: requests → request detail → product and quantity → payment → donation placed → My Food Donations. Screen IDs map to [docs/04](../docs/04-screens.md#g-adoption-secondary-never-on-the-distress-maplist) (ADOPT-01…06, FOOD-01…07).

**Source of truth:** D75, D94, D103, D125, D126 (adoption); D95, D104, D115, D120, D124 (food); D130 (empty states); D137 (account setup / sign-in). These wireframes add no features. Layout only.

**Rules**

- Secondary to emergencies: reached from the Adoption and Donation tabs (D139) and Home sections 3 and 4; **never on the distress map/list**.
- **No pet management** (no pet profiles, health records, reminders or appointments).
- Adoption: status **Available / Adopted** only; **Chat with poster**; the poster's phone is never shown.
- Food: **product-based only**; one product per donation; no cash or free amounts; requests only from registered/verified veterinary hospitals, rescue organisations and shelter homes. **Payment and delivery are SIMULATED DEMO.**
- Browsing needs no account; creating a listing, chatting and donating need an account (one-time email OTP setup, WA1–WA3).

---

## Adoption

### AD1 · Adoption list · ADOPT-01

```
┌──────────────────────────────────┐
│ ← Home          Adoption         │
│  ( + List an animal )            │
│ ┌──────────────────────────────┐ │
│ │ ▢ photo                      │ │
│ │ Mishti · Cat · ~4 months     │ │
│ │ Bandra West · AVAILABLE      │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢ photo                      │ │
│ │ Dog · ~2 years · Powai       │ │
│ │ ADOPTED                      │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Browse animals looking for a home. |
| **Content rules** | Photo, name (if known), type, approximate age, area, status. No Blue Tick, no poster phone. Removed listings never appear (D126). |
| **States** | *Empty:* "No animals listed for adoption near you right now." (D130). *Loading:* skeleton. |
| **Class** | REAL PROTOTYPE |

---

### AD2 · Listing detail · ADOPT-02

```
┌──────────────────────────────────┐
│ ← Adoption                      ⋯│
│ [PHOTOS 1/3 · swipe]             │
│ Mishti · Cat · AVAILABLE         │
│ ~4 months · Female               │
│ 📍 Bandra West                    │
│ About: Playful, used to people.  │
│ Temperament: friendly with cats  │
│ Special needs: none              │
│ Vaccination: Partially           │
│  vaccinated (first dose done)    │
│ Adoption requirements: indoor    │
│  home; follow-up visit.          │
│ Listed by Neha                   │
│                                  │
│  [     Chat with poster      ]   │
└──────────────────────────────────┘
```

**Poster's own view** replaces the button with: `( Edit )  ( Mark Adopted )  ‹ Remove listing ›`.


| | |
|---|---|
| **Purpose** | Everything an adopter needs to decide whether to ask. |
| **Primary CTA** | Chat with poster → sign-in if needed → AD5 |
| **Content rules** | All D94 fields. Poster information shows first name (or organisation name); **no phone number**. People may share contact details voluntarily in chat. |
| **Class** | REAL PROTOTYPE |

---

### AD3 · Create / edit listing · ADOPT-03

```
┌──────────────────────────────────┐
│ ✕             List an animal     │
│ Photos  ▢ ▢  ( + Add )           │
│ Animal  ( Dog ) ( Cat ) ( Other )│
│ Name (if known)  ____________    │
│ Approximate age  ____________    │
│ Gender  ( Male ) ( Female )      │
│         ( Unknown )              │
│ Location  📍 Bandra West  ‹ Edit ›│
│ Description  ________________    │
│ Temperament  ________________    │
│ Special needs  ______________    │
│ Vaccination status               │
│  ( Vaccinated ) ( Partially )    │
│  ( Not vaccinated ) ( Unknown )  │
│ Vaccination details (optional)   │
│ Adoption requirements  _______   │
│                                  │
│  [          Publish          ]   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | List an animal for adoption (users and verified organisations; organisations use the dashboard, O9). |
| **Primary CTA** | Publish → AD2 (status Available) |
| **Required / optional** | **Required (D135):** photos (1+), animal type, approximate age, gender (Male / Female / Unknown), location, description, vaccination status. **Optional:** name, temperament, special needs, vaccination details, adoption requirements. |
| **Class** | REAL PROTOTYPE |

---

### AD4 · Mark Adopted / Remove listing · ADOPT-04 · D126

```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Mark Mishti as adopted?        ││
││ The listing will show          ││
││ "Adopted".                     ││
││ [       Mark Adopted         ] ││
││ ( Cancel )                     ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```


```
┌──────────────────────────────────┐
│┌────────────────────────────────┐│
││ Remove this listing?           ││
││ It will no longer appear in    ││
││ Adoption.                      ││
││ [      Remove listing        ] ││
││ ( Keep listing )               ││
│└────────────────────────────────┘│
└──────────────────────────────────┘
```

Copy locked by D135.


---

### AD5 · Adoption chat · ADOPT-05

```
┌──────────────────────────────────┐
│ ← Mishti        Chat with Neha   │
│ ┌──────────────────────────────┐ │
│ │ Hi, is Mishti still          │ │
│ │ available?            Arjun  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Yes! Happy to talk.    Neha  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Write a message…          ➤  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | One-to-one conversation between an interested user and the poster. |
| **Content rules** | First names only; contact details only if voluntarily shared. Interested users get back here by reopening the listing (D125); posters via My Adoption Listings. No flag action (D113). Abuse filter and "Message not sent" / Retry apply. |
| **Class** | REAL PROTOTYPE |

---

### AD6 · My Adoption Listings (Profile) · ADOPT-06 / PROFILE-03

```
┌──────────────────────────────────┐
│ ← Profile   My Adoption Listings │
│ ┌──────────────────────────────┐ │
│ │ ▢ Mishti · AVAILABLE         │ │
│ │ 2 conversations            › │ │
│ │ ( Edit ) ( Mark Adopted )    │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▢ Bruno · ADOPTED            │ │
│ │ 1 conversation             › │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Posters manage their own listings and conversations (D103). |
| **Secondary** | Open listing → AD2 (Edit, Mark Adopted, Remove) · Open conversations → AD5 |
| **States** | *Empty:* "You haven't listed an animal for adoption." (D130) |
| **Class** | REAL PROTOTYPE |

---

## Food donations

### FD1 · Food donation requests · FOOD-01

```
┌──────────────────────────────────┐
│ ← Home         Food donations    │
│ ┌──────────────────────────────┐ │
│ │ Lumen Animal Rescue & Shelter│ │
│ │ Help feed 35 rescued cats    │ │
│ │ and dogs.            OPEN  › │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Lumen Animal Rescue & Vet    │ │
│ │ Care · Recovery diet for     │ │
│ │ patients.            OPEN  › │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Purpose** | Discover what registered organisations need. |
| **States** | *Empty:* "No food donation requests right now." (D130) |
| **Class** | REAL PROTOTYPE (fictional organisations) |

---

### FD2 · Request detail and product choice · FOOD-02

```
┌──────────────────────────────────┐
│ ← Food donations                 │
│ Lumen Animal Rescue & Shelter    │
│ Help feed 35 rescued cats and    │
│ dogs.                            │
│ Select one product to donate     │
│  (•) Whiskas Dry Cat Food 1 kg   │
│      ₹XXX                        │
│  ( ) Whiskas Dry Cat Food 3 kg   │
│      ₹XXX                        │
│  ( ) Whiskas Dry Cat Food 5 kg   │
│      ₹XXX                        │
│ Delivered to the organisation's  │
│ registered address.              │
│  [      Choose & Donate      ]   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **Primary CTA** | Choose & Donate → account setup if needed (WA1–WA3) → FD3 |
| **States** | *Fulfilled (FOOD-07):* "FULFILLED" label; product choice and button hidden. |
| **Class** | REAL PROTOTYPE · prices are illustrative placeholders |

---

### FD3 · Confirm quantity · FOOD-03

```
┌──────────────────────────────────┐
│ ← Back                           │
│ Whiskas Dry Cat Food · 3 kg      │
│ ₹XXX each                        │
│                                  │
│ Quantity   ( − )   1   ( + )     │
│                                  │
│ Total  ₹XXX                      │
│ To: Lumen Animal Rescue &        │
│     Shelter (registered address) │
│                                  │
│  [       Continue to pay      ]  │
└──────────────────────────────────┘
```

---

### FD4 · Payment (SIMULATED DEMO) · FOOD-04

```
┌──────────────────────────────────┐
│ ← Back                     DEMO  │
│ Pay ₹XXX                         │
│ Demo payment: no real money is   │
│ taken in this prototype.         │
│                                  │
│  [            Pay            ]   │
└──────────────────────────────────┘
```

| | |
|---|---|
| **States** | *Payment failed (D124 "Failed"):* "Payment didn't go through. You haven't been charged. Try again." Donation not placed (D135). |
| **Class** | SIMULATED DEMO (no payment provider) |

---

### FD5 · Donation placed · FOOD-05

```
┌──────────────────────────────────┐
│ DEMO                             │
│ Thank you. Your donation will be │
│ delivered to Lumen Animal Rescue │
│ & Shelter.                       │
│                                  │
│ Whiskas Dry Cat Food 3 kg × 1    │
│ Payment: Paid · Order placed     │
│                                  │
│ ‹ See My Food Donations ›        │
│  [            Done           ]   │
└──────────────────────────────────┘
```

---

### FD6 · My Food Donations (Profile) · FOOD-06 / PROFILE-04

```
┌──────────────────────────────────┐
│ ← Profile     My Food Donations  │
│ ┌──────────────────────────────┐ │
│ │ Whiskas 3 kg × 1 · ₹XXX      │ │
│ │ Lumen Animal Rescue & Shelter│ │
│ │ Out for delivery · 2 Oct   › │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Dry dog food 1 kg × 2 · ₹XXX │ │
│ │ Delivered · Fulfilled      › │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**FD6a · Donation detail (FOOD-06a):** organisation · product · quantity · amount · date · **Payment** Paid / Failed · **Delivery** Order placed → Out for delivery → Delivered · **Fulfilment** Open / Fulfilled (D124).


| | |
|---|---|
| **States** | *Empty:* "You haven't donated food yet." (D130) |
| **Class** | REAL PROTOTYPE · statuses SIMULATED DEMO |

---

## Flow

```
Home §3 Adoption ─► AD1 list ─► AD2 detail ─Chat with poster─► (WA if signed out) ─► AD5 chat
                       │ + List an animal ─► (WA) ─► AD3 create ─► AD2
Profile ─► AD6 My Adoption Listings ─► AD2 (Edit · Mark Adopted · Remove) / AD5 conversations

Home §4 Food ─► FD1 requests ─► FD2 choose product ─Choose & Donate─► (WA) ─► FD3 quantity ─► FD4 pay (DEMO) ─► FD5 placed
Profile ─► FD6 My Food Donations ─► FD6a detail (payment · delivery · fulfilment)
```

---

## Prototype classification summary

| Screen | Class |
|---|---|
| AD1–AD6, FD1–FD3, FD5, FD6 | REAL PROTOTYPE |
| FD4 payment, delivery statuses, demo banner | SIMULATED DEMO |
