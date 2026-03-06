const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
    const mfaCode = '227524';
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
        console.log("Navigating to CGS Login URL: " + loginUrl);
        await page.goto(loginUrl, { waitUntil: 'networkidle2' });

        let content = await page.evaluate(() => document.body.innerText);

        // Credentials
        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei');
            await page.type('input[type="password"]', 'Alrahman99!');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 15000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // MFA
        if (content.includes('Security Code') || content.includes('Multifactor Authentication')) {
            console.log("Applying MFA code: " + mfaCode);
            await page.evaluate(() => {
                const i = document.querySelector('input');
                if (i) i.focus();
            });
            await page.keyboard.type(mfaCode, { delay: 100 });
            await page.keyboard.press('Enter');

            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => (b.innerText || b.value || "").toUpperCase().includes('SUBMIT'));
                if (btn) btn.click();
            });

            await new Promise(r => setTimeout(r, 15000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // Jurisdiction
        if (content.includes('Terms and Conditions') || content.includes('Select a jurisdiction') || content.includes('acknowledge these terms')) {
            console.log("Selecting Jurisdiction C...");
            await page.evaluate(() => {
                const cBtn = document.getElementById('btnEnterJC') ||
                    Array.from(document.querySelectorAll('button, a')).find(b => {
                        const t = (b.innerText || "").toUpperCase();
                        return t.includes('JURISDICTION C') || t.includes('ENTER JURISDICTION C');
                    });
                if (cBtn) cBtn.click();
            });
            await new Promise(r => setTimeout(r, 15000));
        }

        // Same/Similar
        console.log("Opening Same/Similar page...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' }).catch(async () => {
            await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('a, button, span'));
                const ss = items.find(i => i.innerText.toUpperCase().includes('SAME/SIMILAR'));
                if (ss) ss.click();
            });
        });

        await new Promise(r => setTimeout(r, 8000));
        const finalScreenshot = path.join(process.cwd(), 'cgs_final_ss_view.png');
        await page.screenshot({ path: finalScreenshot, fullPage: true });
        console.log("Final screenshot: " + finalScreenshot);

        const isSS = await page.evaluate(() => document.body.innerText.includes('MBI') || document.body.innerText.includes('HCPCS'));
        if (isSS) {
            console.log("SUCCESS: Reached Same/Similar page.");
        }

    } catch (e) {
        console.error("FATAL: " + e.message);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_direct_login_error.png') });
    } finally {
        await browser.close();
    }
}

run();
