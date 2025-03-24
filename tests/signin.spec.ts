import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {    await page.goto('http://localhost:3000/');
  });

  test('successful login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@live.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
    await page.getByRole('button', { name: 'Log In' }).click();  });

  test('wrong email', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
    await page.getByRole('button', { name: 'Log In' }).click();    await expect(page.getByText('Incorrect username or')).toBeVisible();
  });

  test('wrong password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@live.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('user1234');
    await page.getByRole('button', { name: 'Log In' }).click();    await expect(page.getByText('Incorrect username or')).toBeVisible();
  });

  test('empty fields', async ({ page }) => {    await page.getByRole('button', { name: 'Log In' }).click();    await expect(page.getByText('Incorrect username or')).toBeVisible();
  });
});