const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
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
        console.log("Navigating to CGS...");
        await page.goto('https://mycgsportal.com/', { waitUntil: 'networkidle2' });

        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) {
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        console.log("Checking if already at MFA or login...");
        const content = await page.evaluate(() => document.body.innerText);

        if (content.includes('Enter Security Code') || content.includes('Multifactor Authentication')) {
            console.log("Already at MFA screen.");
        } else {
            console.log("Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei');
            await page.type('input[type="password"]', 'Alrahman99!');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        console.log("Refetching content to find 'EMAIL ME'...");
        const newContent = await page.evaluate(() => document.body.innerText);

        const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a, span'));
            const emailBtn = btns.find(b => (b.innerText || b.value || "").toUpperCase().includes('EMAIL ME'));
            if (emailBtn) {
                emailBtn.click();
                return true;
            }
            return false;
        });

        if (clicked) {
            console.log("Clicked 'EMAIL ME' button.");
            await new Promise(r => setTimeout(r, 5000));
            await page.screenshot({ path: path.join(process.cwd(), 'mfa_code_sent_final.png'), fullPage: true });
            console.log("Snapshot taken after clicking 'EMAIL ME'.");
        } else {
            console.log("'EMAIL ME' button NOT found in interactive elements.");
            // Try to click by coordinate or specialized selector if needed
        }

    } catch (e) {
        console.error(e);
        await page.screenshot({ path: path.join(process.cwd(), 'mfa_error_final.png') });
    } finally {
        await browser.close();
    }
}

run();
