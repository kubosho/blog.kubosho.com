# Contributing

## Environment Variables Access

### In Astro Components (.astro files)

```astro
---
import { getEnvVar } from '../utils/env';

const apiUrl = getEnvVar(Astro, 'PUBLIC_API_BASE_URL');
const sentryDsn = getEnvVar(Astro, 'SENTRY_DSN');

// Direct access in Cloudflare runtime
const { env } = Astro.locals.runtime || {};
const secret = env?.MY_SECRET;

// Fallback to import.meta.env for public variables
const publicApiUrl = import.meta.env.PUBLIC_API_BASE_URL;
---
```

### In TypeScript / JavaScript Files

```typescript
import { getEnvVar } from './utils/env';

export function myServerFunction() {
  const secret = getEnvVar(null, 'MY_SECRET');
  // Use secret...
}
```

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## Building for Production

```bash
# Build client for Cloudflare Pages
npm run build

# Build client for Node.js deployment
npm run build:node

# Generate Open Graph images
npm run build:ogimage
```

## Setting Secrets in Production

### For Cloudflare Pages (Client)

```bash
# Set secrets via Cloudflare Dashboard or Wrangler
npx wrangler pages secret put MY_SECRET --project-name=your-pages-project
```

### For Cloudflare Workers (API)

```bash
cd api
npx wrangler secret put MY_SECRET
```

## Troubleshooting

### Database Issues

```bash
# Check Docker service status
docker-compose ps

# View database logs
docker-compose logs -f

# Restart database
docker-compose restart

# Reset database
docker-compose down -v
docker-compose up -d
# Re-run migrations
```

### Wrangler Issues

```bash
# Check Wrangler version
wrangler --version

# Login to Cloudflare
wrangler login

# View Wrangler logs
npm run dev -- --log-level debug
```

### Environment Variables Not Working

1. **In Cloudflare runtime mode**: Check `.dev.vars` files
2. **In Node.js runtime mode**: Check `.env` files
3. **Ensure PUBLIC\_ prefix** for client-side variables
4. **Restart dev servers** after changing environment files
