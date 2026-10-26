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

The frontend calls `POST /api/auth/register`, `POST /api/auth/login`, and authenticated `POST /api/ai/ask` for AI generation. Generated packs are then saved to `POST /api/study-packs`.

## Database-backed persistence

Study packs and notes are stored in PostgreSQL through the backend, associated with the authenticated user:
- Generated study packs are automatically saved to the user's library.
- Saved packs can be listed, reopened, and deleted from any device after signing in.
- Personal notes are created, listed, and deleted through authenticated API routes.
- The backend hashes passwords and stores users in PostgreSQL.

The frontend no longer uses AsyncStorage or a local-storage abstraction for courses or notes. The currently active pack and login token remain in memory; signing in again is required after a full app restart. Course and note data remains in the database when the app is closed or uninstalled.

## Backend features still pending

Progress history, multi-user leaderboard, scheduled notifications, and durable account preferences need additional models and API routes. The corresponding UI must not show fabricated synced statistics.
