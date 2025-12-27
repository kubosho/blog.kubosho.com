# blog.kubosho.com

The source files for [blog.kubosho.com](https://blog.kubosho.com).

## Requirements

- Node.js
- Wrangler CLI (for Cloudflare development)

## Installation

```bash
npm install
```

## Development Setup

### Environment Variables Configuration

#### API Environment Variables

Create `.dev.vars` for secrets:

```bash
# Edit .dev.vars as needed
```

For development without Wrangler, create `.env`:

```bash
cp .env.example .env
# Edit .env with your values
```

### Development Modes

This mode uses the standard Astro development server.

```bash
npm run dev
```

Access the application at: <http://localhost:4321>

## Deployment

Automatically deployed to Cloudflare Workers on push to the main branch.
