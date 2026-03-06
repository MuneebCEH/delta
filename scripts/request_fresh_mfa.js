const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
    // New code to request fresh MFA
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--user-data-dir=' + sess
        ]
    });

    const page = await browser.newPage();
    try {
        console.log("Forcing fresh login to request new code...");
        await page.goto('https://mycgsportal.com/', { waitUntil: 'networkidle2' });

        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) await loginBtn.click();
        await page.waitForNavigation();

        await page.waitForSelector('input[type="text"]');
        await page.type('input[type="text"]', '1qs9jei');
        await page.type('input[type="password"]', 'Alrahman99!');
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 10000));

        const content = await page.evaluate(() => document.body.innerText);
        if (content.includes('Security Code')) {
            console.log("At MFA screen. Requesting EMAIL...");
            const clicked = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, a, input, span'));
                const emailBtn = btns.find(b => (b.innerText || b.value || "").toUpperCase().includes('EMAIL ME'));
                if (emailBtn) {
                    emailBtn.click();
                    return true;
                }
                return false;
            });

            if (clicked) {
                console.log("Email code requested.");
                await new Promise(r => setTimeout(r, 5000));
                await page.screenshot({ path: path.join(process.cwd(), 'mfa_request_fresh.png'), fullPage: true });
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

run();
