import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@live.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('img', { name: 'User Icon' }).click();
  await page.getByRole('link', { name: 'Account Settings' }).click();
  await page.getByRole('main').filter({ hasText: 'HomeSearch' }).locator('svg').click();
  await page.getByRole('textbox', { name: 'Current Password' }).click();
  await page.getByRole('textbox', { name: 'Current Password' }).fill('user4321');
  await page.getByRole('textbox', { name: 'New Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'New Password', exact: true }).fill('user4321');
  await page.getByRole('textbox', { name: 'Confirm New Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm New Password' }).fill('user4321');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Password updated successfully!').dblclick();
});