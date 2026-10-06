# Rescue Network · citizen mobile app (prototype)

Expo (SDK 57) + Expo Router + TypeScript, styled with the **Rescue Network** design system (https://claude.ai/artifact/UabQRNhQQnXT3wctLjv5WJ). Runs on iOS, Android and the web. Everything is **demo mode**: fictional Mumbai cases and organisations, in-memory state, no backend yet.

## Run

```bash
npm install
npm run web      # or: npm run android / npm run ios (Expo Go)
```

The first web build takes a few minutes on a cold cache.

## What's in it

| Area | Route | Notes |
|---|---|---|
| Home (Map / List, case sheet) | `app/(tabs)/index.tsx` | One dataset for both views (`isVisibleOnHome`), urgent markers pulse, sheet springs up |
| Tabs (D139) | `app/(tabs)/_layout.tsx` | Home · Adoption · Donation · Profile, floating bar with a sliding indicator |
| Profile | `app/(tabs)/profile.tsx` | Your impact, My reports, My adoption listings, My food donations |
| Account setup (D137) | `app/auth.tsx` | Name → Email → Mobile → email code. Demo code **246810** is shown on screen |
| Report an animal | `app/report.tsx` | Media (1–4 or safety fallback) → What's wrong? → Where is it? → Mobile → Send → duplicate check → Report sent |
| Case Detail | `app/case/[id].tsx` | Evidence carousel, voice note, status/action area, case history, cancel / passed-away dialogs |
| Case chat | `app/case/chat/[id].tsx` | Anyone reads; posting needs an account; pinned official updates; Flag message |
| Responder flow | `app/respond/[id].tsx` | Safety check → navigation → status check → transport decision → mobile → hospital → Start transport → I've arrived |
| Directory, Help and safety | `app/directory.tsx`, `app/help.tsx` | Public |
| Adoption, Food donations | `app/(tabs)/adoption.tsx`, `app/(tabs)/donations.tsx`, `app/adoption/*`, `app/food/*`, `src/screens/*` | Secondary areas. Chat with poster (`app/adoption/chat/[id].tsx`) is one-to-one and needs an account |

Shared product rules (statuses, Home visibility, primary actions) live in `packages/shared/src/index.ts`.

## Demo behaviour (SIMULATED DEMO)

- A new report is accepted by Lumen Animal Rescue & Shelter after ~9 s and becomes "Help reaching in ~9 min" after ~22 s.
- After "I've arrived", the hospital confirms arrival after ~6 s (Hospital reached, D110).
- Calls, maps hand-off and payments show demo messages; nothing leaves the device.
- Adoption chat: the poster replies to your first message after ~3.5 s.
- Food donation product images come from `media/` and are labelled "for illustration only; no brand partnership is implied". Products without an image fall back to unbranded pack art (`src/ProductArt.tsx`).
- Chat: a message containing the word "fail" demonstrates the "Message not sent" / Retry state; a few test words trigger the respectful-conversation filter.

## Not built yet

Organisation dashboard and admin (`apps/dashboard`), Supabase backend, real maps, camera and audio capture, the poster's side of adoption chats (conversations in My adoption listings), notifications. Deferred items (N10, D127, D132) are intentionally not designed.
