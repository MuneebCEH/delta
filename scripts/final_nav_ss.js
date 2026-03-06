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

        // 1. Check if at login page
        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei');
            await page.type('input[type="password"]', 'Alrahman99!');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 15000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // 2. MFA
        if (content.includes('Security Code') || content.includes('Multifactor Authentication')) {
            console.log("Applying MFA code: " + mfaCode);
            await page.evaluate(() => {
                const i = document.querySelector('input');
                if (i) i.focus();
            });
            await page.keyboard.type(mfaCode, { delay: 100 });
            await page.keyboard.press('Enter');

            // Try explicit submit if Enter doesn't work
            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => (b.innerText || b.value || "").toUpperCase().includes('SUBMIT'));
                if (btn) btn.click();
            });

            await new Promise(r => setTimeout(r, 15000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // 3. Jurisdiction Selection
        if (content.includes('Terms and Conditions') || content.includes('Select a jurisdiction') || content.includes('acknowledge these terms')) {
            console.log("Handling Jurisdiction Selection (C)...");
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

        // 4. Navigate to Same/Similar
        console.log("Attempting to open Same/Similar page...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });

        await new Promise(r => setTimeout(r, 10000));

        const finalScreenshot = path.join(process.cwd(), 'cgs_samesimilar_final_direct.png');
        await page.screenshot({ path: finalScreenshot, fullPage: true });
        console.log("Final screenshot saved: " + finalScreenshot);

        const success = await page.evaluate(() => document.body.innerText.includes('MBI') || document.body.innerText.includes('Beneficiary'));
        if (success) {
            console.log("SUCCESS: Reached Same/Similar search page.");
            fs.writeFileSync(path.join(process.cwd(), 'mfa_code.txt'), mfaCode);
        } else {
            console.log("Final Content (truncated): " + content.substring(0, 500));
        }

    } catch (e) {
        console.error("FATAL: " + e.message);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_nav_fatal_direct.png') });
    } finally {
        await browser.close();
    }
}

run();
