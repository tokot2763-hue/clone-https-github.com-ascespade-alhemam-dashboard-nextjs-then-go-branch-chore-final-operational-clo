import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';

test.describe('Alhemam Healthcare Platform API', () => {
  test('healthz API returns data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/healthz`);
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('nav API returns sections in Arabic', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/nav?locale=ar`);
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(Array.isArray(data.sections)).toBe(true);
  });

  test('nav API returns sections in English', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/nav?locale=en`);
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(Array.isArray(data.sections)).toBe(true);
  });

  test('preferences API requires auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/preferences`);
    expect(response.status()).toBe(401);
  });
});

test.describe('Alhemam Healthcare Platform E2E', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const content = await page.content();
    expect(content).toMatch(/تسجيل الدخول|Login/);
  });

  test('home page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    
    const content = await page.content();
    expect(content).toMatch(/الهمة|Alhemam/);
  });
});