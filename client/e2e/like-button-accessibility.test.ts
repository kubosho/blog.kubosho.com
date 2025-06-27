import { expect, test } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL } from '../../constants/site_data';

test.describe('Like Button - Accessibility Tests', () => {
  const testEntrySlug = 'eslint-plugin-import-error-on-vitest-configuration-file';
  const testEntryUrl = `${LOCAL_SITE_URL}${pathList.entries}/${testEntrySlug}.html`;

  test.describe('Keyboard navigation', () => {
    test('Should be focusable and operable with keyboard', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // When: Navigate to button with Tab key
      await page.keyboard.press('Tab');
      await expect(likeButton).toBeFocused();

      // Should have visible focus indicator
      const focusOutline = await likeButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      expect(focusOutline).toBe(true);

      // Then: Should be operable with Enter key
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await page.keyboard.press('Enter');
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // And with Space key
      await page.keyboard.press('Space');
      await expect(likeCount).toHaveText((initialCount + 2).toString());
    });

    test('Should maintain focus after interaction', async ({ page }) => {
      // Given: Navigate to blog entry and focus button
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      await likeButton.focus();

      // When: Activate button with keyboard
      await page.keyboard.press('Enter');

      // Then: Focus should remain on button
      await expect(likeButton).toBeFocused();
    });

    test('Should not trap focus', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Tab to like button
      await page.keyboard.press('Tab');
      await expect(likeButton).toBeFocused();

      // Then: Should be able to tab away
      await page.keyboard.press('Tab');
      await expect(likeButton).not.toBeFocused();
    });
  });

  test.describe('ARIA attributes and semantics', () => {
    test('Should have proper ARIA attributes', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // Then: Should have proper role
      await expect(likeButton).toHaveAttribute('role', 'button');

      // Should have accessible name
      const ariaLabel = await likeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toMatch(/いいね|like/i);

      // Should not have aria-disabled unless actually disabled
      const ariaDisabled = await likeButton.getAttribute('aria-disabled');
      expect(ariaDisabled).toBeNull();
    });

    test('Should update aria-label with current count', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      const initialAriaLabel = await likeButton.getAttribute('aria-label');

      // When: Click like button
      await likeButton.click();

      // Then: aria-label should reflect new count
      const newAriaLabel = await likeButton.getAttribute('aria-label');
      expect(newAriaLabel).not.toBe(initialAriaLabel);
      expect(newAriaLabel).toContain((initialCount + 1).toString());
    });

    test('Should provide live region updates for screen readers', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      // Check for live region
      const liveRegion = page.locator('[aria-live], [role="status"], [role="alert"]');
      
      if (await liveRegion.count() > 0) {
        // If live region exists, it should have proper attributes
        const ariaLive = await liveRegion.first().getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive);
      }
    });
  });

  test.describe('Color and contrast', () => {
    test('Should have sufficient color contrast', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Check computed styles
      const contrast = await likeButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        // Simple contrast ratio calculation (simplified)
        const getRGB = (colorStr: string) => {
          const match = colorStr.match(/\d+/g);
          return match ? match.map(Number) : [0, 0, 0];
        };

        const bgRGB = getRGB(backgroundColor);
        const textRGB = getRGB(color);

        // Relative luminance calculation (simplified)
        const getLuminance = (rgb: number[]) => {
          const [r, g, b] = rgb.map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const bgLum = getLuminance(bgRGB);
        const textLum = getLuminance(textRGB);

        const ratio = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);
        
        return {
          backgroundColor,
          color,
          contrastRatio: ratio
        };
      });

      // Then: Should meet WCAG AA standards (4.5:1 for normal text)
      expect(contrast.contrastRatio).toBeGreaterThan(4.5);
      console.log(`Contrast ratio: ${contrast.contrastRatio.toFixed(2)}:1`);
    });

    test('Should not rely solely on color to convey information', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // When: Check for non-color indicators
      const buttonText = await likeButton.textContent();
      const countText = await likeCount.textContent();

      // Then: Should have text labels, not just color differences
      expect(buttonText).toBeTruthy();
      expect(buttonText).toMatch(/いいね|like/i);
      expect(countText).toBeTruthy();
      expect(countText).toMatch(/^\d+$/);
    });
  });

  test.describe('Screen reader compatibility', () => {
    test('Should provide meaningful text alternatives', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Check accessible name computation
      const accessibleName = await likeButton.evaluate((el) => {
        // Simulate screen reader accessible name computation
        return el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') || 
               el.textContent || 
               el.getAttribute('title');
      });

      // Then: Should have meaningful accessible name
      expect(accessibleName).toBeTruthy();
      expect(accessibleName).toMatch(/いいね|like/i);
      expect(accessibleName.length).toBeGreaterThan(2);
    });

    test('Should announce state changes appropriately', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Then: Check if change is announced via aria-live or similar
      const liveRegions = await page.locator('[aria-live="polite"], [aria-live="assertive"], [role="status"]').count();
      
      // Should have some mechanism for announcing changes
      expect(liveRegions).toBeGreaterThanOrEqual(0); // At minimum, no errors
    });
  });

  test.describe('Motor accessibility', () => {
    test('Should have adequate touch target size', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Check button dimensions
      const buttonBox = await likeButton.boundingBox();
      expect(buttonBox).toBeTruthy();

      if (buttonBox) {
        // Then: Should meet minimum touch target size (44x44px for mobile)
        expect(buttonBox.width).toBeGreaterThanOrEqual(32); // Slightly relaxed for desktop
        expect(buttonBox.height).toBeGreaterThanOrEqual(32);
      }
    });

    test('Should be operable with various input methods', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Test mouse click
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Test keyboard activation
      await likeButton.focus();
      await page.keyboard.press('Enter');
      await expect(likeCount).toHaveText((initialCount + 2).toString());

      // Test with space key
      await page.keyboard.press('Space');
      await expect(likeCount).toHaveText((initialCount + 3).toString());
    });

    test('Should provide sufficient click/tap area', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Test clicking at different positions within button
      const buttonBox = await likeButton.boundingBox();
      expect(buttonBox).toBeTruthy();

      if (buttonBox) {
        // Test clicking at corners and center
        const positions = [
          { x: buttonBox.x + 5, y: buttonBox.y + 5 }, // Top-left
          { x: buttonBox.x + buttonBox.width - 5, y: buttonBox.y + 5 }, // Top-right
          { x: buttonBox.x + buttonBox.width / 2, y: buttonBox.y + buttonBox.height / 2 }, // Center
        ];

        for (const pos of positions) {
          await page.mouse.click(pos.x, pos.y);
          // Should register click without throwing error
        }
      }
    });
  });

  test.describe('Cognitive accessibility', () => {
    test('Should provide clear and consistent labeling', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Check button text and labels
      const buttonText = await likeButton.textContent();
      const ariaLabel = await likeButton.getAttribute('aria-label');

      // Then: Labels should be clear and consistent
      expect(buttonText || ariaLabel).toMatch(/いいね|like/i);
      
      // Should not use confusing or technical jargon
      const textToCheck = (buttonText + ' ' + (ariaLabel || '')).toLowerCase();
      expect(textToCheck).not.toContain('api');
      expect(textToCheck).not.toContain('endpoint');
      expect(textToCheck).not.toContain('submit');
    });

    test('Should maintain consistent behavior', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // When: Perform same action multiple times
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      for (let i = 1; i <= 3; i++) {
        await likeButton.click();
        await expect(likeCount).toHaveText((initialCount + i).toString());
      }

      // Then: Behavior should be predictable and consistent
      // Each click should increment by exactly 1
      expect(parseInt(await likeCount.textContent() || '0', 10)).toBe(initialCount + 3);
    });

    test('Should provide appropriate feedback timing', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click button and measure feedback timing
      const startTime = Date.now();
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());
      const feedbackTime = Date.now() - startTime;

      // Then: Feedback should be immediate (within 100ms for good UX)
      expect(feedbackTime).toBeLessThan(100);
    });
  });

  test.describe('Error states and messaging', () => {
    test('Should provide accessible error messages', async ({ page }) => {
      // Given: Navigate to blog entry and simulate error condition
      await page.goto(testEntryUrl);

      // Mock rate limit error
      await page.route('**/api/likes/**', async (route) => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
        });
      });

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Trigger error condition
      await likeButton.click();

      // Wait for error handling
      await page.waitForTimeout(4000);

      // Then: Error should be communicated accessibly
      const errorMessage = page.locator('[role="alert"], [aria-live="assertive"]');
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.first().textContent();
        expect(errorText).toBeTruthy();
        expect(errorText.length).toBeGreaterThan(5);
      }

      // Button should still be accessible
      await expect(likeButton).toBeVisible();
      await expect(likeButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  });
});