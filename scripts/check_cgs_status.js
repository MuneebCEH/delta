const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function checkStatus() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    let browser;

    try {
        console.log("Checking session at:", sess);
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--user-data-dir=' + sess
            ]
        });

        const page = await browser.newPage();
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.screenshot({ path: 'cgs_status_check_debug.png' });

        const loggedIn = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.includes('Log Out') ||
                !!document.getElementById('btnEnterJC') ||
                text.includes('Select a Jurisdiction') ||
                text.includes('NPI:') ||
                text.includes('Medicare ID');
        });

        console.log("Logged In:", loggedIn);
        console.log("URL:", page.url());

        const result = {
            service: 'CGS',
            online: loggedIn,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(path.join(process.cwd(), 'cgs_status.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result));

    } catch (error) {
        console.error("Error:", error.message);
        const result = {
            service: 'CGS',
            online: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync(path.join(process.cwd(), 'cgs_status.json'), JSON.stringify(result, null, 2));
    } finally {
        if (browser) await browser.close();
    }
}

checkStatus();
