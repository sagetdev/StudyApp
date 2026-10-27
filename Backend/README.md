# StudyApp Backend

Express + TypeScript API using PostgreSQL and Prisma 7.

## Environment

Create a local `.env` file from `.env.example` and set:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: long random secret, kept private
- `GOOGLE_API_KEY`: key used for AI generation

Never commit real credentials.

## Database setup

Run these commands from `Backend`:

```powershell
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

For local development when creating a new migration, use `npm run db:migrate`.

## Authenticated data APIs

All routes below require `Authorization: Bearer <token>`.

- `GET /api/study-packs`: list the current user's courses
- `POST /api/study-packs`: save a generated pack (JSON content and optional source text)
- `DELETE /api/study-packs/:id`: delete a course owned by the current user
- `GET /api/notes`: list the current user's notes
- `POST /api/notes`: create a note
- `DELETE /api/notes/:id`: delete a note

Every read/delete is scoped by the authenticated user ID. Study packs and notes cascade-delete if their owner account is removed.

## Data model

- `User`: persistent account and password hash
- `StudyPack`: owner, title, optional source text, full generated content as PostgreSQL JSONB
- `Note`: owner, title, body

User accounts, courses, and notes are stored in PostgreSQL, not process memory or frontend local storage.
