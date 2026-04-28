# Vite Basic Project Structure

A starter React + TypeScript app built with **Vite**. It includes a login page, a protected dashboard, a sidebar + header layout, and a clean folder structure ready for a real product. Auth is wired to a backend with access-token + refresh-token rotation.

If you're new to the project, this README walks you through everything you need to run it locally and understand where things live.

---

## Tech stack

| Concern | Library |
|---|---|
| Build tool / dev server | Vite 6 |
| UI framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Component primitives | shadcn/ui (Radix under the hood) |
| Icons | lucide-react |
| Routing | react-router-dom v6 |
| Server state / caching | @tanstack/react-query |
| HTTP client | axios |
| Forms + validation | react-hook-form + zod |
| Toasts | sonner |
| Animations | framer-motion |

---

## Prerequisites

- **Node.js 20+** (Node 18 works but 20 is recommended)
- **npm** (ships with Node) — yarn/pnpm work too if you prefer

Check your versions:
```bash
node -v
npm -v
```

---

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
The project ships with `.env.example`. Copy it:

```bash
cp .env.example .env
```

Open `.env` and set the URL of your backend API:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> **Important:** environment variables in Vite **must** start with `VITE_` to be exposed to the browser. They're read via `import.meta.env.VITE_…`.

### 3. Start the dev server
```bash
npm run dev
```

Open the URL Vite prints in the terminal (default `http://localhost:5175` per `vite.config.ts`). You'll see the **Login** page. After a successful login you're redirected to `/dashboard`.

### 4. Build for production
```bash
npm run build      # outputs to ./dist
npm run preview    # serves ./dist locally to verify the build
```

---

## Project structure

```
.
├── index.html              # Vite's HTML entry point
├── vite.config.ts          # Vite config: React plugin, Tailwind plugin, "@" alias
├── tsconfig.json           # TS project references
├── components.json         # shadcn/ui config (so `npx shadcn add …` works)
├── public/                 # static assets served as-is
└── src/
    ├── main.tsx            # ReactDOM root — mounts <App />
    ├── App.tsx             # router + providers (QueryClient, Auth, Toaster)
    ├── index.css           # Tailwind import + theme tokens (light + dark)
    ├── vite-env.d.ts       # ambient types for import.meta.env
    │
    ├── pages/              # one file per route
    │   ├── Login.tsx
    │   └── Landing.tsx     # the dashboard
    │
    ├── components/
    │   ├── ui/             # shadcn primitives: button, input, card, …
    │   ├── layout/         # Sidebar, Header, AppLayout (protected shell)
    │   └── ProtectedRoute.tsx
    │
    ├── context/
    │   └── AuthContext.tsx # in-memory auth state + login/logout
    │
    ├── hooks/
    │   └── useAuth.ts      # convenience hook → useAuthContext()
    │
    ├── services/           # one file per backend resource
    │   └── authService.ts  # login / refresh / me / logout
    │
    ├── lib/                # shared utilities
    │   ├── api-client.ts   # axios instance + 401 refresh interceptor
    │   ├── query-client.ts # TanStack Query client
    │   ├── nav-items.ts    # sidebar nav config
    │   └── utils.ts        # cn() className merger
    │
    └── core/               # framework-agnostic types & contracts
        ├── types/          # TS types for API payloads (e.g. authTypes.ts)
        ├── interfaces/     # service / context contracts (IAuthService, …)
        ├── constants/      # constants.ts (storage keys, etc.)
        ├── enums/          # shared enums
        └── utils/          # pure helpers
```

### Why this layout?

- **`pages/`** — each route is a top-level page. Routes are wired in `App.tsx`.
- **`components/ui/`** — low-level primitives from shadcn. Add more with `npx shadcn add <name>`.
- **`components/layout/`** — anything that wraps pages: sidebar, header, the `AppLayout` shell that stitches them together for protected routes.
- **`services/`** — every API call lives here, never inside components. This makes mocking, retrying, and refactoring far easier.
- **`core/`** — *no React imports.* Pure types, interfaces, and helpers. If you ever extract a backend SDK, this is what you'd lift out.
- **`lib/`** — utilities that *do* depend on libraries (axios, TanStack Query, clsx). The split keeps `core/` portable.

