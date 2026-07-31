import { expect, test } from '@playwright/test';

test('dashboard opens the product workspace from its content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop content-entry assertion');

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'India Trade Monitor' })).toBeVisible();

  await page.getByRole('link', { name: 'Open full product workspace' }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(
    page.getByRole('heading', {
      name: 'What India buys, what India sells, and how much value is added',
    }),
  ).toBeVisible();

  await page.getByTestId('product-detail-sentinel').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Inspect every classification' })).toBeVisible({
    timeout: 15_000,
  });
});

test('dashboard does not overflow the mobile viewport', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile layout assertion');

  await page.goto('/');
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  await expect(page.getByRole('heading', { level: 1, name: 'India Trade Monitor' })).toBeVisible();
});
