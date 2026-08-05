# MBOA FLIX 🎬

**A Cameroonian streaming and cultural discovery platform.**  
MBOA FLIX showcases Cameroonian movies, documentaries, food, culture, and creative content with a cinematic dark aesthetic.

---

## Project Structure

```
artifacts/mobile/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout (providers, fonts, splash screen)
│   ├── (tabs)/                 # Bottom tab navigation group
│   │   ├── _layout.tsx         # Tab bar config (NativeTabs + ClassicTabs fallback)
│   │   ├── index.tsx           # Home screen
│   │   ├── explore.tsx         # Explore / search screen
│   │   ├── culture.tsx         # Cameroonian food & culture screen
│   │   └── profile.tsx         # Profile placeholder screen
│   └── movie/
│       └── [id].tsx            # Movie detail screen (modal)
│
├── components/                 # Reusable UI components
│   ├── MovieCard.tsx           # Poster-style movie card (sm / md / lg sizes)
│   ├── CategoryButton.tsx      # Filter pill button (active/inactive states)
│   ├── SectionTitle.tsx        # Section heading with optional "See All" link
│   ├── MainButton.tsx          # Primary/secondary/outline CTA button
│   ├── HeroBanner.tsx          # Full-width featured movie hero
│   ├── ErrorBoundary.tsx       # App crash boundary (scaffold)
│   ├── ErrorFallback.tsx       # Error UI (scaffold)
│   └── KeyboardAwareScrollViewCompat.tsx
│
├── constants/
│   ├── colors.ts               # Semantic design tokens (dark cinematic theme)
│   └── theme.ts                # MBOA FLIX brand-specific colors & genre palette
│
├── data/                       # Local mock data (no backend yet)
│   ├── movies.ts               # 12 Cameroonian films with metadata
│   ├── categories.ts           # Genre filter categories
│   └── culture.ts              # Culture items (music, food, traditions, art)
│
├── hooks/
│   ├── useColors.ts            # Returns active color palette (light/dark)
│   └── use-toast.ts
│
├── types/
│   └── index.ts                # TypeScript interfaces: Movie, CultureItem, FoodItem
│
├── assets/
│   └── images/
│       ├── icon.png            # App icon (AI-generated)
│       └── hero-banner.jpg     # Hero banner background (AI-generated)
│
├── app.json                    # Expo config (dark mode, name, plugins)
└── package.json
```

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Home | `/` | Hero banner, trending, new releases, documentaries |
| Explore | `/explore` | Search + genre filter + movie grid |
| Culture | `/culture` | Music, food, traditions, art of Cameroon |
| Profile | `/profile` | User placeholder, settings, watchlist stub |
| Movie Detail | `/movie/[id]` | Full movie info, play button, cast |

---

## Design System

**Palette:**
- Background: `#0A0A0A` — deep black
- Surface: `#141414` — elevated surface
- Card: `#1C1C1C` — card background
- Gold: `#D4AF37` — primary brand color
- Red: `#C62828` — accent
- Orange: `#E65100` — warm accent

**Typography:** Inter (400 / 500 / 600 / 700) via `@expo-google-fonts/inter`

**Icons:** `@expo/vector-icons` (Feather), SF Symbols on iOS 17+

---

## How to Run

### Prerequisites
- Node.js 18+
- pnpm
- Expo Go app on your Android or iOS device

### Start the dev server
```bash
pnpm --filter @workspace/mobile run dev
```

Then scan the QR code with **Expo Go** on your device.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81 |
| Routing | Expo Router (file-based) |
| Language | TypeScript |
| Styling | React Native StyleSheet |
| Fonts | @expo-google-fonts/inter |
| Icons | @expo/vector-icons (Feather + SF Symbols) |
| Animations | expo-linear-gradient |
| Haptics | expo-haptics |
| State | useState (local), React Query (server-ready) |
| Storage | AsyncStorage (ready for future use) |

---

## Roadmap (Future Versions)

- [ ] User authentication (sign in / sign up)
- [ ] Video playback (streaming)
- [ ] Watchlist & favorites (AsyncStorage → backend)
- [ ] Search with real API
- [ ] Cameroonian food recipes detail page
- [ ] Push notifications for new releases
- [ ] Payment / subscription (RevenueCat)
- [ ] Real movie poster images
- [ ] Multilingual support (French / English)

---

## Notes

- All data is **local mock data** — no backend or API calls in v1
- Designed for **dark mode** — `userInterfaceStyle: "dark"` in app.json
- Compatible with **Expo Go** on Android and iOS
- Tab bar uses **NativeTabs** (iOS 26+ liquid glass) with **ClassicTabs** fallback
