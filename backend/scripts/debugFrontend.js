import puppeteer from 'puppeteer';

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('🌐 navigating to Assignments page...');
    
    // Listen for console events
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    page.on('requestfailed', request => {
      console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
    });

    try {
        // Go to login first since it's a protected route
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Log in (assuming simple login for test)
        // Wait for login inputs
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', 'test@example.com'); // Use a dummy or existing test account
        await page.type('input[type="password"]', 'password123'); // Assuming standard test creds or need to register
        
        // Use a more generic selector for the button if needed, but try to find the submit button
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
             await submitButton.click();
        } else {
             console.log('Could not find submit button');
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation timeout or already safely resolved'));
        
        console.log('✅ Logged in (hopefully), navigating to /assignments...');
        await page.goto('http://localhost:5173/assignments', { waitUntil: 'networkidle0' });
        
        // Check if specific content exists
        const title = await page.$('h1');
        if (title) {
            const text = await page.evaluate(el => el.textContent, title);
            console.log('📄 Page Title found:', text);
        } else {
            console.log('❌ Page Title NOT found. Page might differ or crashed.');
        }
        
    } catch (error) {
        console.error('❌ An error occurred:', error);
    } finally {
        await browser.close();
    }
})();
