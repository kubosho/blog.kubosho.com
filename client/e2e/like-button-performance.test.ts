import { expect, test } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL } from '../../constants/site_data';

test.describe('Like Button - Performance Tests', () => {
  const testEntrySlug = 'eslint-plugin-import-error-on-vitest-configuration-file';
  const testEntryUrl = `${LOCAL_SITE_URL}${pathList.entries}/${testEntrySlug}.html`;

  test.describe('Page load performance', () => {
    test('Should load page with like button within performance budgets', async ({ page }) => {
      // Given: Start performance measurement
      const startTime = Date.now();

      // When: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      await expect(likeButton).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Then: Should load within performance budget (3 seconds)
      expect(loadTime).toBeLessThan(3000);
      console.log(`Page load time: ${loadTime}ms`);
    });

    test('Should have good Core Web Vitals', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      // When: Measure Core Web Vitals
      const webVitals = await page.evaluate(() => {
        return new Promise<{
          fcp?: number;
          lcp?: number;
          cls?: number;
        }>((resolve) => {
          const vitals = { fcp: 0, lcp: 0, cls: 0 };
          let metricsCollected = 0;
          const totalMetrics = 3;

          const checkComplete = () => {
            metricsCollected++;
            if (metricsCollected >= totalMetrics) {
              resolve(vitals);
            }
          };

          // First Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.fcp = entries[0].startTime;
            }
            checkComplete();
          }).observe({ entryTypes: ['paint'] });

          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.lcp = entries[entries.length - 1].startTime;
            }
            checkComplete();
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Cumulative Layout Shift
          new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            for (const entry of entries) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            vitals.cls = clsValue;
            checkComplete();
          }).observe({ entryTypes: ['layout-shift'] });

          // Fallback timeout
          setTimeout(() => {
            resolve(vitals);
          }, 5000);
        });
      });

      // Then: Should meet Core Web Vitals thresholds
      if (webVitals.fcp) {
        expect(webVitals.fcp).toBeLessThan(1800); // FCP < 1.8s (good)
      }
      if (webVitals.lcp) {
        expect(webVitals.lcp).toBeLessThan(2500); // LCP < 2.5s (good)
      }
      if (webVitals.cls !== undefined) {
        expect(webVitals.cls).toBeLessThan(0.1); // CLS < 0.1 (good)
      }

      console.log('Core Web Vitals:', webVitals);
    });
  });

  test.describe('Like button interaction performance', () => {
    test('Should respond to clicks within 100ms', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Measure click response time
      const startTime = performance.now();
      await likeButton.click();
      await expect(likeCount).toHaveText((initialCount + 1).toString());
      const responseTime = performance.now() - startTime;

      // Then: Should respond within 100ms for good UX
      expect(responseTime).toBeLessThan(100);
      console.log(`Click response time: ${responseTime.toFixed(2)}ms`);
    });

    test('Should handle rapid interactions without performance degradation', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);
      const clickCount = 10;
      const responseTimes: number[] = [];

      // When: Perform rapid clicks and measure each
      for (let i = 0; i < clickCount; i++) {
        const startTime = performance.now();
        await likeButton.click();
        await expect(likeCount).toHaveText((initialCount + i + 1).toString());
        const responseTime = performance.now() - startTime;
        responseTimes.push(responseTime);
        
        await page.waitForTimeout(50); // Small delay between clicks
      }

      // Then: Performance should not degrade significantly
      const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);

      expect(averageTime).toBeLessThan(150);
      expect(maxTime).toBeLessThan(300);
      expect(maxTime - minTime).toBeLessThan(200); // Variance should be reasonable

      console.log(`Response times - Avg: ${averageTime.toFixed(2)}ms, Min: ${minTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`);
    });

    test('Should not cause memory leaks during extended use', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Perform many interactions to test memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      // Perform 50 clicks
      for (let i = 0; i < 50; i++) {
        await likeButton.click();
        await page.waitForTimeout(20);
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });

      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      // Then: Memory usage should not increase excessively
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;

        expect(memoryIncreasePercent).toBeLessThan(50); // Less than 50% increase
        console.log(`Memory usage - Initial: ${Math.round(initialMemory / 1024)}KB, Final: ${Math.round(finalMemory / 1024)}KB, Increase: ${memoryIncreasePercent.toFixed(1)}%`);
      }
    });
  });

  test.describe('Network performance', () => {
    test('Should batch API requests efficiently', async ({ page }) => {
      // Given: Navigate to blog entry and monitor network
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/likes/') && request.method() === 'POST') {
          requests.push(request.url());
        }
      });

      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');

      // When: Perform multiple clicks within batching window
      for (let i = 0; i < 5; i++) {
        await likeButton.click();
        await page.waitForTimeout(100);
      }

      // Wait for batch to be sent
      await page.waitForTimeout(4000);

      // Then: Should have sent only one batched request
      expect(requests).toHaveLength(1);
      console.log(`Batched ${5} clicks into ${requests.length} request(s)`);
    });

    test('Should handle slow network conditions gracefully', async ({ page }) => {
      // Given: Simulate slow network
      await page.route('**/api/likes/**', async (route) => {
        // Simulate slow network (500ms delay)
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.continue();
      });

      await page.goto(testEntryUrl);

      const likeButton = page.locator('[data-testid="like-button"]');
      const likeCount = page.locator('[data-testid="like-count"]');

      const initialCount = parseInt(await likeCount.textContent() || '0', 10);

      // When: Click button on slow network
      const startTime = Date.now();
      await likeButton.click();

      // Then: Should still update UI optimistically (quickly)
      await expect(likeCount).toHaveText((initialCount + 1).toString());
      const uiUpdateTime = Date.now() - startTime;

      expect(uiUpdateTime).toBeLessThan(200); // UI should update quickly despite slow network
      console.log(`UI update time on slow network: ${uiUpdateTime}ms`);
    });
  });

  test.describe('Bundle size and loading performance', () => {
    test('Should not significantly impact page bundle size', async ({ page }) => {
      // Given: Navigate to blog entry
      await page.goto(testEntryUrl);

      // When: Analyze loaded resources
      const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = entries.filter(entry => 
          entry.name.includes('.js') && 
          !entry.name.includes('node_modules') &&
          !entry.name.includes('playwright')
        );

        return jsResources.map(entry => ({
          name: entry.name,
          size: entry.transferSize || 0,
          duration: entry.duration
        }));
      });

      // Then: JavaScript resources should be reasonably sized
      const totalJSSize = resources.reduce((sum, resource) => sum + resource.size, 0);
      const maxSingleResourceSize = Math.max(...resources.map(r => r.size));

      expect(totalJSSize).toBeLessThan(500 * 1024); // Less than 500KB total JS
      expect(maxSingleResourceSize).toBeLessThan(200 * 1024); // No single file over 200KB

      console.log(`Total JS size: ${Math.round(totalJSSize / 1024)}KB`);
      console.log(`Largest JS file: ${Math.round(maxSingleResourceSize / 1024)}KB`);
    });
  });
});