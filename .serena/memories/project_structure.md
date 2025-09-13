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
├── .storybook/            # Storybook configuration
├── constants/             # Shared constants
├── .serena/               # Serena MCP configuration
│   ├── project.yml        # Serena project configuration
│   └── memories/          # Project memories
├── .ai_specs/             # AI-specific documentation
├── .vscode/               # VS Code settings
├── .claude/               # Claude Code configuration
├── .github/               # GitHub Actions workflows
├── __entries__/           # Generated entry files
├── package.json           # Single package configuration
├── tsconfig.json          # TypeScript config
├── astro.config.ts        # Astro configuration
├── wrangler.jsonc         # Cloudflare Workers config
├── vitest.config.ts       # Unit test config
├── eslint.config.mjs      # ESLint configuration
├── prettier.config.mjs    # Prettier configuration
├── stylelint.config.mjs   # Stylelint configuration
├── markuplint.config.mjs  # Markuplint configuration
├── release.config.mjs     # Semantic Release config
├── docker-compose.yml     # Docker development environment
├── .env.example           # Environment variables template
├── .envrc.example         # Direnv configuration template
├── .tool-versions         # asdf/mise tool versions
└── README.md              # Project documentation
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

### Features (Domain-driven organization)

- **Like System**: `src/features/likes/`
- **Entry Components**: `src/features/entry/`
- **Analytics**: `src/features/tracking/`
- **Feed Generation**: `src/features/feed/`
- **SEO**: `src/features/structured_data/`
- **i18n**: `src/features/locales/`

### Configuration Files

- **Astro Config**: `astro.config.ts`
- **TypeScript**: `tsconfig.json`
- **Cloudflare**: `wrangler.jsonc`
- **Testing**: `vitest.config.ts`
- **Package Management**: `package.json` (single package, no workspaces)

### Development Tools

- **OG Image Generation**: `tools/og_image/`
- **Storybook**: `.storybook/`
- **Docker**: `docker-compose.yml`
- **Environment**: `.env.example`, `.envrc.example`

### Build Outputs

- **Default Build**: `dist/` (Cloudflare Pages)
- **Node Build**: `dist/` (Node.js adapter when USE_NODE_ADAPTER=true)
- **Generated Entries**: `__entries__/` (build-time generated files)

## Architecture Notes

### Single Package Structure

- **No Workspaces**: Uses a single `package.json` instead of workspace configuration
- **Unified Build**: Single build process with multiple deployment targets
- **Shared Dependencies**: All dependencies managed at root level

### Feature Organization

- **Domain-driven**: Features organized by business domain (likes, entry, tracking)
- **Self-contained**: Each feature includes components, services, and utilities
- **Clear boundaries**: Features avoid circular dependencies

### Build System

- **Multi-target**: Supports both Cloudflare Pages and Node.js deployment
- **Asset optimization**: Automatic image optimization and OG image generation
- **Type safety**: Full TypeScript coverage with strict mode
