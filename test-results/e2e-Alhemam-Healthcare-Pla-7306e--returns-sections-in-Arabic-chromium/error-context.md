# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Alhemam Healthcare Platform API >> nav API returns sections in Arabic
- Location: tests/e2e.spec.ts:14:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = process.env.BASE_URL || 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';
  4  | 
  5  | test.describe('Alhemam Healthcare Platform API', () => {
  6  |   test('healthz API returns data', async ({ request }) => {
  7  |     const response = await request.get(`${BASE_URL}/api/v1/healthz`);
  8  |     expect(response.ok()).toBe(true);
  9  |     
  10 |     const data = await response.json();
  11 |     expect(data.status).toBe('ok');
  12 |   });
  13 | 
  14 |   test('nav API returns sections in Arabic', async ({ request }) => {
  15 |     const response = await request.get(`${BASE_URL}/api/v1/nav?locale=ar`);
> 16 |     expect(response.ok()).toBe(true);
     |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  17 |     
  18 |     const data = await response.json();
  19 |     expect(Array.isArray(data.sections)).toBe(true);
  20 |   });
  21 | 
  22 |   test('nav API returns sections in English', async ({ request }) => {
  23 |     const response = await request.get(`${BASE_URL}/api/v1/nav?locale=en`);
  24 |     expect(response.ok()).toBe(true);
  25 |     
  26 |     const data = await response.json();
  27 |     expect(Array.isArray(data.sections)).toBe(true);
  28 |   });
  29 | 
  30 |   test('preferences API requires auth', async ({ request }) => {
  31 |     const response = await request.get(`${BASE_URL}/api/v1/preferences`);
  32 |     expect(response.status()).toBe(401);
  33 |   });
  34 | });
  35 | 
  36 | test.describe('Alhemam Healthcare Platform E2E', () => {
  37 |   test('login page loads', async ({ page }) => {
  38 |     await page.goto(`${BASE_URL}/login`);
  39 |     await page.waitForLoadState('networkidle');
  40 |     
  41 |     const content = await page.content();
  42 |     expect(content).toMatch(/تسجيل الدخول|Login/);
  43 |   });
  44 | 
  45 |   test('home page loads', async ({ page }) => {
  46 |     await page.goto(`${BASE_URL}/`);
  47 |     await page.waitForLoadState('networkidle');
  48 |     
  49 |     const content = await page.content();
  50 |     expect(content).toMatch(/الهمة|Alhemam/);
  51 |   });
  52 | });
```