### The `@` alias
Anywhere you see `@/foo/bar` in an import, it resolves to `src/foo/bar`. Configured in `vite.config.ts` and `tsconfig.app.json`.

---

## How auth works (read this once, save hours later)

1. User submits the login form (`pages/Login.tsx`) → calls `useAuth().login(email, password)`.
2. `AuthContext.login` calls `authService.login` → `POST /auth/login`.
3. On success it stores three things in `localStorage`:
   - `auth_token` — short-lived access token
   - `auth_refresh_token` — long-lived refresh token
   - `auth_user` — the user JSON
4. The axios instance in `lib/api-client.ts` automatically attaches `Authorization: Bearer <auth_token>` to every request.
5. **If a request returns 401**, the response interceptor:
   - Calls `POST /auth/refresh` with the refresh token.
   - Saves the rotated tokens.
   - Replays the original request with the new access token.
   - If multiple requests 401 at once, only **one** refresh fires; the others wait and resume.
   - If the refresh itself fails, storage is wiped and the user is sent back to `/login`.
6. `<ProtectedRoute />` (`components/ProtectedRoute.tsx`) blocks access to `/dashboard` until the auth context has a user.

You don't have to think about any of this when adding a new screen — just call `apiClient.get(...)` from a service and it works.

---

## Adding things

### A new page
1. Create `src/pages/MyPage.tsx`.
2. Add a route inside the protected block of `App.tsx`:
   ```tsx
   <Route path="/my-page" element={<MyPage />} />
   ```
3. (Optional) Add a sidebar entry in `src/lib/nav-items.ts`.

### A new shadcn component
```bash
npx shadcn@latest add dialog
```
It'll be added to `src/components/ui/dialog.tsx`. Already-configured paths in `components.json` make this seamless.

### A new API endpoint
1. Add the response/request types to `src/core/types/<feature>Types.ts`.
2. Define a contract in `src/core/interfaces/I<Feature>Service.ts`.
3. Implement it in `src/services/<feature>Service.ts` using `apiClient`.
4. Consume it in pages/components, ideally via TanStack Query (`useQuery` / `useMutation`).

### A new env var
1. Add it to both `.env` and `.env.example` (prefixed with `VITE_`).
2. Add the key to the `ImportMetaEnv` interface in `src/vite-env.d.ts` for type safety.
3. Read it via `import.meta.env.VITE_MY_VAR`.

---

## NPM scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts Vite dev server with hot reload |
| `npm run build` | Type-checks and produces a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint over the codebase |

---

## Troubleshooting

**The login toast appears but I'm not redirected.**
Open DevTools → Network → check the `/auth/login` response shape. The app expects `{ success, message, data: { access_token, refresh_token, expires_at, user } }`. If your backend returns something different, edit `src/services/authService.ts` to map the shape.

**CORS errors in the browser console.**
Your backend must allow the dev origin (e.g. `http://localhost:5175`). Either configure CORS server-side or add a Vite proxy in `vite.config.ts`:
```ts
server: {
  proxy: { "/api": "http://localhost:8000" }
}
```
Then set `VITE_API_BASE_URL=/api` in `.env`.

**`@/...` imports fail to resolve.**
Restart the TS server in your editor. Both `vite.config.ts` and `tsconfig.app.json` define the alias — they must stay in sync.

**`npm run dev` says port already in use.**
Either stop the other process or change `server.port` in `vite.config.ts`.

---

## Where to go next

- Add a real backend URL to `.env` and try logging in.
- Read `src/lib/api-client.ts` end-to-end — it's the most important file in the project.
- Add a second protected page following the "Adding things" guide above.
- When in doubt, follow the patterns already in the repo — consistency beats cleverness.
