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

## Packages used (and *why*)

Every dependency in `package.json` is here for a specific reason. If you're new, scan this once — you'll recognize names when you read the code.

### Runtime dependencies

| Package | Purpose | Where you see it |
|---|---|---|
| **react**, **react-dom** | The UI library and its browser renderer. Components, state, effects. | Everywhere |
| **react-router-dom** | Client-side routing. Maps URLs to React components without a page reload. | `App.tsx`, `ProtectedRoute.tsx`, `Sidebar.tsx`, `Header.tsx`, `Login.tsx` |
| **axios** | HTTP client. Cleaner API than `fetch`, plus interceptors (we use them for auth). | `lib/api-client.ts`, every service |
| **@tanstack/react-query** | Server-state caching, deduping, refetching. Lets you call APIs from components without writing loading/error/cache plumbing yourself. | `lib/query-client.ts`, `App.tsx` (provider). Use in pages via `useQuery` / `useMutation`. |
| **react-hook-form** | Lightweight, performance-focused form library. Manages field values, validation, submission. | `pages/Login.tsx` |
| **@hookform/resolvers** | Adapter that lets `react-hook-form` use external validators (we use Zod). | `pages/Login.tsx` (`zodResolver`) |
| **zod** | Schema validation. Define a schema, get parsed + typed data. We use it to validate the login form. | `pages/Login.tsx` |
| **sonner** | Toast notifications (success/error popups). | `App.tsx` (`<Toaster />`), `pages/Login.tsx` (`toast.success`, `toast.error`) |
| **framer-motion** | Animation library. Used for the active-item indicator in the sidebar. | `components/layout/Sidebar.tsx` (`<motion.div layoutId="active-nav" />`) |
| **lucide-react** | Icon set as React components. Tree-shakeable — only icons you import end up in the bundle. | Sidebar, Header, Login (BrainCircuit, Bell, ChevronLeft, etc.) |
| **clsx** | Tiny utility to conditionally join class names. | `lib/utils.ts` |
| **tailwind-merge** | Resolves conflicting Tailwind classes (e.g. `p-2 p-4` → keeps `p-4`). | `lib/utils.ts` (combined with `clsx` to make `cn()`) |
| **class-variance-authority** (cva) | Define class-name "variants" for components (size: sm/md/lg, variant: default/outline/ghost). | `components/ui/button.tsx` |
| **tw-animate-css** | Adds `animate-in` / `animate-out` / `fade-in` / `zoom-in` etc. utilities used by shadcn for tooltips, dropdowns, dialogs. | `index.css` (imported), used by `tooltip.tsx`, `dropdown-menu.tsx` |
| **@radix-ui/react-avatar** | Headless accessible avatar primitive (image with fallback). | `components/ui/avatar.tsx` |
| **@radix-ui/react-dropdown-menu** | Accessible dropdown menu primitive (used for the user menu in the header). | `components/ui/dropdown-menu.tsx`, `components/layout/Header.tsx` |
| **@radix-ui/react-label** | Accessible `<label>` primitive that wires up `htmlFor` correctly. | `components/ui/label.tsx` |
| **@radix-ui/react-tooltip** | Accessible tooltip primitive (used by the collapsed sidebar). | `components/ui/tooltip.tsx`, `Sidebar.tsx` |
| **@radix-ui/react-slot** | Lets shadcn components forward props to a child element via `asChild` (e.g. `<Button asChild><Link …/></Button>`). | `components/ui/button.tsx` |

> **About shadcn/ui:** shadcn isn't an npm package — the components live directly in `src/components/ui/` so you can edit them. They're built on top of the Radix primitives and `cva` listed above.

### Dev dependencies

| Package | Purpose |
|---|---|
| **vite** | The dev server (instant hot reload) and production bundler. |
| **@vitejs/plugin-react** | Tells Vite how to handle JSX/TSX and Fast Refresh. |
| **tailwindcss** | The Tailwind engine (v4). Generates utility classes from your markup. |
| **@tailwindcss/vite** | Tailwind's official Vite plugin — no separate PostCSS config needed. |
| **typescript** | Static type checker. `tsc -b` runs as part of `npm run build`. |
| **@types/react**, **@types/react-dom**, **@types/node** | Type definitions for libraries that ship plain JS. |

---

## File-by-file reference

This is a tour of every file in `src/`. Skim it once and refer back when you're not sure where something belongs.

### Project root

| File | What it does |
|---|---|
| `index.html` | Vite's HTML entry. Contains `<div id="root">` and the script tag that loads `src/main.tsx`. |
| `vite.config.ts` | Vite config: registers the React + Tailwind plugins, sets up the `@` alias, picks the dev port. |
| `tsconfig.json` | Top-level TS config. Just references `tsconfig.app.json` (app code) and `tsconfig.node.json` (vite config). |
| `tsconfig.app.json` | TS rules for `src/` — strict mode, JSX, the `@/*` path alias. |
| `tsconfig.node.json` | TS rules for `vite.config.ts` (different module/target). |
| `components.json` | Tells the shadcn CLI where to drop new components, what icon library to use, and how the `@` alias maps. |
| `package.json` | Dependencies + npm scripts. |
| `.env.example` | Template for the env file you'll create as `.env`. |
| `public/` | Static files served as-is at the site root (e.g. favicons). |

### `src/` — top-level

