# Task Completion Checklist

When completing any coding task, ensure you follow these steps:

## 1. Before Starting

- [ ] Understand the requirements fully
- [ ] Check existing code patterns and conventions
- [ ] Plan the implementation approach
- [ ] Create/update todo list if task is complex

## 2. During Development

- [ ] Follow existing code patterns
- [ ] Use TypeScript types properly
- [ ] Keep functions small and focused
- [ ] Add necessary imports
- [ ] Handle errors appropriately

## 3. After Implementation

### Code Quality Checks

- [ ] **Format code**: Run appropriate format command
  - Client: `npm run format -w client`
  - API: `npm run format -w api`

- [ ] **Type checking**: Ensure no TypeScript errors
  - Client: `npm run check:ts -w client`
  - API: `npm run check:ts -w api`

- [ ] **Linting**: Fix all linting issues
  - Script: `npm run lint:script`
  - Style: `npm run lint:style`
  - Markup: `npm run lint:markup`

### Testing

- [ ] **Run existing tests**: Ensure no regressions
  - Client: `npm test -w client`
  - API: `npm test -w api`

- [ ] **Add new tests**: For new functionality (if applicable)
- [ ] **E2E tests**: Run if UI changes made
  - `npm run test:e2e -w client`

### Build Verification

- [ ] **Build succeeds**: Verify production build
  - Client: `npm run build -w client`
  - API: Ready for deployment

## 4. Before Committing

- [ ] Review all changes with `git diff`
- [ ] Ensure no debug code or console.logs
- [ ] Check for any sensitive information
- [ ] Write clear commit message
- [ ] All checks pass (format, lint, test, build)

## 5. Special Considerations

### For Client Changes

- [ ] Check responsive design if UI changed
- [ ] Verify accessibility (keyboard navigation, ARIA)
- [ ] Test in different browsers if critical
- [ ] Update Open Graph images if needed

### For API Changes

- [ ] Update API documentation in README if needed
- [ ] Check rate limiting still works
- [ ] Verify error responses are consistent
- [ ] Database migrations applied if schema changed

### For Content Changes

- [ ] Markdown renders correctly
- [ ] Images have proper alt text
- [ ] Links work correctly
- [ ] Metadata (title, description) is accurate

## 6. Final Verification

- [ ] Feature works as expected
- [ ] No console errors in browser
- [ ] Performance is acceptable
- [ ] Code follows project conventions

## Quick Command Reference

```bash
# Run all checks for client
npm run check:format -w client && npm run check:ts -w client && npm test -w client

# Run all checks for API
npm run check:format -w api && npm run check:ts -w api && npm test -w api
```

**Note**: If any check fails, fix the issues before proceeding. Never commit code that doesn't pass all checks.
