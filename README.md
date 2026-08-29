# VELOOP Rewards — Exchange Center

**Repository:** https://github.com/Rudranil-12/Veloop_Watch_Ads
**LINK:** https://veloop-watch-ads-two.vercel.app/

A complete frontend redesign of the VELOOP Rewards Exchange Center. The
existing Gems → VEs exchange logic and rates are preserved exactly; only the
presentation, layout, and interaction design have been rebuilt from scratch.
The result is a **Reward Conversion Vault**, not a crypto swap screen — no
market price, no order book, no buy/sell controls, anywhere in the UI.

---

## 1. Project Overview

VELOOP Rewards members earn **Gems** through everyday activities (watching
ads, completing tasks, referrals, surveys) and can convert eligible Gems into
**VEs**, VELOOP's virtual reward currency, through predefined conversion
opportunities.

This project is a **frontend-only redesign** of that Exchange Center. It
keeps the underlying conversion logic and values identical to the current
production implementation, and rebuilds the layout, visuals, copy, and
interaction states so the page reads as a *reward conversion experience*
rather than a *trading/DeFi interface*.

## 2. Exchange Center Concept

**"The Conversion Vault."** Every conversion is visualised as a gem passing
through a glowing vault portal and emerging as a VE coin — a single
signature illustration (`VaultPortal`) that repeats at different scales in
the hero, on each conversion card, and in the confirmation modal, tying the
whole page together without resorting to crypto-swap visual language.

Design language deliberately avoids: market price, trading chart, order
book, buy/sell, liquidity, token price graph, swap wallet, ROI, market cap.
Instead it uses: conversion, exchange value, you receive, required Gems.

## 3. Features

- **Hero** introducing the conversion concept with the vault-portal motif
- **Balance overview** showing current Gems and VEs as a ledger, not a wallet
- **Earn Gems** — five "Watch Ad" reward tiers (Quick / Bonus / Mega /
  Partner Spotlight / Evening Booster), each with a live countdown ring
  during the ad, a gem-burst reward animation on completion, and a per-tier
  daily watch limit with a progress bar — plus a **"More ways to earn
  Gems"** row (Daily Check-in, Complete a Survey, Refer a Friend) linking to
  their respective pages
- **Available Conversions** grid — each card shows required Gems, the
  conversion, and VEs received, with a staggered scroll-reveal animation
- **Confirmation modal** with a review step, balances-after preview, an
  insufficient-balance state (CTA becomes **Earn More Gems**), a processing
  state that disables the button to prevent double-submission, and a
  success state
- **"How the exchange works"** 5-step explainer
- **Recent Conversions** history with status pills (Completed / Processing
  / Failed)
- **Exchange Rules** section
- **Notifications** — bell dropdown with unread badge, **Mark all read**,
  **Clear all**, and per-item dismiss
- **Dark / light theme toggle** — persisted across visits, defaults to the
  system preference on first load, every surface driven by CSS custom
  properties so both themes stay in sync
- Loading, empty, and error states for the conversions list, each themed to
  match the rest of the page
- Fully responsive from 320px up to large desktop displays
- Keyboard-accessible modal (focus on open, `Esc` to close, visible focus
  states throughout)

## 4. Exchange Logic

Values in `src/data/exchangeData.js` mirror the existing implementation
(e.g. `28 Gems → 151 VEs`, `39 Gems → 168 VEs`). Nothing about eligibility,
rates, or conversion behaviour was changed — only how it's presented.

```js
{
  id: 'exchange-01',
  type: 'gem-to-ve',
  requiredGems: 28,
  receiveVEs: 151,
}
```

`adRewardOptions` defines the "watch ad" Gem-earning tiers:

```js
{
  id: 'ad-01',
  gems: 12,
  durationSeconds: 5,
  dailyLimit: 5,
}
```

Clicking **Watch Ad** opens `AdWatchModal`, which simulates a rewarded ad
with a live countdown ring, then plays a gem-burst reward animation before
adding `gems` to the user's balance. Watch counts are tracked per tier and
capped at `dailyLimit` per day — swap the local counters for a real ad SDK
callback + backend cap when available.

## 5. User Flow

1. User opens the Exchange Center and sees their Gems / VEs balance.
2. User reviews an available conversion card, or tops up Gems via **Watch
   Ad** / one of the "more ways to earn" links.
3. User selects **Convert Rewards**.
4. A confirmation modal shows the exchange and the resulting balances.
5. User confirms → a short "Converting…" state prevents double-submission.
6. A success state confirms the new VE balance; balances and history update.

If the user doesn't have enough Gems, the card's CTA becomes **Earn More
Gems** and opens an explanatory state instead of a conversion.

## 6. Components

