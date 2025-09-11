# Contributing

## Testing

```bash
npm test
```

## Building application

```bash
npm run build
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
