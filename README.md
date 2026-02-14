# HamroWard

HamroWard is a ward-first civic platform where citizens share 15-second stories, learn about local documents, report issues with evidence, and stay in sync with ward officers. The project is built with React + Vite, Tailwind CSS, and React Router, and is designed to deploy on Vercel with Firebase providing auth, Firestore, and Storage.

## Current App Structure

- **Public experience:** landing page, ward selector, document knowledge base, single document view, login, and signup.
- **Citizen console:** feed, upload, report issue, my issues, my videos, and profile.
- **Ward admin console:** login, dashboard, issue triage, video moderation, document editor, and sponsor management.
- **Design system:** shared `RootLayout`, `AdminLayout`, and `SectionHeader` components keep the UI consistent, responsive, and professional across desktop, tablet, and mobile.

## Tech Stack

- Frontend: React 19, Vite 7, Tailwind CSS 4, React Router 6, React Icons.
- Data layer (planned): Firebase Auth, Firestore, Cloudinary. Local seed data mirrors the target collections (`users`, `videos`, `issues`, `documents`, `sponsors`) to accelerate UI work.
- Hosting: GitHub for source control, Vercel for frontend, Firebase for backend services.

## Next Implementation Steps

1. **Firebase foundation**
   - Create a Firebase project, enable Auth (email/password) and Firestore.
   - Define Firestore security rules for citizen vs admin access, especially for issue statuses and document editing.
   - Configure Storage buckets and security for 15-second video uploads and sponsor banners.

2. **Data integration**
   - Replace `src/data/seedData.js` with live Firestore queries using React Query or custom hooks.
   - Implement optimistic updates for issue reporting, video uploads, and admin status changes.
   - Wire Firebase Auth for citizen and admin roles, including protected routes and context providers.

3. **Media workflows**
   - Use Cloudinary resumable uploads for videos and issue evidence.
   - Generate thumbnail/preview metadata (e.g., via Cloud Functions or client-side FFmpeg/WASM if necessary).
   - Enforce 15-second duration and <50MB constraints before upload.

4. **Notifications & status tracking**
   - Add email or push notifications when admins update issue statuses.
   - Surface chronological timelines on issue detail pages (citizen + admin views).

5. **Deployment & observability**
   - Set up environment variables on Vercel for Firebase config.
   - Configure preview + production deployments tied to GitHub branches.
   - Add basic analytics/logging (e.g., Firebase Analytics or LogRocket) for user behavior insights.

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

Create a `.env.local` (or `.env`) file with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=1:xxx:web:xxx
```

Set `VITE_USE_FIREBASE_EMULATORS=true` during local development to automatically connect to emulators at the default ports (Auth 9099, Firestore 8080, Storage 9199).

## Using the App (Local)

1. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the printed URL (usually `http://localhost:5173`).

2. **Register a citizen**
   - Go to `/signup`, fill in name, ward, email, and password.
   - On submit, Firebase Auth creates the user and you are redirected to the feed.
   - Citizen-only routes (`/feed`, `/upload`, `/report-issue`, `/my-*`, `/profile`) require login.

3. **Login**
   - Visit `/login`, enter the same credentials, and you’ll land on `/feed`.
   - “Stay signed in” persists the session via `browserLocalPersistence`.

4. **Admin access**
   - Go to `/admin/login` and sign in with a ward-issued email (e.g., `ward2@ward.hamro` in Firebase).
   - After success you can manage issues, videos, documents, and sponsors from `/admin`.

If Firebase env vars are missing, the UI automatically falls back to the seeded demo data so the experience still works while you finish backend setup.

## License

Proprietary – HamroWard civic platform. Contact the maintainers for usage permissions.
