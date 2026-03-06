const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function keepAlive() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    let browser;

    try {
        console.log(`[${new Date().toLocaleString()}] Starting CGS Keep-Alive...`);
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--user-data-dir=' + sess
            ]
        });

        const page = await browser.newPage();

        // Go to a page that isn't too heavy but keeps the session active
        // The SameSimilarRequest page or just the home page works well
        await page.goto('https://mycgsportal.com/MyCGS/', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        const loggedIn = await page.evaluate(() => {
            return document.body.innerText.includes('Log Out') ||
                !!document.querySelector('#btnEnterJC') ||
                !!document.querySelector('#btnEnterJB');
        });

        if (loggedIn) {
            console.log("Session is active. Clicking a minor element to trigger activity...");
            // Click the CGS logo or a non-destructive link to simulate user activity
            await page.click('.main-site-logo').catch(() => { });
            await new Promise(r => setTimeout(r, 2000));
        } else {
            console.log("Session EXPIRED. Need to re-login manually or via script.");
        }

        const result = {
            service: 'CGS',
            online: loggedIn,
            timestamp: new Date().toISOString(),
            lastKeepAlive: new Date().toISOString()
        };

        fs.writeFileSync(path.join(process.cwd(), 'cgs_status.json'), JSON.stringify(result, null, 2));
        console.log(`Status: ${loggedIn ? 'ONLINE' : 'OFFLINE'}`);

    } catch (error) {
        console.error("Keep-Alive Error:", error.message);
    } finally {
        if (browser) await browser.close();
    }
}

// Run immediately
keepAlive();

// Note: This script should be called by a task scheduler (like Windows Task Scheduler)
// or a background process to run every 10-15 minutes.
