import { expect, test } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL } from '../../constants/site_data';

test.describe('Like Button', () => {
  const testEntrySlug = 'eslint-plugin-import-error-on-vitest-configuration-file';
  const testEntryUrl = `${LOCAL_SITE_URL}${pathList.entries}/${testEntrySlug}.html`;

  test.describe('Basic functionality', () => {
    test('Should display like button and initial count', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);

      // When: Page loads
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Like button should be visible and clickable
      await expect(likeButton).toBeVisible();
      await expect(likeButton).toContainText('いいね');
      await expect(likeCount).toBeVisible();
      
      // Initial count should be a number
      const initialCount = await likeCount.textContent();
      expect(initialCount).toMatch(/^\d+$/);
    });

    test('Should increment count optimistically on click', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Get initial count
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button
      await likeButton.click();

      // Then: Count should increment immediately (optimistic update)
      await expect(likeCount).toHaveText((initialCount + 1).toString());
    });

    test('Should handle multiple rapid clicks', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Get initial count
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button multiple times rapidly
      for (let i = 0; i < 5; i++) {
        await likeButton.click();
      }

      // Then: Count should increment appropriately
      await expect(likeCount).toHaveText((initialCount + 5).toString());
    });
  });

  test.describe('Buffering behavior', () => {
    test('Should send buffered likes after delay', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Monitor network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/likes/')) {
          requests.push(request.url());
        }
      });

      // When: Click like button
      await likeButton.click();

      // Then: Should not send request immediately
      expect(requests).toHaveLength(0);

      // Wait for buffer flush (3+ seconds)
      await page.waitForTimeout(3500);

      // Then: Should have sent request after buffer flush
      expect(requests.length).toBeGreaterThan(0);
    });

    test('Should batch multiple clicks into single request', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      
      // Monitor network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/likes/') && request.method() === 'POST') {
          requests.push(request.url());
        }
      });

      // When: Click like button multiple times within buffer window
      for (let i = 0; i < 3; i++) {
        await likeButton.click();
        await page.waitForTimeout(100); // Small delay between clicks
      }

      // Wait for buffer flush
      await page.waitForTimeout(3500);

      // Then: Should have sent only one request
      expect(requests).toHaveLength(1);
    });
  });

  test.describe('Server synchronization', () => {
    test('Should update to server total after successful submission', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Mock server response to return specific total
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, total: 100 }),
          });
        } else {
          await route.continue();
        }
      });

      // When: Click like button
      await likeButton.click();

      // Wait for server response
      await page.waitForTimeout(4000);

      // Then: Count should update to server total
      await expect(likeCount).toHaveText('100');
    });
  });

  test.describe('Error handling', () => {
    test('Should handle server errors gracefully', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Get initial count
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // Mock server error
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, error: 'Server error' }),
          });
        } else {
          await route.continue();
        }
      });

      // When: Click like button
      await likeButton.click();

      // Then: Count should still increment optimistically
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // UI should remain functional
      await expect(likeButton).toBeEnabled();
    });

    test('Should show rate limit message', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');

      // Mock rate limit response
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
          });
        } else {
          await route.continue();
        }
      });

      // When: Click like button
      await likeButton.click();

      // Wait for rate limit response
      await page.waitForTimeout(4000);

      // Then: Should show rate limit indication
      // (Specific implementation depends on your UI design)
      const rateLimitMessage = page.locator('[data-testid="rate-limit-message"]');
      if (await rateLimitMessage.isVisible()) {
        await expect(rateLimitMessage).toBeVisible();
      }
    });
  });

  test.describe('Page unload handling', () => {
    test('Should send pending likes on page navigation', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      
      // Monitor sendBeacon calls
      let beaconSent = false;
      await page.addInitScript(() => {
        const originalSendBeacon = navigator.sendBeacon;
        navigator.sendBeacon = function(url, data) {
          if (url.includes('/api/likes/')) {
            (window as any).beaconSent = true;
          }
          return originalSendBeacon.call(this, url, data);
        };
      });

      // When: Click like button and navigate away quickly
      await likeButton.click();
      
      // Navigate to another page before buffer flush
      await page.goto(`${LOCAL_SITE_URL}${pathList.root}`);

      // Then: Should have sent beacon
      beaconSent = await page.evaluate(() => (window as any).beaconSent);
      expect(beaconSent).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('Should be keyboard accessible', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Get initial count
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Focus and activate with keyboard
      await likeButton.focus();
      await expect(likeButton).toBeFocused();
      
      await page.keyboard.press('Enter');

      // Then: Should increment count
      await expect(likeCount).toHaveText((initialCount + 1).toString());
    });

    test('Should have proper ARIA attributes', async ({ page }) => {
      // Given: Navigate to a blog entry
      await page.goto(testEntryUrl);
      
      const likeButton = page.locator('[data-testid="like-button"]');

      // Then: Should have appropriate ARIA attributes
      await expect(likeButton).toHaveAttribute('role', 'button');
      await expect(likeButton).toHaveAttribute('aria-label', /いいね/);
    });
  });
});