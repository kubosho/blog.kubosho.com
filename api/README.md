# Blog API

A Cloudflare Workers-based API for the blog application that provides like functionality for blog entries.

## Features

- **Like System**: Submit and retrieve like counts for blog entries
- **Rate Limiting**: Cloudflare rate limiting integration
- **Data Persistence**: Database storage for reliable data management
- **Error Tracking**: Sentry integration for comprehensive monitoring
- **Validation**: Request validation using Valibot
- **Testing**: Comprehensive test suite with Vitest

## Setup

### Prerequisites

- Node.js 22+
- Cloudflare Workers account
- Database (optional for development)

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL`: Database connection string
- `RATE_LIMITER`: Cloudflare Rate Limiting API binding

### Development

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## API Endpoints

### POST `/api/likes/:entryId`

Submit likes for a blog entry.

**Parameters:**

- `entryId`: Blog entry identifier

**Request Body:**

```json
{
  "counts": 1
}
```

**Response:**

```json
{
  "success": true,
  "total": 1
}
```

### GET `/api/likes/:entryId`

Retrieve like count for a blog entry.

**Parameters:**

- `entryId`: Blog entry identifier

**Response:**

```json
{
  "counts": 1
}
```

## Architecture

- **Framework**: Hono.js for lightweight HTTP handling
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Validation**: Valibot for request validation
- **Rate Limiting**: Cloudflare rate limiting
- **Error Tracking**: Sentry integration
- **Logging**: Pino for structured logging
- **Testing**: Vitest with comprehensive test coverage

## Rate Limiting

The API implements multiple layers of rate limiting to protect against abuse and ensure system stability.

## Database Schema

The application uses a relational database to store like counts with appropriate indexing for performance optimization.
