# Code Style and Conventions

## General Principles

- Use TypeScript for all JavaScript code
- Follow functional programming patterns where appropriate
- Keep components small and focused
- Write tests for critical functionality
- Follow single responsibility principle

## TypeScript Configuration

- Extends `@kubosho/configs/typescript/tsconfig.json`
- Strict mode enabled
- ES modules used throughout
- No implicit any allowed

## Code Formatting

### Prettier

- Configuration extends `@kubosho/configs/prettier`
- Automatically formats on save (if configured in IDE)
- Run `npm run format` to format manually
- CI checks formatting with `npm run check:format`

### Indentation & Spacing

- 2 spaces for indentation
- No tabs
- Single quotes for strings (configured in Prettier)
- Semicolons required
- Trailing commas in multiline structures

## Linting Rules

### ESLint

- Extends `@kubosho/configs/eslint`
- Additional rules for Astro files
- Storybook plugin configured
- Import order enforced
- Run with `npm run lint:script`

### Key ESLint Rules

- No unused variables
- No console logs in production code
- Import/export syntax enforced
- Proper error handling required
- Consistent naming conventions

### Stylelint

- CSS and CSS Modules linting
- Follows standard CSS conventions
- Run with `npm run lint:style`

### Markuplint

- Validates Astro component markup
- Ensures accessibility best practices
- Run with `npm run lint:markup`

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (e.g., `LikeButton.tsx`)
- **Utilities**: camelCase (e.g., `likeService.ts`)
- **Test files**: Same name with `.test.ts` suffix
- **CSS Modules**: Same name with `.module.css` suffix
- **Astro components**: PascalCase (e.g., `BlogPost.astro`)

### Code Conventions

- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Private methods**: Prefix with underscore (rarely used)
- **React components**: PascalCase

## Comments Policy

**CRITICAL**: Do NOT add comments unless explicitly requested

- Comments should be avoided in favor of self-documenting code
- Use descriptive variable and function names
- Only add comments when business logic is complex or non-obvious
- JSDoc comments for public APIs only when requested
- Avoid redundant comments that simply restate the code
- Remove TODO comments before committing

## React/Astro Components

- Functional components preferred
- Use TypeScript interfaces for props
- Keep logic separate from presentation
- CSS Modules for component styling
- Avoid inline styles unless necessary

## API Conventions

- RESTful endpoints
- Consistent error response format
- Request validation with Valibot
- Middleware for cross-cutting concerns
- Proper HTTP status codes

## Testing Conventions

- Unit tests with Vitest
- Test files colocated with source
- Mock data in `__mocks__` directories
- Fixtures in `__tests__/fixtures`
- Test naming: `describe` for components/functions, `it` for specific behaviors

## Import Order

1. External dependencies
2. Internal absolute imports
3. Internal relative imports
4. Type imports (with `type` modifier)
5. CSS imports

Example:

```typescript
import React from 'react';
import { dayjs } from 'dayjs';

import { formatDate } from '~/utils/date';

import './Component.module.css';
import type { ComponentProps } from './types';
```

## Error Handling

- Use Valibot for input validation
- Consistent error response format
- Proper error boundaries in React components
- Meaningful error messages
- Log errors appropriately with Pino

## Performance Guidelines

- Lazy load components when appropriate
- Optimize images and assets
- Use CSS Modules for scoped styling
- Minimize bundle size
- Consider server-side rendering implications

## Git Conventions

- Conventional commits format preferred
- Small, focused commits
- Feature branches for new work
- Squash merge for PRs
- Use git worktree workflow from CLAUDE.md

## Accessibility

- Follow WCAG 2.1 AA guidelines
- Use semantic HTML elements
- Proper ARIA attributes when needed
- Keyboard navigation support
- Alt text for images

## File Organization

- Group related functionality by feature
- Separate concerns (data, UI, logic)
- Use barrel exports (index.ts) sparingly
- Keep test utilities in test directories
- Co-locate related files when possible

## Build and Deployment

- Support both Cloudflare Pages and Node.js environments
- Environment-specific configurations
- Proper asset optimization
- Type-safe environment variables
