const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const baseUrl = 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';
  
  console.log('=== Testing Alhemam Dashboard ===\n');
  
  // 1. Go to login page
  console.log('1. Loading login page...');
  await page.goto(baseUrl + '/login');
  await page.waitForLoadState('networkidle');
  console.log('   URL:', page.url());
  
  // 2. Go to dashboard
  console.log('\n2. Loading dashboard...');
  await page.goto(baseUrl + '/dashboard');
  await page.waitForLoadState('networkidle');
  console.log('   URL:', page.url());
  
  // 3. Check sidebar
  console.log('\n3. Checking sidebar content...');
  const content = await page.content();
  
  const hasAlhemam = content.includes('Alhemam');
  const hasDashboard = content.includes('Dashboard') || content.includes('لوحة التحكم');
  const hasLogout = content.includes('Sign Out') || content.includes('Logout') || content.includes('تسجيل الخروج');
  const hasNavItems = content.includes('المستخدمين') || content.includes('Users') || content.includes('الإعدادات') || content.includes('Settings');
  
  console.log('   Has Alhemam:', hasAlhemam);
  console.log('   Has Dashboard:', hasDashboard);
  console.log('   Has Logout:', hasLogout);
  console.log('   Has Nav Items:', hasNavItems);
  
  // 4. Check for navigation tree
  console.log('\n4. Checking navigation from DB...');
  const navSectionMatch = content.match(/(المستخدمين|Users|الإعدادات|Settings|التقارير|Reports)/g);
  console.log('   Nav sections found:', navSectionMatch ? navSectionMatch.join(', ') : 'None');
  
  // 5. Screenshot
  await page.screenshot({ path: '/tmp/agent_507c103b-f5f7-4272-a069-2c105937e82c/test.png', fullPage: true });
  console.log('\n5. Screenshot saved to /tmp/test.png');
  
  await browser.close();
  console.log('\n=== Test Complete ===');
})();