# Project Structure

## Root Directory

```text
blog.kubosho.com/
├── api/                    # API workspace (Cloudflare Workers)
├── client/                 # Client workspace (Astro site)
├── constants/              # Shared constants
├── package.json            # Root package with workspaces
├── tsconfig.json           # TypeScript config
├── eslint.config.mjs       # ESLint configuration
├── prettier.config.mjs     # Prettier configuration
├── stylelint.config.mjs    # Stylelint configuration
└── markuplint.config.mjs   # Markuplint configuration
```

## API Workspace (`/api`)

```text
api/
├── src/
│   ├── index.ts           # Main entry point
│   ├── db/                # Database related
│   │   ├── connection.ts  # DB connection setup
│   │   └── schema.ts      # Database schema
│   ├── middleware/        # Middleware functions
│   │   ├── cors.ts        # CORS handling
│   │   ├── errorHandler.ts # Error handling
│   │   ├── logging.ts     # Request logging
│   │   ├── rateLimit.ts   # Rate limiting
│   │   └── sentry.ts      # Sentry integration
│   ├── routes/            # API routes
│   │   └── likes.ts       # Likes endpoints
│   ├── services/          # Business logic
│   │   └── likeService.ts # Like service
│   ├── tracker/           # Error tracking
│   └── validation/        # Request validation
│       └── schemas.ts     # Validation schemas
├── migrations/            # Database migrations
├── wrangler.toml          # Cloudflare Workers config
└── vitest.config.ts       # Test configuration
```

## Client Workspace (`/client`)

```text
client/
├── src/
│   ├── content/
│   │   ├── config.ts      # Content configuration
│   │   └── entries/       # Blog post markdown files
│   ├── pages/             # Astro pages
│   │   ├── index.astro    # Homepage
│   │   ├── entries.astro  # All entries page
│   │   ├── entries/
│   │   │   └── [id].astro # Individual entry page
│   │   ├── categories/
│   │   │   └── [category].astro
│   │   ├── tags/
│   │   │   └── [tag].astro
│   │   ├── feed/          # RSS/Atom feed
│   │   ├── policy/        # Privacy policy
│   │   └── _layouts/      # Layout components
│   └── app/
│       ├── components/    # Shared components
│       ├── entry/         # Entry-related logic
│       │   └── LikeButton/ # Like button component
│       ├── locales/       # i18n files
│       ├── tracking/      # Analytics
│       └── structured_data/ # SEO structured data
├── public/
│   └── assets/
│       ├── images/og/     # Open Graph images
│       └── styles/        # Global CSS
├── tools/
│   └── og_image/          # OG image generation
├── e2e/                   # E2E tests
├── astro.config.ts        # Astro configuration
├── vitest.config.ts       # Unit test config
└── playwright.config.ts   # E2E test config
```

## Constants (`/constants`)

Shared constants between client and API, such as site metadata.

## Key Files

- **Blog Content**: `client/src/content/entries/*.md`
- **Entry Page Template**: `client/src/pages/entries/[id].astro`
- **Like API**: `api/src/routes/likes.ts`
- **Like Button Component**: `client/src/app/entry/LikeButton/`
- **Database Schema**: `api/src/db/schema.ts`