| File | What it does |
|---|---|
| `main.tsx` | The React entry point. Calls `createRoot` and mounts `<App />` into `#root`. |
| `App.tsx` | The composition root. Wraps the app in `QueryClientProvider`, `BrowserRouter`, `AuthProvider`, and `Toaster`. Declares the routes (`/login`, `/dashboard`, redirects). |
| `index.css` | The single global stylesheet. Imports Tailwind, imports `tw-animate-css`, defines the design tokens (colors, radii) for **light** *and* **dark** themes via CSS variables. |
| `vite-env.d.ts` | Ambient types for `import.meta.env` so TypeScript knows about `VITE_API_BASE_URL` and friends. |

### `src/pages/`
One file per route. Pages are the only place that should compose layout + data + interactions for a screen.

| File | Role |
|---|---|
| `Login.tsx` | Public login form. Validates with Zod, calls `useAuth().login`, toasts on success/error, navigates to `/dashboard`. |
| `Landing.tsx` | The dashboard (post-login landing page). Reads `user` from auth context, renders example stat cards. |

### `src/components/`

#### `components/ui/` — shadcn primitives
Self-contained, styled, accessible building blocks. Edit these directly when you need a tweak — they're yours.

| File | Provides |
|---|---|
| `button.tsx` | `<Button variant size>` with cva variants. Supports `asChild`. |
| `input.tsx` | Styled `<input>`. |
| `label.tsx` | Accessible label (Radix). |
| `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| `tooltip.tsx` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` (Radix). |
| `avatar.tsx` | `Avatar`, `AvatarImage`, `AvatarFallback` (Radix). |
| `dropdown-menu.tsx` | Accessible dropdown menu and its sub-parts (Radix). Used for the user menu. |

#### `components/layout/` — the app shell

| File | Role |
|---|---|
| `Sidebar.tsx` | Collapsible left sidebar. Reads nav items from `lib/nav-items.ts`, highlights the active route via `useLocation`, animates the indicator with `framer-motion`, shows tooltips when collapsed. |
| `Header.tsx` | Top bar with notification bell and user dropdown (avatar → settings/support/logout). Reads `user` from `useAuth`, calls `logout()` and navigates to `/login`. |
| `AppLayout.tsx` | The protected shell. Renders `Sidebar` + `Header` and an `<Outlet />` where the active page lands. |

#### `components/ProtectedRoute.tsx`
Guards routes. Shows a loading state while auth is initializing, redirects to `/login` if there's no user, otherwise renders `children` or `<Outlet />`. Used as a wrapper route in `App.tsx`.

### `src/context/AuthContext.tsx`
The auth state machine for the app:
- holds `user`, `isAuthenticated`, `isLoading` in React state
- exposes `login(payload)` and `logout()`
- on mount, rehydrates user/token from `localStorage`
- on `login`, calls `authService.login`, persists the token + refresh token + user, and updates state
- on `logout`, calls `authService.logout`, clears storage, resets state

Consumed via `useAuthContext()` (or its alias `useAuth()`).

### `src/hooks/useAuth.ts`
Re-exports `useAuthContext` as `useAuth`. Use this in components — it's the public API.

### `src/services/authService.ts`
The only place that knows the URL and shape of `/auth/*` endpoints. Implements the `IAuthService` interface. Methods: `login`, `refresh`, `me`, `logout`. Each one calls `apiClient` and unwraps the `{ success, message, data }` envelope.

> **Pattern:** every backend resource gets its own service file (`leadsService.ts`, `campaignService.ts`, etc.). Components never call `axios` directly.

### `src/lib/`
Utility modules that depend on third-party libraries.

| File | Role |
|---|---|
| `api-client.ts` | The axios instance. Attaches `Authorization: Bearer <token>` on every request. On 401, automatically calls `/auth/refresh`, retries the request, and coalesces concurrent refreshes so only one refresh request fires at a time. Forces a logout if refreshing fails. **The single most important file in the project.** |
| `query-client.ts` | The TanStack Query client. Sets default `staleTime` and `retry`. Imported once in `App.tsx`. |
| `nav-items.ts` | Sidebar navigation config — title, href, icon, optional children. Edit this to add/remove nav links. |
| `utils.ts` | Just `cn(...inputs)` — the className helper combining `clsx` + `tailwind-merge`. Used by every UI component. |

### `src/core/`
Framework-agnostic. **No React imports here.** Pure TypeScript. If you ever extracted a backend SDK from this app, you'd lift this folder out.

| Folder | What lives here |
|---|---|
| `core/types/` | Plain TS types/interfaces for API payloads (e.g. `authTypes.ts` defines `User`, `LoginRequest`, `LoginResponse`, `ApiEnvelope<T>`, `RefreshResponseData`, etc.). |
| `core/interfaces/` | Service and context contracts (e.g. `IAuthService`, `IAuthContext`, `IProtectedRoute`). Defining these forces every implementation to share the same shape, which is gold during refactors. |
| `core/constants/` | App-wide constants — `AUTH_TOKEN_KEY`, `AUTH_REFRESH_TOKEN_KEY`, `AUTH_USER_KEY`. Never hardcode storage keys; reuse these. |
| `core/enums/` | Shared enums (currently empty — add as needed: `Role`, `Status`, etc.). |
| `core/utils/` | Pure helpers with no library dependencies (currently empty). |

### Storage keys
The app writes three keys to `localStorage`:
- `auth_token` — current access token (short-lived)
- `auth_refresh_token` — refresh token (long-lived)
- `auth_user` — JSON of the currently logged-in user

All three are defined in `core/constants/constants.ts` — never hardcode them.

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
