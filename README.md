# blog.kubosho.com

The source files for [blog.kubosho.com](https://blog.kubosho.com).

## Requirements

- Node.js
- Docker & Docker Compose (for PostgreSQL)
- Wrangler CLI (for Cloudflare development)

## Installation

```bash
npm install
```

## Development Setup

### 1. Database Setup

Start PostgreSQL database using Docker:

```bash
# Start PostgreSQL service (port: 5432, database: main)
docker-compose up -d

# Run initial database migration
docker exec -i blog.kubosho.com-postgres-1 psql -U postgres -d main < api/migrations/0000_initial_likes_table.sql
```

### 2. Environment Variables Configuration

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

### 3. Development Modes

#### Option A: Cloudflare Workers emulates

This mode fully emulates the Cloudflare Workers runtime in local environments.

```bash
npm run dev
```

Access the application at: <http://localhost:8787>

#### Option B: Use Node.js runtime

This mode uses the standard Astro development server without Cloudflare runtime emulation.

```bash
npm run dev:node
```

Access the application at: <http://localhost:4321>

## Deployment

### Cloudflare Pages

Automatically deployed to Cloudflare Pages on push to the main branch.

### Cloudflare Workers

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy
```
