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

- [ ] **Format code**: Run format command
  - `npm run format`

- [ ] **Type checking**: Ensure no TypeScript errors
  - `npm run check:ts`

- [ ] **Linting**: Fix all linting issues
  - Script: `npm run lint:script`
  - Style: `npm run lint:style`
  - Markup: `npm run lint:markup`

### Testing

- [ ] **Run existing tests**: Ensure no regressions
  - `npm test`

- [ ] **Add new tests**: For new functionality (if applicable)
- [ ] **E2E tests**: Run if UI changes made
  - `npm run test:e2e`

### Build Verification

- [ ] **Build succeeds**: Verify production build
  - Default: `npm run build`
  - Node.js: `npm run build:node`

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

### For Content Changes

- [ ] Markdown renders correctly
- [ ] Images have proper alt text
- [ ] Links work correctly
- [ ] Metadata (title, description) is accurate

### For Feature Development

- [ ] Consider both Cloudflare Pages and Node.js environments
- [ ] Test with appropriate development server
- [ ] Verify database operations work correctly
- [ ] Check rate limiting functionality

## 6. Final Verification

- [ ] Feature works as expected
- [ ] No console errors in browser
- [ ] Performance is acceptable
- [ ] Code follows project conventions

## Quick Command Reference

```bash
# Run all quality checks
npm run format && npm run check:ts && npm run lint:script && npm run lint:style && npm run lint:markup && npm test

# Build verification
npm run build && npm run preview

# Node.js build verification
npm run build:node && npm run preview:node
```

**Note**: If any check fails, fix the issues before proceeding. Never commit code that doesn't pass all checks.
