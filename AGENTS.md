# Repository Guidelines

## Project Structure & Modules

- `src/pages/`: Route files and layouts (`.astro`).
- `src/components/`: UI components (Astro/React).
- `src/features/`: Feature modules (e.g., likes, feed, locales).
- `src/utils/`: Utilities and runtime helpers.
- `src/content/`: Content collections and entries.
- `public/`: Static assets served as-is.
- `constants/`: Site metadata and URLs.
- `tools/`: Dev scripts (e.g., OG image generator).

## Build, Test, and Development

- `npm run dev`: Build once and run Astro dev (Cloudflare runtime at `http://localhost:4321`).
- `npm run build`: Development build (Cloudflare adapter used).
- `npm test`: Run unit tests with Vitest (jsdom).
- Lint/format: `lint:script`, `lint:style`, `lint:markup`, `format`, `check:astro`.

## Coding Style & Naming

- Indentation: 2 spaces; LF; final newline (`.editorconfig`).
- Languages: TypeScript, Astro, CSS, React (19).
- Linting: ESLint (Astro + React + import rules), Stylelint, Markuplint.
- Formatting: Prettier + `prettier-plugin-astro`.
- Naming: `kebab-case` for files in pages/content; `PascalCase` for React components; tests as `*.test.ts`.

## Testing Guidelines

- Comments: Use `// Arrange`, `// Act`, and `// Assert` comments exclusively for separation. Don't add extra text to these markers.
- Coverage: keep meaningful assertions; prefer testing behavior over implementation details.
- Structure: Organize test functions into "Arrange", "Act", and "Assert" sections.
- Unit tests: Vitest with jsdom; colocate test files with source files; name `*.test.ts` (e.g., `src/utils/foo.test.ts` next to `foo.ts`).

## Commit & Pull Requests

- Commits: follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) to support semantic-release and changelog generation.
- PRs: include a clear summary, linked issues, and screenshots for UI changes. Ensure CI passes: build, tests, and linters.
- Keep PRs focused; note breaking changes in the description using `BREAKING CHANGE:` footer when applicable.

## Security & Configuration

- Env vars: use `.dev.vars` for Wrangler dev; `.env` for Node runtime.
- Cloudflare: `wrangler.jsonc` configures routes, assets, and Hyperdrive; deploy with `npm run deploy` when ready.
