import { expect, test } from '@playwright/test';

import { LOCAL_SITE_URL } from '../constants/siteData';

test.describe('Sitemap', () => {
  test('Should be can access to sitemap file', async ({ page }) => {
    // When
    const response = await page.goto(`${LOCAL_SITE_URL}/sitemap-index.xml`);

    // Then
    expect(response?.status()).toBe(200);
  });
});
