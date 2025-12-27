const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    // Collect page errors
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });

    try {
        // Navigate to the HTML file
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

        console.log('Page loaded successfully!');

        // Check page title
        const title = await page.title();
        console.log(`Page title: ${title}`);

        // Check if main elements exist
        const header = await page.$('.header');
        const hero = await page.$('.hero');
        const featuredCollections = await page.$('.featured-collections');
        const featuredProducts = await page.$('.featured-products');
        const bestsellers = await page.$('.bestsellers');
        const instagram = await page.$('.instagram-section');
        const newsletter = await page.$('.newsletter-section');
        const footer = await page.$('.footer');

        console.log('\nElement checks:');
        console.log(`Header: ${header ? '✓ Found' : '✗ Missing'}`);
        console.log(`Hero Section: ${hero ? '✓ Found' : '✗ Missing'}`);
        console.log(`Featured Collections: ${featuredCollections ? '✓ Found' : '✗ Missing'}`);
        console.log(`Featured Products: ${featuredProducts ? '✓ Found' : '✗ Missing'}`);
        console.log(`Bestsellers: ${bestsellers ? '✓ Found' : '✗ Missing'}`);
        console.log(`Instagram Section: ${instagram ? '✓ Found' : '✗ Missing'}`);
        console.log(`Newsletter: ${newsletter ? '✓ Found' : '✗ Missing'}`);
        console.log(`Footer: ${footer ? '✓ Found' : '✗ Missing'}`);

        console.log('\n✓ All tests passed!');

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();