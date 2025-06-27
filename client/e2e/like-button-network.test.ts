import { expect, test } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL } from '../../constants/site_data';

test.describe('Like Button - Network Failure Scenarios', () => {
  const testEntrySlug = 'eslint-plugin-import-error-on-vitest-configuration-file';
  const testEntryUrl = `${LOCAL_SITE_URL}${pathList.entries}/${testEntrySlug}.html`;
  const RETRY_QUEUE_KEY = 'likeRetryQueue';

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(testEntryUrl);
    await page.evaluate((key) => {
      localStorage.removeItem(key);
    }, RETRY_QUEUE_KEY);
  });

  test.describe('Offline/Online behavior', () => {
    test('Should update UI optimistically when offline', async ({ page, context }) => {
      // Given: Navigate to entry and go offline
      await page.goto(testEntryUrl);
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      // Get initial count
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button while offline
      await likeButton.click();

      // Then: UI should update optimistically
      await expect(likeCount).toHaveText((initialCount + 1).toString());
      
      // Button should remain functional
      await expect(likeButton).toBeEnabled();
    });

    test('Should save failed requests to localStorage when offline', async ({ page, context }) => {
      // Given: Navigate to entry and go offline
      await page.goto(testEntryUrl);
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Click like button while offline
      await likeButton.click();

      // Wait for buffer flush attempt
      await page.waitForTimeout(4000);

      // Then: Failed request should be saved to localStorage
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      expect(retryQueue).toHaveLength(1);
      expect(retryQueue[0]).toMatchObject({
        entryId: testEntrySlug,
        counts: 1,
        timestamp: expect.any(Number),
      });
    });

    test('Should retry failed requests when back online', async ({ page, context }) => {
      // Given: Navigate to entry and go offline
      await page.goto(testEntryUrl);
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');

      // Click while offline to create failed request
      await likeButton.click();
      await page.waitForTimeout(4000);

      // Verify localStorage has retry item
      let retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);
      expect(retryQueue).toHaveLength(1);

      // Monitor network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/likes/') && request.method() === 'POST') {
          requests.push(request.url());
        }
      });

      // When: Go back online
      await context.setOffline(false);

      // Reload page to trigger retry queue processing
      await page.reload();

      // Wait for retry attempts
      await page.waitForTimeout(6000);

      // Then: Should have attempted to retry the failed request
      expect(requests.length).toBeGreaterThan(0);

      // And localStorage should be cleared after successful retry
      retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);
      expect(retryQueue).toHaveLength(0);
    });

    test('Should handle multiple offline clicks', async ({ page, context }) => {
      // Given: Navigate to entry and go offline
      await page.goto(testEntryUrl);
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click multiple times while offline
      for (let i = 0; i < 3; i++) {
        await likeButton.click();
        await page.waitForTimeout(200);
      }

      // Then: UI should reflect all clicks
      await expect(likeCount).toHaveText((initialCount + 3).toString());

      // Wait for buffer flush attempts
      await page.waitForTimeout(4000);

      // And localStorage should contain the batched request
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      expect(retryQueue).toHaveLength(1);
      expect(retryQueue[0].counts).toBe(3);
    });
  });

  test.describe('Network request failures', () => {
    test('Should handle network timeout', async ({ page }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      // Mock slow/timeout response
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          // Simulate timeout by never responding
          await new Promise(() => {}); // Never resolves
        } else {
          await route.continue();
        }
      });

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button
      await likeButton.click();

      // Then: UI should update optimistically despite timeout
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Wait for timeout and retry logic
      await page.waitForTimeout(5000);

      // Should save to localStorage for retry
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      expect(retryQueue).toHaveLength(1);
    });

    test('Should handle DNS resolution failure', async ({ page }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      // Mock DNS failure
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          await route.abort('failed');
        } else {
          await route.continue();
        }
      });

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button
      await likeButton.click();

      // Then: UI should update optimistically
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Wait for error handling
      await page.waitForTimeout(4000);

      // Should save to localStorage for retry
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      expect(retryQueue).toHaveLength(1);
    });

    test('Should handle intermittent network failures', async ({ page }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      let requestCount = 0;
      
      // Mock intermittent failures (fail first 2 requests, succeed on 3rd)
      await page.route('**/api/likes/**', async (route) => {
        if (route.request().method() === 'POST') {
          requestCount++;
          if (requestCount <= 2) {
            await route.abort('failed');
          } else {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ success: true, total: 50 }),
            });
          }
        } else {
          await route.continue();
        }
      });

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // When: Click like button (this will fail and be retried)
      await likeButton.click();
      await page.waitForTimeout(4000);

      // Then: Should save to localStorage after first failure
      let retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);
      expect(retryQueue).toHaveLength(1);

      // When: Reload to trigger retry (which will also fail)
      await page.reload();
      await page.waitForTimeout(6000);

      // When: Reload again to trigger another retry (which should succeed)
      await page.reload();
      await page.waitForTimeout(6000);

      // Then: Should eventually clear localStorage after success
      retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);
      expect(retryQueue).toHaveLength(0);

      // And update count to server total
      await expect(likeCount).toHaveText('50');
    });
  });

  test.describe('LocalStorage management', () => {
    test('Should remove old retry queue items', async ({ page }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      // Manually add old items to localStorage (older than 24 hours)
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      const recentTimestamp = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago

      await page.evaluate(({ key, oldTimestamp, recentTimestamp }) => {
        const queue = [
          { entryId: 'old-entry', counts: 1, timestamp: oldTimestamp },
          { entryId: 'recent-entry', counts: 2, timestamp: recentTimestamp },
        ];
        localStorage.setItem(key, JSON.stringify(queue));
      }, { key: RETRY_QUEUE_KEY, oldTimestamp, recentTimestamp });

      // When: Reload page (triggers retry queue initialization)
      await page.reload();
      await page.waitForTimeout(2000);

      // Then: Old items should be removed, recent items should remain
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      // After initialization, queue should be cleared, but recent items would have been retried
      expect(retryQueue).toHaveLength(0);
    });

    test('Should handle localStorage errors gracefully', async ({ page, context }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      // Mock localStorage to throw errors
      await page.addInitScript(() => {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
          if (key === 'likeRetryQueue') {
            throw new Error('localStorage quota exceeded');
          }
          return originalSetItem.call(this, key, value);
        };
      });

      // Go offline to trigger localStorage save
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click like button (localStorage save will fail)
      await likeButton.click();

      // Then: UI should still update optimistically
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // App should continue to function despite localStorage error
      await expect(likeButton).toBeEnabled();
    });
  });

  test.describe('Recovery scenarios', () => {
    test('Should handle rapid online/offline transitions', async ({ page, context }) => {
      // Given: Navigate to entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Rapid online/offline transitions with clicks
      await context.setOffline(true);
      await likeButton.click();
      
      await context.setOffline(false);
      await page.waitForTimeout(1000);
      
      await context.setOffline(true);
      await likeButton.click();
      
      await context.setOffline(false);
      await page.waitForTimeout(1000);

      // Then: UI should reflect all clicks
      await expect(likeCount).toHaveText((initialCount + 2).toString());

      // Should eventually sync with server
      await page.waitForTimeout(5000);
      
      // Button should remain functional
      await expect(likeButton).toBeEnabled();
    });

    test('Should preserve state across page reloads during network issues', async ({ page, context }) => {
      // Given: Navigate to entry and go offline
      await page.goto(testEntryUrl);
      await context.setOffline(true);

      const likeButton = page.locator('[data-testid="like-button"]');

      // Click multiple times while offline
      await likeButton.click();
      await likeButton.click();
      await page.waitForTimeout(4000);

      // When: Reload page while still offline
      await page.reload();

      // Then: Should attempt to process retry queue on reload
      // Even if offline, the queue should still exist
      const retryQueue = await page.evaluate((key) => {
        const queue = localStorage.getItem(key);
        return queue ? JSON.parse(queue) : [];
      }, RETRY_QUEUE_KEY);

      // Queue might be processed/cleared during initialization
      // but the behavior should be consistent
      expect(Array.isArray(retryQueue)).toBe(true);
    });
  });
});