# Code Style and Conventions

## General Principles

- Use TypeScript for all JavaScript code
- Follow functional programming patterns where appropriate
- Keep components small and focused
- Write tests for critical functionality

## TypeScript Configuration

- Extends `@kubosho/configs/typescript/tsconfig.json`
- Strict mode enabled
- ES modules used throughout

## Code Formatting

### Prettier

- Configuration extends `@kubosho/configs/prettier`
- Automatically formats on save (if configured in IDE)
- Run `npm run format` to format manually

### Indentation & Spacing

- 2 spaces for indentation
- No tabs
- Single quotes for strings (configured in Prettier)
- Semicolons required

## Linting Rules

### ESLint

- Extends `@kubosho/configs/eslint`
- Additional rules for Astro files
- Storybook plugin configured
- Import order enforced

### Key ESLint Rules

- No unused variables
- No console logs in production code
- Import/export syntax enforced
- Proper error handling required

### Stylelint

- CSS and CSS Modules linting
- Follows standard CSS conventions

### Markuplint

- Validates Astro component markup
- Ensures accessibility best practices

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (e.g., `LikeButton.tsx`)
- **Utilities**: camelCase (e.g., `likeService.ts`)
- **Test files**: Same name with `.test.ts` suffix
- **CSS Modules**: Same name with `.module.css` suffix

### Code Conventions

- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Private methods**: Prefix with underscore (rarely used)

## React/Astro Components

- Functional components preferred
- Use TypeScript interfaces for props
- Keep logic separate from presentation
- CSS Modules for component styling

## API Conventions

- RESTful endpoints
- Consistent error response format
- Request validation with Valibot
- Middleware for cross-cutting concerns

## Testing Conventions

- Unit tests with Vitest
- E2E tests with Playwright
- Test files colocated with source
- Mock data in `__mocks__` directories
- Fixtures in `__tests__/fixtures`

## Import Order

1. External dependencies
2. Internal absolute imports
3. Internal relative imports
4. Type imports
5. CSS imports

## Documentation

- JSDoc comments for public APIs
- README files for major modules
- Inline comments for complex logic only
- AVOID adding comments unless explicitly requested

## Git Conventions

- Conventional commits format preferred
- Small, focused commits
- Feature branches for new work
- Squash merge for PRs

## File Organization

- Group related functionality
- Separate concerns (data, UI, logic)
- Use barrel exports (index.ts) sparingly
- Keep test utilities in test directories
