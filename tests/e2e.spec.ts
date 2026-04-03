import { test, expect } from '@playwright/test';

const BASE_URL = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';

test.describe('Alhemam Healthcare Platform', () => {
  test('login with demo account and verify sidebar', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Click Admin demo button - try both English and Arabic text
    const adminButton = page.locator('button:has-text("Admin"), button:has-text("مدير نظام"), button:has-text("admin")').first();
    await adminButton.click({ timeout: 10000 });
    
    // Wait for navigation to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Verify logged in - check sidebar has sections (Arabic or English)
    const sidebar = await page.locator('aside').textContent();
    console.log('Sidebar:', sidebar?.substring(0, 200));
    
    // Sidebar should have navigation from DB
    expect(sidebar).toMatch(/Admin|الإدارة|Clinical|السريري|Operations/);
  });

  test('healthz API returns data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/healthz`);
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.pages).toBe(68);
    expect(data.sections).toBe(6);
  });
});