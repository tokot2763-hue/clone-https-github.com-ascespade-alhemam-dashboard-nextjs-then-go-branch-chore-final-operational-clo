const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('=== Test 1: Visit Login Page ===');
  await page.goto('https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io/login', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Login page status:', page.url());
  
  const adminBtn = page.locator('button:has-text("Admin")');
  if (await adminBtn.isVisible()) {
    console.log('✓ Admin button found');
  } else {
    console.log('✗ Admin button NOT found');
  }

  console.log('\n=== Test 2: Click Admin Login ===');
  await adminBtn.click();
  await page.waitForTimeout(3000);
  
  console.log('After login URL:', page.url());
  
  if (page.url().includes('/dashboard')) {
    console.log('✓ Redirected to dashboard');
  } else {
    console.log('✗ Not redirected to dashboard, URL:', page.url());
  }

  const sidebar = page.locator('aside');
  if (await sidebar.isVisible()) {
    console.log('✓ Sidebar is visible');
  } else {
    console.log('✗ Sidebar NOT visible');
  }

  const logoutBtn = page.locator('button:has-text("Sign Out")');
  if (await logoutBtn.isVisible()) {
    console.log('✓ Logout button is visible');
  } else {
    console.log('✗ Logout button NOT visible');
  }

  const bodyText = await page.locator('body').innerText();
  console.log('\nPage contains "Dashboard":', bodyText.includes('Dashboard'));
  console.log('Page contains "Alhemam":', bodyText.includes('Alhemam'));
  console.log('Page contains "Sections":', bodyText.includes('Sections'));

  if (errors.length > 0) {
    console.log('\n=== ERRORS ===');
    errors.forEach(e => console.log(e));
  }

  await browser.close();
  console.log('\n=== Test Complete ===');
})();
