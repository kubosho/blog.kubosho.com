import { expect, test } from '@playwright/test';

import { LOCAL_SITE_URL } from '../constants/site_data';

test.describe('Feed', () => {
  test('Should be can access to feed', async ({ page }) => {
    // When
    const response = await page.goto(`${LOCAL_SITE_URL}/feed.xml`);

    // Then
    expect(response?.status()).toBe(200);
  });

  test('Should be the Content-Type is application/xml', async ({ page }) => {
    // When
    const response = await page.goto(`${LOCAL_SITE_URL}/feed.xml`);

    // Then
    expect(await response?.headerValue('content-type')).toBe('application/xml');
  });
});
