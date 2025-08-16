# Suggested Commands

## Installation

```bash
# Install all dependencies (root and workspaces)
npm install
```

## Development

### Client Development

```bash
# Start Astro dev server
npm run dev -w client

# Preview production build
npm run preview -w client
```

### API Development

```bash
# Start Cloudflare Workers dev server
npm run dev -w api

# Deploy to Cloudflare Workers
npm run deploy -w api
```

## Building

### Client Build

```bash
# Build for Cloudflare Pages (default)
npm run build -w client

# Build for Node.js
npm run build:node -w client

# Generate Open Graph images
npm run build:ogimage -w client
```

## Testing

### Unit Tests

```bash
# Run client tests
npm test -w client

# Run API tests
npm test -w api

# Run all tests
npm test --workspaces
```

### E2E Tests

```bash
# Run Playwright E2E tests
npm run test:e2e -w client
```

## Code Quality

### Linting

```bash
# Lint TypeScript/JavaScript (root level)
npm run lint:script

# Lint CSS styles
npm run lint:style

# Lint Astro markup
npm run lint:markup
```

### Formatting

```bash
# Format client code
npm run format -w client

# Format API code
npm run format -w api

# Check formatting (CI)
npm run check:format -w client
npm run check:format -w api
```

### Type Checking

```bash
# Type check client
npm run check:ts -w client

# Type check API
npm run check:ts -w api
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

# Git worktree (from CLAUDE.md)
git wt-create feature/branch-name
cd .git-worktrees/feature/branch-name
```

## System Utilities

```bash
# File operations
ls -la
find . -name "*.ts"
grep -r "pattern" .

# Use ripgrep for faster search
rg "pattern"
```

## Combined Workflows

### Before Committing

```bash
# Format, lint, and test
npm run check:format -w client && npm run check:ts -w client && npm test -w client
npm run check:format -w api && npm run check:ts -w api && npm test -w api
```

### Full Build Check

```bash
# Build both client and API
npm run build -w client && npm run build -w api
```

## Environment Variables

- Client uses Astro's environment variable handling
- API uses `.env` file (copy from `.env.example`)
- Cloudflare Workers uses `wrangler.toml` for configuration
