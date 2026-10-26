# StudyApp — Frontend

Expo Router / React Native frontend for StudyApp.

## Start locally

```powershell
cd Frontend
npm install
Copy-Item .env.example .env
npx expo start
```

Run the backend separately from `Backend` on port `4000`.

## Backend URL

The app uses `EXPO_PUBLIC_API_URL` and expects the base URL to end in `/api`.

- Android emulator: `http://10.0.2.2:4000/api`
- iOS simulator: `http://localhost:4000/api`
- Web: `http://localhost:4000/api` (the backend must also enable CORS for the web origin)
- Physical Android phone: use your computer's LAN IP, for example `http://192.168.1.25:4000/api`
- Deployed backend: use its HTTPS base URL ending in `/api`

The frontend calls `POST /api/auth/register`, `POST /api/auth/login`, and authenticated `POST /api/ai/ask` with a JSON body of `{ "question": "..." }` and an `Authorization: Bearer <token>` header for AI generation.

## Local persistence

AsyncStorage is used for device-local persistence:

- Generated study packs are automatically added to **Mes cours**.
- Saved packs can be reopened or deleted from the library.
- Personal notes survive screen changes and app restarts, and can be deleted.
- The active pack, login session, and settings preferences are persisted locally.

Local data stays on this device; it is not synced across devices or backed up to a user account. Removing app data or uninstalling the app may erase it. The backend currently stores users in process memory, so registered accounts may not survive a backend restart.

## Current backend limitations

The backend currently exposes authentication and AI pack generation only. Progress history, multi-user leaderboard, scheduled notifications, and cloud sync still need backend/API support. Their screens avoid displaying invented synced statistics. Haptics and reminders are saved as preferences but are not yet activated as system features.
