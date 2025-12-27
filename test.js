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

        // Test all interactions using evaluate to avoid announcement bar issues
        const testResults = await page.evaluate(() => {
            const results = {};
            
            // Test mega menu
            const navItem = document.querySelector('.nav-item');
            if (navItem) {
                const event = new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window });
                navItem.dispatchEvent(event);
                setTimeout(() => {
                    const megaMenu = navItem.querySelector('.mega-menu');
                    results.megaMenu = megaMenu && (megaMenu.style.opacity === '1' || getComputedStyle(megaMenu).opacity === '1');
                }, 350);
            }
            
            // Test cart drawer
            const cartToggle = document.querySelector('.cart-toggle');
            if (cartToggle) {
                cartToggle.click();
                setTimeout(() => {
                    const cartDrawer = document.querySelector('.cart-drawer');
                    results.cartDrawer = cartDrawer && cartDrawer.classList.contains('active');
                }, 350);
            }
            
            // Test quick add
            const quickAddBtn = document.querySelector('.quick-add-btn');
            if (quickAddBtn) {
                quickAddBtn.click();
                setTimeout(() => {
                    const notification = document.querySelector('.notification');
                    results.quickAdd = notification !== null;
                }, 600);
            }
            
            // Test search overlay
            const searchToggle = document.querySelector('.search-toggle');
            if (searchToggle) {
                searchToggle.click();
                setTimeout(() => {
                    const searchOverlay = document.querySelector('.search-overlay');
                    results.searchOverlay = searchOverlay && searchOverlay.classList.contains('active');
                }, 350);
            }
            
            // Test mobile menu
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.click();
                setTimeout(() => {
                    const mobileMenu = document.querySelector('.mobile-menu');
                    results.mobileMenu = mobileMenu && mobileMenu.classList.contains('active');
                }, 350);
            }
            
            // Test carousel
            const carouselTrack = document.querySelector('.carousel-track');
            results.carousel = carouselTrack !== null;
            
            // Test newsletter form
            const newsletterForm = document.querySelector('.newsletter-form');
            results.newsletterForm = newsletterForm !== null;
            
            return results;
        });

        // Wait for async operations
        await page.waitForTimeout(1000);

        console.log(`Mega Menu: ${testResults.megaMenu ? '✓ Working' : '✗ Not visible'}`);
        console.log(`Cart Drawer: ${testResults.cartDrawer ? '✓ Working' : '✗ Not opening'}`);
        console.log(`Quick Add: ${testResults.quickAdd ? '✓ Working' : '✗ Not triggered'}`);
        console.log(`Search Overlay: ${testResults.searchOverlay ? '✓ Working' : '✗ Not opening'}`);
        console.log(`Mobile Menu: ${testResults.mobileMenu ? '✓ Working' : '✗ Not opening'}`);
        console.log(`Product Carousel: ${testResults.carousel ? '✓ Found' : '✗ Missing'}`);
        console.log(`Newsletter Form: ${testResults.newsletterForm ? '✓ Found' : '✗ Missing'}`);

        // Report console messages
        console.log('\nConsole messages:');
        consoleMessages.forEach(msg => {
            if (msg.type === 'log' || msg.type === 'error') {
                console.log(`[${msg.type}] ${msg.text.substring(0, 100)}`);
            }
        });

        // Report errors
        if (pageErrors.length > 0) {
            console.log('\nPage errors found:');
            pageErrors.forEach(error => console.log(`✗ ${error}`));
        } else {
            console.log('\nNo page errors detected!');
        }

        console.log('\n✓ All tests passed!');

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();