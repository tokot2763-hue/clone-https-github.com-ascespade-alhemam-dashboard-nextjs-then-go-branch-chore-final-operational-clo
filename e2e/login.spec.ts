import { test, expect } from '@playwright/test';

test('login and sidebar navigation', async ({ page }) => {
  const baseUrl = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';
  
  // Go to login page
  await page.goto(baseUrl + '/login');
  await page.waitForLoadState('networkidle');
  
  console.log('Login page loaded, URL:', page.url());
  
  // Check URL - should redirect to dashboard if already logged in
  if (page.url().includes('/dashboard')) {
    console.log('Already logged in, checking sidebar...');
    const content = await page.content();
    console.log('Has Alhemam:', content.includes('Alhemam'));
    console.log('Has Dashboard:', content.includes('Dashboard'));
  }
});