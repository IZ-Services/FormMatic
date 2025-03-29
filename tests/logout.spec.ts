import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@live.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('http://localhost:3000/home');
  await page.getByRole('img', { name: 'User Icon' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});


//to run this test use command "npx playwright test tests/logout.spec.ts"
// and to see teh report of teh test run command " npx playwright show-report" and follow the link which will appear on console