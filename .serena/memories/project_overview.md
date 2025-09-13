# Project Overview - blog.kubosho.com

## Purpose

This is the source code for blog.kubosho.com, a personal blog website built with Astro and deployed on Cloudflare Pages.

## Tech Stack

### Core Framework

- **Framework**: Astro (v5.13.6) - Static site generator
- **UI Library**: React (v19.1.1) - For interactive components
- **Language**: TypeScript (v5.9.2)
- **Runtime**: Cloudflare Workers / Node.js (configurable)

### Content & Styling

- **Content Format**: Markdown with frontmatter
- **Markdown Processing**: remark, unified, strip-markdown
- **Syntax Highlighting**: Prism.js
- **Styling**: CSS Modules
- **i18n**: rosetta (Japanese localization)

### Backend & Data

- **Platform**: Cloudflare Pages Functions
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Validation**: Valibot
- **Error Tracking**: Sentry (@sentry/astro, @sentry/cloudflare)
- **Logging**: Pino

### Testing & Quality

- **Unit Testing**: Vitest
- **Component Development**: Storybook
- **Linting**: ESLint with @kubosho/configs
- **Formatting**: Prettier with @kubosho/configs
- **Markup Linting**: markuplint
- **Style Linting**: Stylelint

## Architecture

### Project Structure

- **Single Package**: Unified project structure (no workspace separation)
- **Source Organization**: Feature-based modules in `src/features/`
- **Content Management**: Markdown files in `src/content/entries/`
- **Pages**: Astro pages in `src/pages/`

### Deployment Options

- **Primary**: Cloudflare Pages (default)
  - Build: `npm run build` or `npm run build:prd`
  - Deploy: `npm run deploy`
- **Development**: Multiple modes supported
  - Development mode: `npm run dev`
  - Production mode testing: `npm run dev:prd`

### Key Features

- Server-side rendering with Astro
- Interactive like system for blog entries
- RSS/Atom feed generation
- Sitemap generation
- Open Graph image generation (`npm run gen:ogimage`)
- Japanese localization with rosetta
- Analytics integration
- Privacy-focused with opt-out options
- Rate limiting for API endpoints

## Build System

### Build Modes

```bash
# Development build (faster, for testing)
npm run build

# Production build (optimized)
npm run build:prd

# Generate Open Graph images
npm run gen:ogimage
```

### Development Workflow

1. **Local Development**:
   - `npm run dev` - Development mode with hot reload
   - `npm run dev:prd` - Production mode for testing

2. **Quality Assurance**:
   - Type checking: `npm run check:ts` and `npm run check:astro`
   - Code formatting: `npm run format`
   - Linting: `npm run lint:script`, `npm run lint:style`, `npm run lint:markup`
   - Testing: `npm test`

3. **Deployment**:
   - Build: `npm run build:prd`
   - Deploy: `npm run deploy`

## Content Management

### Blog Posts

- Location: `src/content/entries/*.md`
- Format: Markdown with frontmatter metadata
- Configuration: `src/content/config.ts`

### Asset Management

- Static assets: `public/`
- Generated assets: `__entries__/` (build-time)
- Open Graph images: `public/assets/images/og/`

## Development Tools

- **Storybook**: Component development (`npm run storybook`)
- **Docker**: Development environment (`docker-compose.yml`)
- **Environment**: `.env.example`, `.envrc.example`
- **CI/CD**: GitHub Actions (`.github/`)

## Key Dependencies

### Runtime

- astro, react, react-dom
- drizzle-orm, postgres
- dayjs, clsx, escape-html
- pino (logging), valibot (validation)

### Development

- @kubosho/configs (shared configs)
- vitest (testing), storybook (component dev)
- TypeScript, prettier, eslint, stylelint, markuplint
