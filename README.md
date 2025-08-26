# blog.kubosho.com

The source files for [blog.kubosho.com](blog.kubosho.com).

## Development

### Requirements

- Node.js
- Docker & Docker Compose (for PostgreSQL)

### Local Development Setup

#### 1. Install dependencies

```bash
npm install
```

#### 2. PostgreSQL and Database Setup

This project uses PostgreSQL for the database. Follow these steps to set up the local database environment:

##### Start PostgreSQL service

Start PostgreSQL (port: 5432, database: main) by running the following command in the project root:

```bash
docker-compose up -d
```

##### Database Migration

For initial setup, create tables in the database:

```bash
docker exec -i blog.kubosho.com-postgres-1 psql -U postgres -d main < api/migrations/0000_initial_likes_table.sql
```

#### 3. Start Development Servers

Start the API server:

```bash
npm -C api run dev
```

Start the preview server:

```bash
npm run dev
```

### Troubleshooting

#### Check Docker service status

```bash
docker-compose ps
```

#### View logs

```bash
docker-compose logs -f
```

#### Restart services

```bash
docker-compose restart
```

#### Stop and remove services

```bash
docker-compose down
# To also remove data
docker-compose down -v
```
