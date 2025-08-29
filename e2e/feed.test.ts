import { expect, test } from '@playwright/test';

import { LOCAL_SITE_URL } from '../constants/site_data';

test.describe('Feed', () => {
  test('Should be can access to feed', async ({ page }) => {
    // When
    const response = await page.request.get(`${LOCAL_SITE_URL}/feed`);

    // Then
    expect(response.status()).toBe(200);
  });

  test('Should return valid XML feed', async ({ page }) => {
    // When
    const response = await page.request.get(`${LOCAL_SITE_URL}/feed`);

    // Then
    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<feed');
    expect(body).toContain('</feed>');
  });
});
