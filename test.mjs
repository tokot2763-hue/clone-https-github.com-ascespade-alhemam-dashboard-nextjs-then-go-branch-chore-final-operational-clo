import { chromium } from 'playwright';

const BASE_URL = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';

async function test() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@alhemam.sa');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("Sign")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Debug - get rendered HTML
    const html = await page.content();
    console.log('HTML length:', html.length);
    
    // Find sidebar nav related words
    const navWords = ['nav', 'section', 'menu', 'Administration', 'Clinical', 'Operations', 'Insurance', 'Guardian', 'Patient'];
    navWords.forEach(word => {
      const count = (html.match(new RegExp(word, 'gi')) || []).length;
      console.log(`'${word}': ${count} occurrences`);
    });

    // Write HTML to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('/tmp/dashboard.html', html);
    console.log('\nFull HTML saved to /tmp/dashboard.html');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();