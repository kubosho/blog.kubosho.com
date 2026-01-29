import { expect, type Page, test } from '@playwright/test';

// Inject window.dataLayer before any page script runs so that
// pushEvent() calls always land in the array, regardless of the
// /api/optout response in the dev environment.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.dataLayer = [];
  });
});

function getDataLayer(page: Page): Promise<Array<Record<string, unknown>>> {
  return page.evaluate(() => (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []);
}

function filterEvents(dataLayer: Array<Record<string, unknown>>, eventName: string): Array<Record<string, unknown>> {
  return dataLayer.filter((entry) => entry.event == eventName);
}

const ARTICLE_PATH = '/entries/blog-renewal-2025';

test.describe('GA event tracking', () => {
  test('scroll_depth does not fire on initial page load', async ({ page }) => {
    // Given
    await page.goto(ARTICLE_PATH);

    // When
    await page.waitForTimeout(500);

    // Then
    const dataLayer = await getDataLayer(page);
    const scrollEvents = filterEvents(dataLayer, 'scroll_depth');
    expect(scrollEvents).toHaveLength(0);
  });

  test('like_click pushes event to dataLayer', async ({ page }) => {
    // Given
    await page.goto(ARTICLE_PATH);
    const likeButton = page.locator('button[aria-label]').filter({ hasText: '👏' });
    await likeButton.scrollIntoViewIfNeeded();
    // Wait for Astro island hydration (client:visible)
    const likeIsland = page.locator('astro-island[component-export="LikeButton"]');
    await expect(likeIsland).not.toHaveAttribute('ssr', '', { timeout: 10_000 });

    // When
    await likeButton.click();

    // Then
    const dataLayer = await getDataLayer(page);
    const likeEvents = filterEvents(dataLayer, 'like_click');
    expect(likeEvents.length).toBeGreaterThanOrEqual(1);

    const likeEvent = likeEvents[0]!;
    expect(likeEvent).toMatchObject({
      event: 'like_click',
      entry_id: 'blog-renewal-2025',
    });
    expect(likeEvent.entry_title).toBeTruthy();
  });

  test('share_click pushes event to dataLayer', async ({ page }) => {
    // Given
    await page.goto(ARTICLE_PATH);
    const xShareLink = page.locator('a[data-share-platform="x"]');
    await xShareLink.waitFor({ state: 'visible' });
    await xShareLink.evaluate((el) => {
      el.addEventListener('click', (e) => e.preventDefault(), { once: true });
    });

    // When
    await xShareLink.click();

    // Then
    const dataLayer = await getDataLayer(page);
    const shareEvents = filterEvents(dataLayer, 'share_click');
    expect(shareEvents.length).toBeGreaterThanOrEqual(1);

    const shareEvent = shareEvents[0]!;
    expect(shareEvent).toMatchObject({
      event: 'share_click',
      share_platform: 'x',
      entry_id: 'blog-renewal-2025',
    });
    expect(shareEvent.entry_title).toBeTruthy();
  });

  test('scroll_depth pushes events for each threshold', async ({ page }) => {
    // Given
    await page.goto(ARTICLE_PATH);
    await page.evaluate(() => window.scrollBy(0, 1));
    await page.waitForTimeout(200);

    // When
    for (const pct of [30, 55, 80, 100]) {
      await page.evaluate((p) => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, (scrollHeight * p) / 100);
      }, pct);
      await page.waitForTimeout(300);
    }

    // Then
    const dataLayer = await getDataLayer(page);
    const scrollEvents = filterEvents(dataLayer, 'scroll_depth');
    const percentages = scrollEvents.map((e) => e.scroll_percentage);

    expect(percentages).toContain(25);
    expect(percentages).toContain(50);
    expect(percentages).toContain(75);
    expect(percentages).toContain(90);
  });

  test('rss_click pushes event to dataLayer', async ({ page }) => {
    // Given
    await page.goto(ARTICLE_PATH);
    const rssLink = page.locator('#rss-link');
    await rssLink.waitFor({ state: 'visible' });
    await rssLink.evaluate((el) => {
      el.addEventListener('click', (e) => e.preventDefault(), { once: true });
    });

    // When
    await rssLink.click();

    // Then
    const dataLayer = await getDataLayer(page);
    const rssEvents = filterEvents(dataLayer, 'rss_click');
    expect(rssEvents.length).toBeGreaterThanOrEqual(1);
    expect(rssEvents[0]).toMatchObject({ event: 'rss_click' });
  });
});
