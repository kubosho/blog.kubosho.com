# Suggested Commands

## Installation

```bash
# Install all dependencies
npm install
```

## Development

### Cloudflare Pages Development

```bash
# Start development with Wrangler (Cloudflare Pages environment)
npm run dev

# Preview production build
npm run preview
```

### Node.js Development

```bash
# Start Astro dev server (Node.js environment)
npm run dev:node

# Preview Node.js production build
npm run preview:node
```

## Building

### Production Builds

```bash
# Build for Cloudflare Pages (default)
npm run build

# Build for Node.js
npm run build:node
# or
USE_NODE_ADAPTER=true npm run build

# Generate Open Graph images
npm run build:ogimage
```

## Testing

### Unit Tests

```bash
# Run unit tests with Vitest
npm test
```

### E2E Tests

```bash
# Run Playwright E2E tests
npm run test:e2e
```

## Code Quality

### Type Checking

```bash
# Check TypeScript types
npm run check:ts
```

### Linting

```bash
# Lint TypeScript/JavaScript
npm run lint:script

# Lint CSS styles
npm run lint:style

# Lint Astro markup
npm run lint:markup
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check formatting (useful for CI)
npm run check:format
```

## Storybook

```bash
# Start Storybook dev server
npm run storybook
```

## Git Operations

```bash
# Basic git commands (available without approval)
git status
git diff
git log
git add .
git commit -m "message"

# Git worktree workflow (from CLAUDE.md)
git wt-create feature/branch-name
cd .git-worktrees/feature/branch-name
```

## System Utilities

```bash
# File operations
ls -la
find . -name "*.ts"

# Use ripgrep for faster search (preferred)
rg "pattern"

# Standard grep
grep -r "pattern" .
```

## Combined Workflows

### Before Committing

```bash
# Format, type check, and test
npm run format && npm run check:ts && npm test
```

### Full Quality Check

```bash
# Run all quality checks
npm run check:format && npm run check:ts && npm run lint:script && npm run lint:style && npm run lint:markup && npm test
```

### Production Build Check

```bash
# Build and preview
npm run build && npm run preview
```

## Environment Variables

- Astro uses `.env` files for environment variables
- Cloudflare Workers configuration in `wrangler.jsonc`
- Copy `.env.example` to `.env` for local development

## Common Development Tasks

### Adding a New Blog Post

1. Create a new markdown file in `src/content/entries/`
2. Add frontmatter with required metadata
3. Generate OG image if needed: `npm run build:ogimage`

### Working with Features

- Entry features: `src/features/entry/`
- Like system: `src/features/likes/`
- Analytics: `src/features/tracking/`
- Feed generation: `src/features/feed/`

### Debugging

```bash
# Run dev server with verbose logging
DEBUG=* npm run dev:node

# Check build output
npm run build && ls -la dist/
```
