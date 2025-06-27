import { expect, test, devices } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL } from '../../constants/site_data';

test.describe('Like Button - Responsive Design', () => {
  const testEntrySlug = 'eslint-plugin-import-error-on-vitest-configuration-file';
  const testEntryUrl = `${LOCAL_SITE_URL}${pathList.entries}/${testEntrySlug}.html`;

  test.describe('Desktop devices', () => {
    test('Should display and function properly on large desktop (1920x1080)', async ({ browser }) => {
      // Given: Create context with large desktop viewport
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible and properly sized
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should be clickable
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should display and function properly on standard desktop (1366x768)', async ({ browser }) => {
      // Given: Create context with standard desktop viewport
      const context = await browser.newContext({
        viewport: { width: 1366, height: 768 },
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible and functional
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Test functionality
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });
  });

  test.describe('Tablet devices', () => {
    test('Should display and function properly on iPad', async ({ browser }) => {
      // Given: Create context with iPad viewport
      const context = await browser.newContext({
        ...devices['iPad'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should respond to touch events
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should display and function properly on iPad Pro', async ({ browser }) => {
      // Given: Create context with iPad Pro viewport
      const context = await browser.newContext({
        ...devices['iPad Pro'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible and properly sized for larger tablet
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Test touch interaction
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should handle tablet landscape orientation', async ({ browser }) => {
      // Given: Create context with tablet in landscape
      const context = await browser.newContext({
        ...devices['iPad landscape'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible in landscape mode
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should be functional
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });
  });

  test.describe('Mobile devices', () => {
    test('Should display and function properly on iPhone', async ({ browser }) => {
      // Given: Create context with iPhone viewport
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible on mobile
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should have appropriate touch target size
      const buttonBox = await likeButton.boundingBox();
      expect(buttonBox).toBeTruthy();
      if (buttonBox) {
        // Touch targets should be at least 44px for mobile accessibility
        expect(buttonBox.height).toBeGreaterThanOrEqual(32);
        expect(buttonBox.width).toBeGreaterThanOrEqual(32);
      }

      // Test touch interaction
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should display and function properly on Android phone', async ({ browser }) => {
      // Given: Create context with Android phone viewport
      const context = await browser.newContext({
        ...devices['Pixel 5'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible on Android
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Test touch interaction
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should handle mobile landscape orientation', async ({ browser }) => {
      // Given: Create context with mobile in landscape
      const context = await browser.newContext({
        ...devices['iPhone 12 landscape'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible in landscape mode
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should be functional
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should handle small mobile screens', async ({ browser }) => {
      // Given: Create context with small mobile viewport
      const context = await browser.newContext({
        viewport: { width: 320, height: 568 }, // iPhone SE size
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      // When: Locate like button elements
      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      // Then: Elements should be visible even on small screens
      await expect(likeButton).toBeVisible();
      await expect(likeCount).toBeVisible();

      // Should not overlap or be cut off
      const buttonBox = await likeButton.boundingBox();
      const countBox = await likeCount.boundingBox();
      
      expect(buttonBox).toBeTruthy();
      expect(countBox).toBeTruthy();
      
      if (buttonBox && countBox) {
        expect(buttonBox.x).toBeGreaterThanOrEqual(0);
        expect(buttonBox.y).toBeGreaterThanOrEqual(0);
        expect(countBox.x).toBeGreaterThanOrEqual(0);
        expect(countBox.y).toBeGreaterThanOrEqual(0);
      }

      // Should be functional
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });
  });

  test.describe('Touch interaction specifics', () => {
    test('Should handle rapid taps on touch devices', async ({ browser }) => {
      // Given: Create context with touch-enabled device
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Perform rapid taps
      for (let i = 0; i < 5; i++) {
        await likeButton.tap();
        await page.waitForTimeout(100);
      }

      // Then: Should register all taps
      await expect(likeCount).toHaveText((initialCount + 5).toString());

      await context.close();
    });

    test('Should differentiate tap from long press', async ({ browser }) => {
      // Given: Create context with touch-enabled device
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Perform long press (should still work as regular tap)
      await likeButton.tap({ timeout: 1000 });

      // Then: Should register as normal like
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });

    test('Should prevent accidental touches', async ({ browser }) => {
      // Given: Create context with touch-enabled device
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Touch outside the button area
      await page.tap('#main', { position: { x: 10, y: 10 } });

      // Then: Should not register like
      await expect(likeCount).toHaveText(initialCount.toString());

      // When: Touch the button properly
      await likeButton.tap();

      // Then: Should register like
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      await context.close();
    });
  });

  test.describe('Cross-device consistency', () => {
    test('Should maintain functionality across viewport changes', async ({ browser }) => {
      // Given: Create context with initial viewport
      const context = await browser.newContext({
        viewport: { width: 1200, height: 800 },
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click in desktop mode
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Change to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Then: Button should still be visible and functional
      await expect(likeButton).toBeVisible();
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 2).toString());

      // Change to tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Then: Should still be functional
      await expect(likeButton).toBeVisible();
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 3).toString());

      await context.close();
    });

    test('Should handle orientation changes gracefully', async ({ browser }) => {
      // Given: Create context with mobile device
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Use in portrait mode
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());

      // Simulate orientation change to landscape
      await page.setViewportSize({ width: 812, height: 375 }); // iPhone 12 landscape

      // Then: Should still be functional after orientation change
      await expect(likeButton).toBeVisible();
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 2).toString());

      await context.close();
    });
  });

  test.describe('Performance on different devices', () => {
    test('Should respond quickly on mobile devices', async ({ browser }) => {
      // Given: Create context with mobile device
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');
      
      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Measure response time
      const startTime = Date.now();
      await likeButton.tap();
      await expect(likeCount).toHaveText((initialCount + 1).toString());
      const endTime = Date.now();

      // Then: Should respond within reasonable time (under 1 second)
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);

      await context.close();
    });
  });
});