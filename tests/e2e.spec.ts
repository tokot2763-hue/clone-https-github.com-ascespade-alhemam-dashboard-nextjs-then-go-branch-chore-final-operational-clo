import { test, expect } from '@playwright/test';

const BASE_URL = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';

test.describe('Alhemam Healthcare Platform', () => {
  test('login with demo account and verify sidebar', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Click Admin demo button
    await page.click('button:has-text("Admin")');
    
    // Wait for navigation to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Verify logged in as admin
    const content = await page.content();
    expect(content).toContain('System Admin');
    
    // Check sidebar has sections
    const sidebar = await page.locator('aside').textContent();
    console.log('Sidebar:', sidebar);
    
    // Sidebar should have navigation from DB
    expect(sidebar).toMatch(/Admin|Clinical|Operations|Insurance|Guardian|Patient/);
  });

  test('healthz API returns data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/healthz`);
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.pages).toBe(63);
    expect(data.sections).toBe(6);
  });
});