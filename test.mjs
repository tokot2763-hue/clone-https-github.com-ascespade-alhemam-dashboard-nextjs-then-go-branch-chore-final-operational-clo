import { chromium } from 'playwright';

const BASE_URL = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';

async function test() {
  console.log('=== Testing Alhemam Dashboard ===\n');

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Go to login page and fill form
    console.log('1. Login page...');
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    
    await page.fill('input[type="email"]', 'admin@alhemam.sa');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("Sign")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    console.log('   After login URL:', page.url());

    // 2. Check dashboard content
    console.log('\n2. Dashboard content...');
    const content = await page.content();
    const hasAlhemam = content.includes('Alhemam');
    const hasAdmin = content.includes('Administration') || content.includes('الإدارة');
    const hasClinical = content.includes('Clinical') || content.includes('السريري');
    const hasOperations = content.includes('Operations') || content.includes('العمليات');
    const hasUsers = content.includes('Users') || content.includes('المستخدمين');

    console.log('   Has Alhemam brand:', hasAlhemam);
    console.log('   Has Admin section:', hasAdmin);
    console.log('   Has Clinical section:', hasClinical);
    console.log('   Has Operations section:', hasOperations);
    console.log('   Has Users page:', hasUsers);

    // 3. Screenshot
    await page.screenshot({ path: '/tmp/test-dashboard.png', fullPage: true });
    console.log('\n3. Screenshot: /tmp/test-dashboard.png');

    console.log('\n=== Result ===');
    if (hasAlhemam && (hasAdmin || hasClinical || hasOperations)) {
      console.log('✅ PASS: Sidebar shows nav from DB');
    } else {
      console.log('❌ FAIL: Sidebar empty');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();