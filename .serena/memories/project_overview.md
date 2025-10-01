# Project Overview - blog.kubosho.com

## Purpose

This is the source code for blog.kubosho.com, a personal blog website built with Astro and deployed on Cloudflare Pages.

> **Note**: For specific version information of dependencies, refer to `package.json`.

## Tech Stack

### Core Framework

- **Framework**: Astro - Static site generator
- **UI Library**: React - For interactive components
- **Language**: TypeScript
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
- **Hyperdrive**: Configured for database acceleration

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

### Deployment Configuration

- **Primary**: Cloudflare Pages (default)
  - Build: `npm run build` or `npm run build:prd`
  - Deploy: `npm run deploy`
  - Compatibility Date: 2025-08-15
  - Node.js Compatibility: v2 enabled
  - Observability: Enabled
  - Custom Domain: blog.kubosho.com

- **Development**: Multiple modes supported
  - Development mode: `npm run dev`
  - Production mode testing: `npm run dev:prd`

### Build Configuration

- **Output**: Static site generation (SSG)
  - Note: Astro v5+ merged hybrid mode into static mode. Pages can opt-out of prerendering using `export const prerender = false`.
- **Format**: Preserve original structure
- **Image Service**: Passthrough (Cloudflare handles optimization)
- **Adapters**: Cloudflare adapter configured

### Key Features

- Static site generation with optional server-side rendering for specific routes
- Interactive like system for blog entries
- RSS/Atom feed generation
- Sitemap generation (automated via @astrojs/sitemap)
- Open Graph image generation (`npm run gen:ogimage`)
- Japanese localization with rosetta
- Analytics integration
- Privacy-focused with opt-out options
- Rate limiting for API endpoints
- Database acceleration via Hyperdrive

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

## Performance Optimizations

- **Build**: Rollup Linux optimization enabled via optional dependencies
- **Database**: Hyperdrive connection pooling
- **Assets**: Cloudflare automatic optimization
- **Images**: Passthrough service for platform optimization
- **Compatibility**: Node.js v2 compatibility for better performance
