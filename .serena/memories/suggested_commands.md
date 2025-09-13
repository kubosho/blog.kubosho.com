# Suggested Commands

## Installation

```bash
# Install all dependencies
npm install
```

## Development

### Local Development

```bash
# Start development server (development mode)
npm run dev

# Start development server (production mode for testing)
npm run dev:prd
```

## Building

### Production Builds

```bash
# Build for development (faster build for testing)
npm run build

# Build for production (optimized)
npm run build:prd

# Generate Open Graph images
npm run gen:ogimage

# Deploy to Cloudflare Pages
npm run deploy
```

## Testing

### Unit Tests

```bash
# Run unit tests with Vitest
npm test
npm run test
```

## Code Quality

### Type Checking

```bash
# Check TypeScript types
npm run check:ts

# Check Astro components
npm run check:astro
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

## Development Tools

### Storybook

```bash
# Start Storybook dev server
npm run storybook
```

### Database Operations

```bash
# Database operations via Drizzle ORM
# (Access through application code, no direct CLI commands)
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

## File Operations

```bash
# List files and directories
ls -la
find . -name "*.ts"

# Search content (use ripgrep when available)
rg "pattern"
grep -r "pattern" .
```

## Combined Workflows

### Development Workflow

```bash
# Start development
npm install
npm run dev

# In another terminal, generate OG images if needed
npm run gen:ogimage
```

### Before Committing

```bash
# Complete quality check pipeline
npm run format && npm run check:ts && npm run check:astro && npm run lint:script && npm run lint:style && npm run lint:markup && npm test
```

### Production Deployment

```bash
# Build and deploy
npm run build:prd && npm run deploy
```

### Development Testing

```bash
# Test development build
npm run build && npm run deploy
```

## Environment Configuration

### Environment Files

- Copy `.env.example` to `.env` for local development
- Configure Cloudflare Workers settings in `wrangler.jsonc`
- Use `.envrc.example` for direnv setup (optional)

### Docker Development

```bash
# Start development environment with Docker
docker-compose up -d

# Stop development environment
docker-compose down
```

## Debugging Commands

### Build Debugging

```bash
# Check build output
npm run build && ls -la dist/

# Check development build
npm run build:prd && ls -la dist/
```

### Development Debugging

```bash
# Run with verbose logging (if supported)
DEBUG=* npm run dev

# Check TypeScript compilation
npm run check:ts --verbose
```

## Common Development Tasks

### Adding New Blog Post

1. Create markdown file in `src/content/entries/`
2. Add frontmatter with required metadata
3. Generate OG image: `npm run gen:ogimage`
4. Test locally: `npm run dev`

### Working with Features

- Entry features: `src/features/entry/`
- Like system: `src/features/likes/`
- Analytics: `src/features/tracking/`
- Feed generation: `src/features/feed/`

### Package Management

```bash
# Add new dependency
npm install <package>

# Add development dependency
npm install --save-dev <package>

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Performance & Optimization

```bash
# Analyze bundle size (if configured)
npm run build:prd && npx astro build --analyze

# Check for security vulnerabilities
npm audit
```