```
src/
├── components/
│   ├── common/
│   │   └── Reveal.jsx              scroll-into-view fade/slide wrapper
│   ├── layout/
│   │   ├── Sidebar.jsx             nav + quick balance widget
│   │   └── Topbar.jsx              search, theme toggle, notifications, profile
│   └── exchange/
│       ├── VaultPortal.jsx         signature gem → VE illustration
│       ├── InfoTip.jsx             accessible info icon + tooltip
│       ├── ExchangeHero.jsx        page header
│       ├── BalanceOverview.jsx     Gems / VEs balance ledger
│       ├── EarnGems.jsx            watch-ad reward tiers + other earn actions
│       ├── AdWatchModal.jsx        ad countdown + reward-burst animation
│       ├── ExchangeCard.jsx        single conversion opportunity
│       ├── ExchangeModal.jsx       review / insufficient / processing / success
│       ├── HowExchangeWorks.jsx    5-step explainer
│       ├── ExchangeHistory.jsx     recent conversions list
│       ├── ExchangeRules.jsx       rules panel
│       ├── ExchangeLoader.jsx      themed loading state
│       └── ExchangeStatePanels.jsx empty + error states
├── context/
│   ├── AppDataContext.jsx          shared balances, history, notifications
│   └── ThemeContext.jsx            dark / light theme state + persistence
├── pages/ExchangeCenter/
│   └── ExchangeCenter.jsx          composes the full page + local state
├── data/exchangeData.js            dummy data / exchange values
└── styles/tokens.css               design tokens (colour, type, radius) — dark + light
```

## 7. Technology Stack

- React 19 + Vite
- Bootstrap (grid utilities)
- CSS Modules for component styling
- React Hooks + Context for shared state (balances, theme, notifications)
- `lucide-react` for icons
- `framer-motion` for entrance, hover, scroll-reveal, and modal animation
- `react-router-dom` for in-app navigation (Tasks, Offers, Refer & Earn,
  Wallet, etc.)

## 8. Installation

```bash
git clone https://github.com/Rudranil-12/Veloop_Watch_Ads.git
cd Veloop_Watch_Ads
npm install
```

## 9. Local Development

```bash
npm run dev
```

Starts the Vite dev server with hot module reload. Open the printed local
URL (default `http://localhost:5173`).

## 10. Build Instructions

```bash
npm run build
npm run preview
```

`npm run build` produces an optimized production bundle in `dist/`.
`npm run preview` serves that build locally so you can sanity-check it
before deploying.

## 11. Responsive Design

- **320px+ (mobile):** cards stack vertically, balance cards stack, step
  grid becomes a single column, sidebar collapses behind the menu button
- **Tablet:** balanced 2-column conversion grid
- **Desktop / large screens:** content is capped at `max-width: 1240px` and
  centered, so the layout stays balanced instead of stretching on 1920px+
  displays — no horizontal overflow at any breakpoint

## 12. Animation System

- **Scroll reveal:** a reusable `<Reveal>` wrapper (`framer-motion`
  `whileInView`) fades and slides each major section into place the first
  time it scrolls into view; conversion cards stagger in individually
- **Page entrance:** soft fade/slide on route change
- **Card hover:** subtle elevation lift + border-color transition
- **Ad reward:** live countdown ring while an ad "plays," then a gem-burst
  animation on completion
- **Conversion:** animated confirmation modal (fade + scale), disabled
  "Converting…" state, success state with a checkmark reveal
- **Theme toggle:** icon cross-fades/rotates between sun and moon; surface
  colours transition smoothly instead of snapping
- **Reduced motion:** all animations respect `prefers-reduced-motion`

Animations are kept short (150–500ms) and are not used on anything that
would block interaction, per the "premium and controlled, not a gaming
screen" direction.

## 13. Future Backend Integration

Replace the `setTimeout` calls in `ExchangeCenter.jsx` (`loadOptions` /
`confirmConversion`) with real API calls. The data shapes in
`exchangeData.js` (`exchangeOptions`, `userBalance`, `conversionHistory`,
`adRewardOptions`, `notificationsSeed`, etc.) are intended to match the
eventual API response, so components should not need changes — only the
data-fetching layer in `AppDataContext.jsx` and `ExchangeCenter.jsx`.

## 14. Deployment

Build the project (`npm run build`) and deploy the `dist/` folder to Vercel
or Netlify.

`Live Demo: <add-deployment-url-here>`

## Design Tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg-base` | `#161827` | `#f4f5fb` | App background |
| `--bg-card` | `#21243e` | `#ffffff` | Card surfaces |
| `--gold` / `--gold-soft` | `#e7b45c` / `#f6d99a` | `#b9812a` / `#a9722a` | Reward accent, CTAs, VE values |
| `--blue` | `#7c9cfb` | `#3f5fd6` | Gem accent |
| `--violet` | `#8b7cf6` | `#6c4fe0` | Portal glow |
| `--success` / `--danger` | `#4ade80` / `#f2755a` | `#1f9d5c` / `#d1502f` | Status states |

Typefaces: **Space Grotesk** for display/headings, **Inter** for body copy,
**IBM Plex Mono** for numeric values (balances, rates) to give figures a
ledger-like, trustworthy feel — in both themes.
