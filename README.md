# Panes

Upload an HTML file, preview it in a sandboxed iframe, share it. Like Imgur but for HTML.

## Stack

**Frontend** — Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui

**Backend** — NestJS 11, Firebase Admin SDK (Firestore, Storage, Auth)

## Getting started

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment
cp backend/.env.example backend/.env
# Fill in your Firebase credentials

# Run both frontend and backend
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:3001`.

## Project structure

```
frontend/   Next.js web app
backend/    NestJS API server
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:fe` | Run frontend only |
| `npm run dev:be` | Run backend only |
| `npm run build` | Build both |
| `npm run lint` | Lint frontend |

## License

MIT
