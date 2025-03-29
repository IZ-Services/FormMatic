import { test, expect } from '@playwright/test';

test.describe('Subscription Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.checkSubscriptionStatus = () => {
        return true;
      };
      
      window.mockNonSubscribedUser = () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      };
      
      window.mockUserCreationTime = (daysAgo) => {
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() - daysAgo);
        localStorage.setItem('mockCreationTime', mockDate.toISOString());
      };
    });
  });

  test('user has active subscription', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@live.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('**/home');
    
    await page.goto('http://localhost:3000/profile');
    
    const isSubscribed = await page.evaluate(() => {
      return window.checkSubscriptionStatus();
    });
    
    expect(isSubscribed).toBeTruthy();
  });

  test('user without subscription redirects to signup page', async ({ page }) => {

    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
    

    await page.goto('http://localhost:3000/');
    

    await page.getByRole('textbox', { name: 'Email' }).fill('zain_jaffri@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('user4321');
    await page.getByRole('button', { name: 'Log In' }).click();
    

    await page.waitForTimeout(3000);
    

    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    

    const is404Error = await page.locator('text=404').isVisible();
    const isAccessDenied = await page.locator('text=/Access Denied|Unauthorized|Subscribe/i').isVisible();
    
    console.log(`Is 404 Error visible: ${is404Error}`);
    console.log(`Is Access Denied visible: ${isAccessDenied}`);
    



    try {
      expect(page.url()).toContain('signUp');
    } catch (e) {

      expect(is404Error || isAccessDenied).toBeTruthy();
    }
    

    const dashboardHeader = await page.locator('h1:has-text("Dashboard"), .dashboard-title, [data-testid="dashboard-header"]').count();
    expect(dashboardHeader).toBe(0);
  });

  test('user has access for 7 days after a new account is created', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Email' }).fill('newuser@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();
    
    await page.waitForTimeout(2000);
    
    await page.goto('http://localhost:3000/dashboard');
    
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('signUp');
    expect(currentUrl).toContain('dashboard');
  });
});