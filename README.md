# MAYER DUA: FUNNY SYLHETI CNG SIMULATOR 🛺💨
*(মায়ের দোয়া: ফানি সিলেটি সিএনজি সিমুলেটর)*

An original, full-stack 3D arcade auto-rickshaw simulator and comedy satire game set in the bustling streets of Sylhet, Bangladesh. Built with React, TypeScript, Three.js, React Three Fiber, Zustand, Node.js, Express, and Prisma ORM.

Reference inspiration: [baperrasta.com](https://baperrasta.com/) *(Original game design, code, artwork, and comedy assets)*.

---

## 🌟 Key Features

1. **Realistic & Arcade 3D CNG Auto-Rickshaw**:
   - Iconic Bangladeshi green-and-yellow CNG auto-rickshaw chassis with curved metal cage, yellow canvas roof with "মায়ের দোয়া" calligraphy, headlights, and front-steering wheel.
   - Agile 3-wheeler physics with chassis body lean into high-speed corners and suspension bounce.
   - Procedural Web Audio API sound engine (2-stroke engine RPM pitch modulation, comical twin-honk "PEEP! PEEP!", bumps, and coins chime).
   - Dynamic headlights and weather toggle (torrential Sylhet rain storm with falling particles).

2. **3D Sylhet City Map**:
   - **Zindabazar Point**: Crossroads with colorful Bangla neon signs (*সুরমা হোটেল*, *মায়ের দোয়া টেলিকম*, *জিন্দাবাজার ক্লথ*).
   - **Chowhatta Point**: Grand roundabout with Shaheed Minar tribute monument.
   - **Ambarkhana Market**: Fruit and vegetable market stalls with striped awnings.
   - **Bandar Bazar & Keane Bridge**: Surma River embankment and iconic red arched truss bridge.
   - **Roadside Tong er Dokan**: Tea stalls with steaming kettles and wooden benches.
   - **Interactive Obstacles**: Potholes and puddles causing realistic bumps, roaming Sylheti Eid goats (*খাসি*) that react when honked at!

3. **Satirical Newspaper: "মায়ের দোয়া সংবাদ"**:
   - Vintage Bangladeshi newspaper print aesthetic with cream paper texture, bold Bengali serif headlines, and red breaking news badges.
   - Procedural headline and editorial article generator reacting dynamically to real gameplay events, chaos rating, speed, and mission outcome.
   - Three fictional witness quotes per issue (*আম্বরখানার চা বিক্রেতা বদরুল মিয়া, ট্রাফিক পুলিশ কফিল উদ্দিন, পথচারী ছালেহা বেগম, রফিক ড্রাইভার*).
   - In-game screenshot / illustration, mission statistics, Taka rewards, and Web Share API / Copy functionality.

4. **Live Event-Driven Comedy Engine**:
   - Priority-queued comedy engine with per-event cooldowns and anti-repetition rules.
   - Over 60 original Sylheti jokes and dialogue variations in Bangla script with English subtitles.
   - Real-time animated Breaking News Ticker.

5. **10 Missions**:
   - **Mission 1: Zindabazar Fare Battle (জিন্দাবাজার ভাড়া যুদ্ধ)**: Bargain with stingy uncle Abul Chacha and rush to Chowhatta! *(MVP Ready)*
   - **Mission 2: Ambarkhana VIP Goat (আম্বরখানা ভিআইপি খাসি)**: Transport a 1-Lakh Taka Eid prize goat on the backseat to Tilagor without dizziness! *(MVP Ready)*
   - **Mission 3: Bandar Bazar Chicken Delivery (বন্দরবাজার মুরগি ডেলিভারি)**: Rush crates of live squawking Sylheti chickens to a master chef at Keane Bridge before wedding biryani runs out! *(MVP Ready)*
   - **Missions 4–10**: Previewed with hilarious teasers for upcoming milestones.

6. **Garage Customization & Upgrades**:
   - **Paints**: Classic Green & Yellow, Londoni VIP Gold, Surma Cyber Neon, Royal Bengal Stripes.
   - **Decals**: মায়ের দোয়া, আল্লাহ সর্বশক্তিমান, ১০০ হাত দূরে থাকুন, হর্ন দিয়া লজ্জা দিবেন না.
   - **Horns**: সিলেটি পীপ-পীপ হর্ন, হাইড্রোলিক ব্লাস্ট হর্ন, বিয়ার সানাই হর্ন.
   - **Accessories**: সিডি ও লেবু-মরিচ মিরর চার্ম, ছাদর লাগেজ ক্যারিয়ার.

7. **Anti-Cheat & Server-Validated Economy**:
   - Cryptographically issued mission session tokens (`ms_...`) with challenge nonces.
   - Server-side physical travel time checks based on Euclidean distance and top velocity to prevent teleportation/speed hacks.
   - Server-side fare and reward calculation.
   - Replay protection (each mission session token can only be claimed once).

---

## 🏗️ Architecture

```
mayer-dua/
├── frontend/                     # React + TypeScript + Vite + Tailwind + Three.js
│   ├── public/                   # Static icons & textures
│   └── src/
│       ├── game/                 # CNGVehicle.tsx, SylhetMap.tsx, GameScene.tsx, PassengerNPC.tsx
│       ├── comedy/               # CommentaryEngine.ts, HeadlineGenerator.ts, NewspaperGenerator.ts
│       ├── components/           # MainMenu, GameHUD, Newspaper, BreakingNews, Modals
│       ├── stores/               # Zustand stores (useGameStore, useCommentaryStore, usePlayerStore)
│       ├── services/             # api.service.ts, sound.service.ts
│       ├── App.tsx
│       └── main.tsx
├── backend/                      # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── controllers/          # guest, mission, garage, leaderboard, newspaper
│   │   ├── services/             # antiCheat.service.ts, newspaper.service.ts
│   │   ├── middleware/           # auth, errorHandler, rateLimit
│   │   └── server.ts
│   └── prisma/
│       ├── schema.prisma         # Player, GuestSession, Mission, MissionSession, Garage, Leaderboard
│       └── seed.ts               # Seed data for missions, items, and top drivers
└── shared/
    └── types/                    # Shared TypeScript interfaces & types
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18 (Node v24 tested)
- npm >= 9

### 1. Install Backend Dependencies & Seed Database
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Install Frontend Dependencies & Start Game
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🛡️ Anti-Cheat & Security Documentation

### Implemented Measures
1. **Server-Issued Mission Sessions**: Clients cannot fabricate mission completions without a valid, unexpired server session token.
2. **Speed & Physical Time Bounds**: Minimum realistic travel time is calculated on the server using Euclidean waypoint distances and maximum vehicle speed limits.
3. **Fare Negotiation Bounds**: Validates that negotiated fares do not exceed allowed mission multipliers.
4. **Server-Side Reward Calculation**: Total Taka, tips, and chaos bonuses are computed authoritatively on the server.
5. **Session Invalidation**: Completed sessions are marked completed in the database to prevent replay attacks.
6. **Rate Limiting**: Protects all API endpoints against rapid automated spam.

### Remaining Cheating Risks & Future Mitigations
- **Client-Side Physics Tampering**: In an authoritative multiplayer architecture, full physics would be simulated server-side. For single-player web games, server-validated checkpoint timestamps and replay telemetry snapshots can be added in future iterations.
- **Memory Value Modification**: Local memory editors (e.g. Cheat Engine) could alter local variables temporarily before server submission; the server bounds checks enforce that submitted scores cannot exceed theoretical maximums.

---

## 🎮 Driving Controls

| Key | Action |
| --- | --- |
| **W / Up Arrow** | Accelerate (Gas) |
| **S / Down Arrow** | Brake / Reverse |
| **A / Left Arrow** | Steer Left |
| **D / Right Arrow** | Steer Right |
| **H** | Comical Sylheti Horn (*"পীপ পীপ!"*) |
| **Shift / Space** | Handbrake Drift |
| **L** | Toggle Headlights |
| **Touch Controls** | On-screen buttons on mobile & tablet devices |

---

## 📜 License
MIT License. Built with passion for Bangladeshi gaming!
