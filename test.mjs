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

    // Login via UI
    console.log('1. Logging in...');
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@alhemam.sa');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("Sign")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check the cookies after login
    const cookies = await context.cookies();
    console.log('\n2. Cookies after login:');
    cookies.forEach(c => console.log(`  ${c.name}: ${c.value.substring(0,20)}...`));

    // Get page content
    const html = await page.content();
    
    // Check if we see Guest or admin user
    const isGuest = html.includes('>Guest<') && !html.includes('>Admin');
    const isAdmin = html.includes('>Admin<') || html.includes('admin@alhemam');
    const hasNav = html.includes('Administration') || html.includes('Clinical');
    
    console.log('\n3. User status:');
    console.log('  Shows Guest user:', isGuest);
    console.log('  Shows Admin user:', isAdmin);
    console.log('  Has navigation:', hasNav);

    // Check the role values in HTML
    const roleMatch = html.match(/Role.*?(\w+)/);
    const statusMatch = html.match(/Status.*?(\w+)/);
    const sectionsMatch = html.match(/Sections.*?(\d+)/);
    const pagesMatch = html.match(/Pages.*?(\d+)/);
    
    console.log('\n4. Dashboard values:');
    console.log('  Role:', roleMatch ? roleMatch[1] : 'not found');
    console.log('  Status:', statusMatch ? statusMatch[1] : 'not found');
    console.log('  Sections:', sectionsMatch ? sectionsMatch[1] : 'not found');
    console.log('  Pages:', pagesMatch ? pagesMatch[1] : 'not found');

    console.log('\n=== Test Result ===');
    if (isAdmin || hasNav) {
      console.log('PASS: User logged in and nav loaded!');
    } else {
      console.log('FAIL: Still showing Guest or empty nav');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();