import { test, expect, Page } from '@playwright/test';

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

const MOCK_PRICES = [
  { currency: 'ETH', price: 2000, date: new Date("2023-08-29T07:10:40.000Z"), iconUrl: `${ICON_BASE_URL}ETH.svg` },
  { currency: 'BTC', price: 40000, date: new Date("2023-08-29T07:10:40.000Z"), iconUrl: `${ICON_BASE_URL}BTC.svg` },
  { currency: 'USD', price: 1, date: new Date("2023-08-29T07:10:40.000Z"), iconUrl: `${ICON_BASE_URL}USD.svg` },
];

async function mockApi(page: Page) {
  await page.route('**/prices.json', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: MOCK_PRICES,
    });
  });
}

test.describe('SwapForm E2E Test', () => {

  test('should perform a successful swap', async ({ page }) => {
    await mockApi(page);

    await page.goto('/');

    // check render page and screenshot
    await expect(page.getByText('ETH')).toBeVisible();
    await expect(page.getByText('BTC')).toBeVisible();

    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot();

    // input value, expect value change and screenshot
    const fromInput = page.getByRole('textbox').first();
    const toInput = page.getByRole('textbox').last();

    await fromInput.fill('2');

    await expect(toInput).toHaveValue('0.100000');
    await expect(page).toHaveScreenshot();

    // submit to confirm swap
    const submitButton = page.getByRole('button', { name: /confirm swap/i });
    await submitButton.click();

    // expect wait 2s swapping and screenshot
    await expect(page.getByRole('button', { name: /swapping/i })).toBeDisabled();
    await expect(page).toHaveScreenshot();

    // expect Successfully swapped after 2s simulation
    await expect(
      page.getByText(/Successfully swapped 2 ETH for 0.100000 BTC/i)
    ).toBeVisible();
    await expect(page).toHaveScreenshot();

  });

  test('should open modal select token', async ({ page }) => {
    await mockApi(page);

    await page.goto('/');

    const tokenBtn = page.getByText('ETH')
    await expect(tokenBtn).toBeVisible();

    await tokenBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Select token to send')).toBeVisible();
    await expect(page).toHaveScreenshot();

  });

  test('should filter token when search keyword', async ({ page }) => {
    await mockApi(page);

    await page.goto('/');

    const tokenBtn = page.getByText('ETH')

    await tokenBtn.click();
    await page.waitForTimeout(500);
    const modalBackdrop = page.getByTestId('modal-backdrop');
    const input = page.getByTestId('search-input');

    await expect(modalBackdrop).toBeVisible();
    await expect(input).toBeVisible();
    await expect(modalBackdrop.getByText('ETH')).toBeVisible();
    await expect(modalBackdrop.getByText('BTC')).toBeVisible();
    await expect(modalBackdrop.getByText('USD')).toBeVisible();

    await input.fill('us');
    await expect(modalBackdrop.getByText('ETH')).not.toBeVisible();
    await expect(modalBackdrop.getByText('BTC')).not.toBeVisible();
    await expect(modalBackdrop.getByText('USD')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });
});
