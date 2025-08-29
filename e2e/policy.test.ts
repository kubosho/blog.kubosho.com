import { expect, test } from '@playwright/test';

import { pathList } from '../constants/path_list';
import { LOCAL_SITE_HOSTNAME, LOCAL_SITE_URL } from '../constants/site_data';

function toSeconds(milliSeconds: number): number {
  return Math.trunc(milliSeconds / 1000);
}

test.describe('Policy page', () => {
  test.describe('In opt-in state', () => {
    test('The switch can be turned on', async ({ page }) => {
      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.policy}`);
      await page.getByRole('switch').click();

      // Then
      await expect(page.getByRole('switch')).toBeChecked();
    });

    test('Should be opt-out state saved in cookie when the switch is clicked', async ({ context, page }) => {
      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.policy}`);
      const responsePromise = page.waitForResponse(`${LOCAL_SITE_URL}/policy/optout`);
      await Promise.all([page.getByRole('switch').click(), responsePromise]);
      await page.reload();

      // Then
      const cookies = await context.cookies();
      expect(cookies).toMatchObject([
        {
          domain: LOCAL_SITE_HOSTNAME,
          httpOnly: true,
          name: 'analytics_optout_enabled',
          path: '/',
          sameSite: 'Strict',
          secure: true,
          value: 'true',
        },
      ]);
    });
  });

  test.describe('In opt-out state', () => {
    const date = new Date();
    const cookie = {
      domain: LOCAL_SITE_HOSTNAME,
      expires: toSeconds(date.setDate(date.getDate() + 365)),
      httpOnly: true,
      name: 'analytics_optout_enabled',
      path: '/',
      sameSite: 'Strict',
      secure: true,
      value: 'true',
    } as const;

    test('The switch can be turned off', async ({ context, page }) => {
      // Given
      await context.addCookies([cookie]);

      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.policy}`);
      await page.getByRole('switch').click();

      // Then
      await expect(page.getByRole('switch')).not.toBeChecked();
    });

    test('Should be opt-out state not saved in cookie when the switch is clicked', async ({ context, page }) => {
      // Given
      await context.addCookies([cookie]);

      // When
      await page.goto(`${LOCAL_SITE_URL}${pathList.policy}`);
      const responsePromise = page.waitForResponse(`${LOCAL_SITE_URL}/policy/optout`);
      await Promise.all([page.getByRole('switch').click(), responsePromise]);
      await page.reload();

      // Then
      const cookies = await context.cookies();
      expect(cookies).toEqual([]);
    });
  });
});
