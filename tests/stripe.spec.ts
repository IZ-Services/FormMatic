// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.getByRole('textbox', { name: 'Email' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).fill('sanehajoel@gmail.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('User1234');
//   await page.getByRole('button', { name: 'Log In' }).click();
//   await page.goto('http://localhost:3000/signUp');
//   await page.locator('iframe[name="__privateStripeFrame5305"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
//   await page.locator('iframe[name="__privateStripeFrame5305"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');
//   await page.locator('iframe[name="__privateStripeFrame5305"]').contentFrame().getByRole('textbox', { name: 'Expiration date MM / YY' }).fill('04 / 26');
//   await page.locator('iframe[name="__privateStripeFrame5305"]').contentFrame().getByRole('textbox', { name: 'Security code' }).fill('444');
//   await page.getByRole('button', { name: 'Subscribe' }).click();
// });


//the stripe test cant be made as the iframe name changes dynamically so its nearly impossible can be manually tested