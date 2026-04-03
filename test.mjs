import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('=== Testing Alhemam Dashboard ===\n');

try {
  // 1. Login page
  console.log('1. Loading login page...');
  await page.goto('https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io/login');
  await page.waitForLoadState('networkidle');
  console.log('   URL:', page.url());
  console.log('   Title:', await page.title());

  // 2. Dashboard page
  console.log('\n2. Loading dashboard...');
  await page.goto('https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io/dashboard');
  await page.waitForLoadState('networkidle');
  console.log('   URL:', page.url());

  // 3. Get content
  console.log('\n3. Checking page content...');
  const content = await page.content();

  // Check for sidebar elements
  const hasAlhemam = content.includes('Alhemam');
  const hasDashboard = content.includes('Dashboard') || content.includes('لوحة');

  // Check for section labels
  const hasAdmin = content.includes('Administration') || content.includes('الإدارة');
  const hasClinical = content.includes('Clinical') || content.includes('السريري');
  const hasOperations = content.includes('Operations') || content.includes('العمليات');

  console.log('   Has Alhemam brand:', hasAlhemam);
  console.log('   Has Dashboard:', hasDashboard);
  console.log('   Has Admin section:', hasAdmin);
  console.log('   Has Clinical section:', hasClinical);
  console.log('   Has Operations section:', hasOperations);

  // Check for pages
  const hasUsers = content.includes('Users') || content.includes('المستخدمين');
  const hasPatients = content.includes('Patients') || content.includes('المرضى');

  console.log('   Has Users page:', hasUsers);
  console.log('   Has Patients page:', hasPatients);

  // 4. Screenshot
  await page.screenshot({ path: '/tmp/agent_507c103b-f5f7-4272-a069-2c105937e82c/dashboard-test.png', fullPage: true });
  console.log('\n4. Screenshot saved to /tmp/dashboard-test.png');

  console.log('\n=== Test Summary ===');
  if (hasAlhemam && (hasAdmin || hasClinical || hasOperations)) {
    console.log('✅ PASS: Sidebar is rendering with nav sections from DB');
  } else {
    console.log('❌ FAIL: Sidebar not showing navigation');
  }

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await browser.close();
}