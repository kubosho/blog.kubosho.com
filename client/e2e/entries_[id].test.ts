import { expect, test } from '@playwright/test';

import { pathList } from '../../constants/path_list';
import { LOCAL_SITE_URL, OG_IMAGE_PATH } from '../../constants/site_data';

test.describe('Entry page', () => {
  test('Should be can to access the entry page', async ({ page }) => {
    // Given
    const slug = 'eslint-plugin-import-error-on-vitest-configuration-file' as const;

    // When
    const response = await page.goto(`${LOCAL_SITE_URL}${pathList.entries}/${slug}`);

    // Then
    expect(response?.status()).toBe(200);
  });

  test.describe('Entry page meta tags', () => {
    test.describe('og:image', () => {
      test('Should be can to access the og:image in entry page', async ({ page }) => {
        // Given
        const slug = 'eslint-plugin-import-error-on-vitest-configuration-file' as const;

        // When
        await page.goto(`${LOCAL_SITE_URL}${pathList.entries}/${slug}`);

        // Then
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          'content',
          `${OG_IMAGE_PATH}/${slug}.png`,
        );
      });

      test('Should be can to access the fallback og:image in home page', async ({ page }) => {
        // When
        await page.goto(`${LOCAL_SITE_URL}${pathList.root}`);

        // Then
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          'content',
          `${OG_IMAGE_PATH}/fallback_og_image.png`,
        );
      });
    });
  });

  test.describe('og:type', () => {
    test('Should be the og:type content is "article" in entry page', async ({ page }) => {
      // Given
      const slug = 'eslint-plugin-import-error-on-vitest-configuration-file' as const;

      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.entries}/${slug}`);

      // Then
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    });

    test('Should be the og:type content is "website" in home page', async ({ page }) => {
      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.root}`);

      // Then
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    });
  });
});
