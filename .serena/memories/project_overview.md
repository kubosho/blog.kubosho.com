# Project Overview - blog.kubosho.com

## Purpose

This is the source code for blog.kubosho.com, a personal blog website built with Astro and deployed on Cloudflare Pages.

## Tech Stack

### Core Framework

- **Framework**: Astro (v5.13.2) - Static site generator with hybrid rendering
- **UI Library**: React (v19.1.1) - For interactive components
- **Language**: TypeScript (v5.9.2)
- **Runtime**: Cloudflare Pages / Node.js (configurable)

### Content & Styling

- **Content Format**: Markdown with frontmatter
- **Markdown Processing**: remark, unified
- **Syntax Highlighting**: Prism.js
- **Styling**: CSS Modules
- **i18n**: rosetta (Japanese localization)

### Backend & Data

- **Platform**: Cloudflare Pages Functions
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Validation**: Valibot
- **Error Tracking**: Sentry
- **Logging**: Pino

### Testing & Quality

- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **Component Development**: Storybook
- **Linting**: ESLint with @kubosho/configs
- **Formatting**: Prettier
- **Markup Linting**: markuplint
- **Style Linting**: Stylelint

## Architecture

### Project Structure

- **Single Package**: Unified project structure (no workspace separation)
- **Source Organization**: Feature-based modules in `src/features/`
- **Content Management**: Markdown files in `src/content/entries/`
- **Pages**: Astro pages in `src/pages/`

### Deployment

- **Primary**: Cloudflare Pages (default build)
- **Alternative**: Node.js standalone (USE_NODE_ADAPTER=true)
- **Development**: Wrangler for Cloudflare environment or Astro dev server

### Key Features

- Server-side rendering with Astro
- Interactive like system for blog entries
- RSS/Atom feed generation
- Sitemap generation
- Open Graph image generation
- Japanese localization
- Analytics with Google Tag Manager
- Privacy-focused with opt-out options
- Rate limiting for API endpoints

## Build Configurations

### Cloudflare Pages (Default)

```bash
npm run build
```

Uses `@astrojs/cloudflare` adapter for deployment to Cloudflare Pages.

### Node.js Build

```bash
npm run build:node
# or
USE_NODE_ADAPTER=true npm run build
```

Uses `@astrojs/node` adapter for standalone Node.js deployment.

## Development Workflow

1. **Local Development**:
   - `npm run dev` - Cloudflare Pages dev environment with Wrangler
   - `npm run dev:node` - Astro dev server with Node.js

2. **Testing**:
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Component testing with Storybook

3. **Code Quality**:
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for formatting
   - Markuplint for HTML quality
