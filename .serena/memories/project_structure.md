# Project Structure

## Root Directory

```text
blog.kubosho.com/
├── src/                    # Main source directory
│   ├── content/           # Content management
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
│   ├── components/        # Shared UI components
│   ├── features/          # Feature modules
│   │   ├── entry/         # Entry-related logic
│   │   ├── likes/         # Like functionality
│   │   ├── tracking/      # Analytics
│   │   ├── feed/          # Feed generation
│   │   ├── structured_data/ # SEO structured data
│   │   └── locales/       # i18n files
│   └── utils/             # Utility functions
├── tools/                 # Development tools
│   └── og_image/          # OG image generation
├── public/
│   └── assets/
│       ├── images/og/     # Open Graph images
│       └── styles/        # Global CSS
├── e2e/                   # E2E tests (Playwright)
├── .storybook/            # Storybook configuration
├── constants/             # Shared constants
├── package.json           # Single package configuration
├── tsconfig.json          # TypeScript config
├── astro.config.ts        # Astro configuration
├── wrangler.jsonc         # Cloudflare Workers config
├── vitest.config.ts       # Unit test config
├── playwright.config.ts   # E2E test config
├── eslint.config.mjs      # ESLint configuration
├── prettier.config.mjs    # Prettier configuration
├── stylelint.config.mjs   # Stylelint configuration
└── markuplint.config.mjs  # Markuplint configuration
```

## Key Files and Directories

### Content Management

- **Blog Content**: `src/content/entries/*.md`
- **Content Config**: `src/content/config.ts`

### Pages

- **Homepage**: `src/pages/index.astro`
- **Entry Page Template**: `src/pages/entries/[id].astro`
- **Category Pages**: `src/pages/categories/[category].astro`
- **Tag Pages**: `src/pages/tags/[tag].astro`

### Features

- **Like System**: `src/features/likes/`
- **Entry Components**: `src/features/entry/`
- **Analytics**: `src/features/tracking/`
- **Feed Generation**: `src/features/feed/`
- **SEO**: `src/features/structured_data/`
- **i18n**: `src/features/locales/`

### Configuration

- **Astro Config**: `astro.config.ts`
- **TypeScript**: `tsconfig.json`
- **Cloudflare**: `wrangler.jsonc`
- **Testing**: `vitest.config.ts`, `playwright.config.ts`

## Build Outputs

- **Default Build**: `dist/` (Cloudflare Pages)
- **Node Build**: `dist/` (Node.js adapter when USE_NODE_ADAPTER=true)
