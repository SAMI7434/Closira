# Closira Engineering Internship Assignment — Frontend

React Native (Expo) mobile app for the Closira enquiry management system.

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Expo](https://img.shields.io/badge/Expo-51-black?logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.74-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

---

## Tech Stack

| Library | Purpose |
|---|---|
| Expo 51 | React Native app framework |
| React Navigation 6 | Bottom tabs + native stack |
| NativeWind | Utility-first CSS in RN |
| TypeScript | Static typing |
| `date-fns` | Date formatting |

---

## Architecture

```
src/
├── components/         Reusable UI widgets (LeadCard, StatusBadge, …)
├── screens/            Top-level screens (Dashboard, Leads, Escalations, …)
├── navigation/         Tab navigator + stack overrides
├── mock/               Realistic mock data (mirrors backend DTOs)
├── hooks/              Custom React hooks
├── services/           API client (fetch wrapper)
├── types/              Shared TypeScript interfaces
├── constants/          Labels, colours, status config maps
├── utils/              Formatting / helper functions
└── assets/             Images, icons, fonts
```

| Layer | Guideline |
|---|---|
| Components | Pure, prop-driven, no business logic |
| Screens | Orchestrate components + mock data |
| Services | Thin fetch wrappers — swap mock for live backend URL |
| Types | Single source of truth — keep in sync with backend Pydantic schemas |

---

## Getting Started

```bash
# 1. Clone / enter the project folder
cd frontend

# 2. Install dependencies
npm install

# 3. (optional) iOS / Android — place the app inside a workspace
npx expo prebuild

# 4. Start the dev server
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

---

## Project Structure

```
frontend/
├── App.tsx
├── src/
│   ├── components/   StatusBadge, LeadCard, EscalationCard, … (8 total)
│   ├── screens/      Dashboard, LeadsList, Escalations, FollowUps, ConversationDetail
│   ├── navigation/   TabNavigator + RootStack
│   ├── mock/         Realistic mock data matching backend DTOs
│   ├── hooks/        useDarkMode skeleton
│   ├── services/     fetch API client
│   ├── types/        TypeScript interfaces for API, navigation
│   ├── constants/    Colors, channel labels, status config
│   ├── utils/        Date formatting, conditional classnames
│   └── assets/       Icons, images
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── babel.config.js
└── README.md
```

---

## Screens at a Glance

| Screen | Navigation | Purpose |
|---|---|---|
| **Dashboard** | Home tab | KPI summary cards + latest enquiries feed |
| **Leads** | Leads tab | Searchable list of all enquiries |
| **Escalations** | Escalations tab | Issues flagged for human agents |
| **Follow-ups** | Follow-ups tab | All follow-up notes, grouped by enquiry |
| **Conversation Detail** | Stack push | Full enquiry view + timeline + actions |

---

## components

| Component | Props | Use |
|---|---|---|
| `StatsCard` | `label`, `value`, `colorClass?` | KPI tiles on Dashboard |
| `LeadCard` | `enquiry`, `onPress?` | Enquiry list items |
| `EscalationCard` | `escalation`, `onPress?` | Escalation list items |
| `FollowUpCard` | `followUp`, `backgroundColor?` | Individual follow-up note |
| `StatusBadge` | `status` | Pill badge — uses STATUS_CONFIG |
| `ChannelBadge` | `channel` | Coloured channel pill |
| `Timeline` | `entries` | Vertical stepper |
| `ConversationBubble` | `message` | Chat bubble (left = agent, right = customer) |

---

## Connecting to the Backend

In `src/services/api.ts`, update `BASE_URL` from `http://localhost:8000/api/v1` to your deployed backend URL:

```typescript
export const API_BASE = "https://api.closira.tech/api/v1";
```

Mock data in `src/mock/data.ts` is currently used by screens for UI preview.
Replace these imports with real API calls once the backend is running.

---

## Environment

| Variable | Default | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Backend API base URL |

```bash
# .env (Expo reads this automatically — rename .env.example to .env)
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Scripts

| Script | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Launch Android emulator |
| `npm run ios` | Launch iOS simulator |
| `npm run web` | Open in browser |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint pass |
