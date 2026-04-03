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

    console.log('Logging in...');
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@alhemam.sa');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("Sign")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Get content to parse
    const html = await page.content();
    
    // Extract user display name - look in page for display
    const userNameMatch = html.match(/"full_name":"([^"]+)"/);
    const userEmailMatch = html.match(/"email":"([^"]+)"/);
    const roleMatch = html.match(/<p class="text-neutral-400 text-sm">Role<\/p>\s*<p class="text-2xl font-bold text-white">([^<]+)<\/p>/);
    const sectionsMatch = html.match(/<p class="text-neutral-400 text-sm">Sections<\/p>\s*<p class="text-2xl font-bold text-white">([^<]+)<\/p>/);
    const pagesMatch = html.match(/<p class="text-neutral-400 text-sm">Pages<\/p>\s*<p class="text-2xl font-bold text-white">([^<]+)<\/p>/);
    
    console.log('\nUser Info from Dashboard:');
    console.log('  email:', userEmailMatch ? userEmailMatch[1] : 'not found');
    console.log('  full_name:', userNameMatch ? userNameMatch[1] : 'not found');
    console.log('  Role value:', roleMatch ? roleMatch[1] : 'not found');
    console.log('  Sections count:', sectionsMatch ? sectionsMatch[1] : 'not found');
    console.log('  Pages count:', pagesMatch ? pagesMatch[1] : 'not found');
    
    // Check for nav items in sidebar
    const sidebarNav = html.match(/<nav class="flex-1[^]*?<div class="mb-1">([\s\S]*?)<\/nav>/);
    if (sidebarNav) {
      // Extract section labels
      const sectionsInSidebar = sidebarNav[1].match(/<span class="flex-1 text-left text-sm">([^<]+)<\/span>/g);
      console.log('\nSections in sidebar:');
      if (sectionsInSidebar) {
        sectionsInSidebar.forEach((s, i) => {
          console.log(`  ${i+1}.`, s.replace(/<\/?span[^>]*>/g, ''));
        });
      } else {
        console.log('  (none found)');
      }
    }

    // Try finding any items in sidebar
    const navMatches = html.match(/class="mb-1"[\s\S]*?<span class="text-sm">([^<]+)<\/span>/g);
    console.log('\nNav items in sidebar:', navMatches ? navMatches.length : 0);
    if (navMatches) {
      navMatches.forEach((m, i) => console.log(`  Item ${i+1}:`, m.replace(/<[^>]*>/g, '').substring(0, 50)));
    }

    console.log('\n=== Test Result ===');
    const role = roleMatch ? roleMatch[1].trim() : '';
    const sections = sectionsMatch ? parseInt(sectionsMatch[1]) : 0;
    const pages = pagesMatch ? parseInt(pagesMatch[1]) : 0;
    
    if (role && role !== 'guest' && sections > 0) {
      console.log('PASS: User has the right role and nav data is loaded!');
    } else if (sections > 0 && pages > 0) {
      console.log('PARTIAL: Some nav data loaded but role issue still present. Check role mapping.');
    } else {
      console.log('FAIL: No navigation data loaded. Role:', role || 'unknown');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();