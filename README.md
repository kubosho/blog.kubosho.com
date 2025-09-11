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
docker exec -i blog.kubosho.com-postgres-1 psql -U postgres -d main < src/features/likes/utils/initializeLikesTable.sql
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

This mode uses the standard Astro development server.

```bash
npm run dev
```

Access the application at: <http://localhost:4321>

## Deployment

Automatically deployed to Cloudflare Workers on push to the main branch.
