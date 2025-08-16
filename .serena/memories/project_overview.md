# Project Overview - blog.kubosho.com

## Purpose

This is the source code for blog.kubosho.com, a personal blog website built with modern web technologies.

## Tech Stack

### Frontend (Client)

- **Framework**: Astro (v4.16.18) - Static site generator with hybrid rendering
- **UI Library**: React (v19.1.1) - For interactive components
- **Language**: TypeScript (v5.8.3)
- **Styling**: CSS Modules
- **Markdown Processing**: remark, unified
- **Syntax Highlighting**: Prism.js
- **Build Target**: Cloudflare Pages / Node.js (configurable)

### Backend (API)

- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js (v4.8.12) - Lightweight web framework
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Validation**: Valibot
- **Error Tracking**: Sentry
- **Logging**: Pino
- **Rate Limiting**: Cloudflare Rate Limiting

### Testing & Quality

- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **Linting**: ESLint with @kubosho/configs
- **Formatting**: Prettier
- **Markup Linting**: markuplint
- **Style Linting**: Stylelint

## Architecture

- **Monorepo Structure**: Workspace-based with `client` and `api` packages
- **Deployment**:
  - Client: Cloudflare Pages or Node.js standalone
  - API: Cloudflare Workers
- **Content Management**: Markdown files in `client/src/content/entries/`
- **API Features**: Like system for blog entries with rate limiting

## Key Features

- Server-side rendering with Astro
- Interactive like button functionality
- RSS/Atom feed generation
- Sitemap generation
- Open Graph image generation
- i18n support (Japanese)
- Analytics with Google Tag Manager
- Privacy-focused with opt-out options
