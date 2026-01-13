import { safeParse } from 'valibot';
import { describe, expect, it } from 'vitest';

import { likesOnPostRequestSchema, MAX_INCREMENT_VALUE } from './likesApiValidationSchema';

describe('likesOnPostRequestSchema', () => {
  describe('increment field', () => {
    it('accepts valid increment value of 1', () => {
      // Arrange
      const input = { increment: 1 };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts increment value at MAX_INCREMENT_VALUE', () => {
      // Arrange
      const input = { increment: MAX_INCREMENT_VALUE };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(true);
    });

    it('rejects increment value of 0', () => {
      // Arrange
      const input = { increment: 0 };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('Increment must be at least 1');
      }
    });

    it('rejects negative increment value', () => {
      // Arrange
      const input = { increment: -1 };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('Increment must be at least 1');
      }
    });

    it('rejects increment value exceeding MAX_INCREMENT_VALUE', () => {
      // Arrange
      const input = { increment: MAX_INCREMENT_VALUE + 1 };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe(`Increment must be at most ${MAX_INCREMENT_VALUE}`);
      }
    });

    it('rejects non-integer increment value', () => {
      // Arrange
      const input = { increment: 1.5 };

      // Act
      const result = safeParse(likesOnPostRequestSchema, input);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});
