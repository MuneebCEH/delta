const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    const loginUrl = 'https://mycgsportal.com/MyCGS/CGSAccount/Login';

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
        console.log("Navigating to: " + loginUrl);
        await page.goto(loginUrl, { waitUntil: 'networkidle2' });

        const content = await page.evaluate(() => document.body.innerText);
        if (content.includes('User ID') && content.includes('Password')) {
            console.log("At login page. Entering credentials...");
            await page.type('input[type="text"]', '1qs9jei');
            await page.type('input[type="password"]', 'Alrahman99!');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        const mfaContent = await page.evaluate(() => document.body.innerText);
        if (mfaContent.includes('Security Code') || mfaContent.includes('Multifactor Authentication')) {
            console.log("At MFA screen. Requesting fresh code via EMAIL ME...");
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
                await page.screenshot({ path: path.join(process.cwd(), 'fresh_mfa_request_direct.png'), fullPage: true });
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

run();
