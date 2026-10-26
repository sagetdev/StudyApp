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

## Current scope

Authentication is held in app memory and resets when the app process restarts. The backend's current auth service also stores users in process memory, so users are not durable across backend restarts. The backend does not yet expose persistent study-pack history, scores, profile statistics, notes, or leaderboard endpoints; those features are not presented as synced data in this frontend yet.
