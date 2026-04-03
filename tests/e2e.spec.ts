import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Alhemam Healthcare Platform', () => {
  test('login and access dashboard with navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@alhemam.sa');
    await page.fill('input[name="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 15000 });
    
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    
    expect(content).toContain('System Admin');
    
    const sidebar = await page.locator('aside').textContent();
    console.log('Sidebar content:', sidebar);
    
    expect(sidebar).toContain('Admin');
    expect(sidebar).toContain('Clinical');
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