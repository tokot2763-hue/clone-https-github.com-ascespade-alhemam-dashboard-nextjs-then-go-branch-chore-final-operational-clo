const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
    console.log('[PAGE ERROR]', err.message);
  });

  try {
    console.log('=== Testing Login Page ===');
    
    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    console.log('Login page loaded');
    
    // Check page content
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for admin button
    const adminBtn = await page.locator('button:has-text("Admin")').first();
    if (await adminBtn.isVisible()) {
      console.log('Admin button found');
      
      // Click admin button
      console.log('Clicking Admin button...');
      await adminBtn.click();
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Check for error messages
      const errorDiv = await page.locator('.bg-red-500').first();
      if (await errorDiv.isVisible()) {
        console.log('ERROR DIV VISIBLE:', await errorDiv.textContent());
      }
      
      // Check current URL
      console.log('Current URL:', page.url());
    } else {
      console.log('Admin button NOT found');
      console.log('Page content:', await page.content().then(c => c.substring(0, 500)));
    }
    
    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log(e));
    }
    
  } catch (err) {
    console.log('TEST ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
