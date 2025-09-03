# Repository Guidelines

## Project Structure & Modules

- `src/pages/`: Route files and layouts (`.astro`).
- `src/components/`: UI components (Astro/React).
- `src/features/`: Feature modules (e.g., likes, feed, locales).
- `src/utils/`: Utilities and runtime helpers.
- `src/content/`: Content collections and entries.
- `public/`: Static assets served as-is.
- `constants/`: Site metadata and URLs.
- `e2e/`: Playwright end-to-end tests.
- `tools/`: Dev scripts (e.g., OG image generator).

## Build, Test, and Development

- `npm run dev`: Build once and run Wrangler dev (Cloudflare runtime at `http://localhost:8787`).
- `npm run dev:node`: Astro dev server (Node runtime at `http://localhost:4321`).
- `npm run build`: Production build (Cloudflare adapter by default).
- `npm run build:node`: Production build with Node adapter.
- `npm run preview` / `preview:node`: Serve built output locally.
- `npm test`: Run unit tests with Vitest (jsdom).
- `npm run test:e2e`: Run Playwright tests
- Lint/format: `lint:script`, `lint:style`, `lint:markup`, `format`, `check:ts`.

## Coding Style & Naming

- Indentation: 2 spaces; LF; final newline (`.editorconfig`).
- Languages: TypeScript, Astro, CSS, React (19).
- Linting: ESLint (Astro + React + import rules), Stylelint, Markuplint.
- Formatting: Prettier + `prettier-plugin-astro`.
- Naming: `kebab-case` for files in pages/content; `PascalCase` for React components; tests as `*.test.ts`.

## Testing Guidelines

- Unit tests: Vitest with jsdom; colocate test files with source files; name `*.test.ts` (e.g., `src/utils/foo.test.ts` next to `foo.ts`).
- E2E: Playwright tests live in `e2e/`; config uses Firefox and starts `test:e2e` automatically.
- Coverage: keep meaningful assertions; prefer testing behavior over implementation details.

## Commit & Pull Requests

- Commits: follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) to support semantic-release and changelog generation.
- PRs: include a clear summary, linked issues, and screenshots for UI changes. Ensure CI passes: build, tests, and linters.
- Keep PRs focused; note breaking changes in the description using `BREAKING CHANGE:` footer when applicable.

## Security & Configuration

- Env vars: use `.dev.vars` for Wrangler dev; `.env`/`.env.example` for Node runtime. Prefix public values with `PUBLIC_`.
- Database: `docker-compose up -d` starts PostgreSQL (port 5432). Update connection strings as needed for local/CI.
- Cloudflare: `wrangler.jsonc` configures routes, assets, and Hyperdrive; deploy with `npx wrangler deploy` when ready.
