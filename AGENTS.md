<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository notes

`CLAUDE.md` is just `@AGENTS.md` — this file is the single source of instruction for agents.

## Commands

- `npm run dev` — Next.js dev server (re-writes the block above; commit it).
- `npm run lint` (eslint) and `npm run typecheck` (`tsc --noEmit`) — there is **no test suite**; these two are the entire verification step. Run lint → typecheck before finishing.
- `npm run format` rewrites **every** `*.ts`/`*.tsx` in the repo (Prettier + `prettier-plugin-tailwindcss` class sorting). For one file use `npx prettier --write <path>` — don't mass-reformat unrelated files just to verify.

## Stack / structure

- Next.js 16.4.4, App Router, React 19, strict TypeScript. Code lives at the repo root (`app/`, `components/`, `lib/`, `hooks/`) — no `src/` directory.
- Path alias `@/*` → repo root (see `tsconfig.json`); imports look like `@/components/ui/button`.
- Tailwind CSS **v4**: no `tailwind.config.*` file. Theme/CSS-first config is in `app/globals.css` (`@import "tailwindcss"` + `@theme inline`). Config lives in PostCSS (`postcss.config.mjs`).
- shadcn/ui style `base-nova`, RSC on, config in `components.json`. Add components with `npx shadcn@latest add <name>` (generates into `components/ui/`) instead of hand-writing them.

## Auth / database

- better-auth with the MongoDB adapter. Server config: `lib/auth.ts`; catch-all route: `app/api/auth/[...all]/route.ts`; React client: `lib/auth-client.ts`.
- **Requires a local MongoDB** — `lib/auth.ts` hardcodes `mongodb://localhost:27017/database` (not an env var). Auth calls fail without it running.
- `.env` (gitignored) must provide `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
- Gotcha: `lib/auth.ts` also re-exports `signIn`/`signUp`/`useSession` created via `better-auth/svelte` — these do not work in React components. Import the client API from `@/lib/auth-client` (`better-auth/react`) instead.
