## Safe Mode

Real-time disruption tracker built with Next.js App Router, Tailwind CSS, Mapbox GL JS, Firebase, and a lightweight Three.js overlay for 3D event effects.

## Project structure

```txt
src/
  app/
  components/
  lib/
  styles/
```

## Features

- Live map centered on the user's location when available
- Real-time Firestore subscriptions for protest, police, and roadblock events
- Event creation form with Firestore persistence
- Feed page sorted by most recent events
- Three.js custom layer for performant 3D event columns on top of Mapbox

## Environment variables

Add these to `.env.local`:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Enable Anonymous Auth and Firestore in Firebase before running the app.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
