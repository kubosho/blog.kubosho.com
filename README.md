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

Create `api/.dev.vars` for API secrets:

```bash
# Already exists in the project
# Edit api/.dev.vars as needed
```

#### Client Environment Variables

Create `client/.dev.vars` for client-side secrets:

```bash
# Already exists in the project
# Edit client/.dev.vars as needed
```

For development without Wrangler, create `client/.env`:

```bash
cp client/.env.example client/.env
# Edit client/.env with your values
```

### 3. Development Modes

#### Option A: Cloudflare Workers emulates

This mode fully emulates the Cloudflare Workers runtime in local environments.

```bash
# Terminal 1: Start API server
npm -C api run dev

# Terminal 2: Start client with Wrangler Pages
npm -C client run dev
```

Access the application at: <http://localhost:8788>

#### Option B: Use Node.js runtime

This mode uses the standard Astro development server without Cloudflare runtime emulation.

```bash
# Terminal 1: Start API server
npm -C api run dev

# Terminal 2: Start client with Astro dev server
npm -C client run dev:node
```

Access the application at: <http://localhost:4321>

## Deployment

### Cloudflare Pages (Client)

The client is automatically deployed to Cloudflare Pages on push to the main branch.

### Cloudflare Workers (API)

```bash
# Deploy API to Cloudflare Workers
cd api
npx wrangler deploy
```
