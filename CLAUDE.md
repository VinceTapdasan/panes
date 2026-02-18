# Panes

HTML file viewer. Upload an HTML file, preview it in a sandboxed iframe, share it. Like Imgur but for HTML.

## Structure

```
frontend/   Next.js web app (the UI)
backend/    API server (not yet implemented)
```

## Frontend

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme inline`)
- **Components**: shadcn/ui (new-york style, lucide icons)
- **Fonts**: Geist Sans + Geist Mono via `next/font`
- **State**: React Context (`FileProvider`) for in-memory uploaded file content
- **No backend yet**: All data is client-side, no persistence, no auth

### Routes

| Route    | Purpose                              |
|----------|--------------------------------------|
| `/`      | Home - upload zone (main focus), stats in right panel |
| `/files` | File library (empty state, ready for backend)  |
| `/view`  | Standalone HTML iframe viewer                  |

### Key Files

- `frontend/src/app/globals.css` — Theme variables (dark premium, brand #f55442)
- `frontend/src/app/layout.tsx` — Root layout, fonts, providers
- `frontend/src/app/(app)/layout.tsx` — 3-column Twitter/X layout (sidebar + content + right panel)
- `frontend/src/components/sidebar.tsx` — Left sidebar navigation
- `frontend/src/components/right-panel.tsx` — Right panel (dashboard stats, recent uploads)
- `frontend/src/components/mobile-nav.tsx` — Mobile sheet navigation
- `frontend/src/context/file-context.tsx` — React Context for uploaded HTML content
- `frontend/src/lib/utils.ts` — shadcn `cn()` utility

### Design System

- **Theme**: Dark premium (#060B0B background)
- **Layout**: 3-column Twitter/X style (left nav | center content | right info panel)
- **Accent**: Brand red `#f55442` with white foreground
- **Typography**: Geist Sans everywhere, sentence case (no uppercase labels)
- **Corners**: `--radius: 0.5rem` (squarish, YouTube-like)

### Commands

```bash
cd frontend
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Backend

- **Framework**: NestJS 11
- **Language**: TypeScript (strict)
- **Database/Auth/Storage**: Firebase Admin SDK
- **Config**: `@nestjs/config` with `.env` files
- **Port**: 3001 (frontend runs on 3000)

### Key Files

- `backend/src/main.ts` — App bootstrap, port config
- `backend/src/app.module.ts` — Root module (ConfigModule, FirebaseModule)
- `backend/src/app.controller.ts` — Health/status endpoint
- `backend/src/firebase/firebase.service.ts` — Firebase Admin init (Firestore, Storage, Auth)
- `backend/src/firebase/firebase.module.ts` — Global Firebase module
- `backend/.env.example` — Required env vars template

### Commands

```bash
cd backend
npm run start:dev   # Dev server with watch (port 3001)
npm run build       # Production build
npm run start:prod  # Production start
```

### Planned Features

- File persistence and storage (Firebase Storage)
- User authentication (Firebase Auth)
- Share links / public URLs
- View analytics
- Settings management

## Conventions

- Path alias: `@/` maps to `frontend/src/`
- shadcn components live in `frontend/src/components/ui/`
- No `/** */` comment format — use `//` comments only
- No emojis in code
- Commit messages: simple and concise (e.g., "Add feature", "Fix issue")
