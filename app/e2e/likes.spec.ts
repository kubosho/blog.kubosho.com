import { expect, test } from '@playwright/test';

const ARTICLE_PATH = '/entries/blog-renewal-2025';

test.describe('like button', () => {
  test('clicking the button increments the visible count and posts the like', async ({ page }) => {
    // Arrange
    await page.goto(ARTICLE_PATH);
    const likeButton = page.locator('like-button button[aria-label]').filter({ hasText: '👏' });
    await likeButton.waitFor({ state: 'visible', timeout: 15_000 });
    await likeButton.scrollIntoViewIfNeeded();

    const count = page.locator('like-button .count');
    const before = Number(await count.textContent());

    const likeResponse = page.waitForResponse(
      (response) => response.url().endsWith('/api/likes/blog-renewal-2025') && response.request().method() === 'POST',
    );

    // Act
    await likeButton.click();

    // Assert
    await expect(count).toHaveText(String(before + 1));
    const response = await likeResponse;
    expect(response.ok()).toBe(true);
  });
});
