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

        // 1. Landing Page
        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) {
            console.log("At landing page. Clicking login...");
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        // 2. Login Credentials
        let content = await page.evaluate(() => document.body.innerText);
        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei', { delay: 50 });
            await page.type('input[type="password"]', 'Alrahman99!', { delay: 50 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 12000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // 3. MFA (using saved code)
        if (content.includes('Security Code') || content.includes('Multifactor Authentication')) {
            const codePath = path.join(process.cwd(), 'mfa_code.txt');
            if (fs.existsSync(codePath)) {
                const mfaCode = fs.readFileSync(codePath, 'utf8').trim();
                console.log("Entering saved MFA code...");
                // Focus first input
                await page.evaluate(() => {
                    const i = document.querySelector('input');
                    if (i) i.focus();
                });
                await page.keyboard.type(mfaCode, { delay: 100 });
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, 12000));
                content = await page.evaluate(() => document.body.innerText);
            }
        }

        // 4. Terms and Jurisdiction
        if (content.includes('Terms and Conditions') || content.includes('Select a jurisdiction')) {
            console.log("Handling Jurisdiction Selection...");
            await page.evaluate(() => {
                const jcBtn = document.getElementById('btnEnterJC') ||
                    Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.includes('Jurisdiction C'));
                if (jcBtn) jcBtn.click();
            });
            await new Promise(r => setTimeout(r, 15000));
        }

        // 5. Final: Direct Navigation to Same/Similar
        console.log("Attempting direct navigation to Same/Similar page...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });

        await new Promise(r => setTimeout(r, 8000));

        const finalScreenshot = path.join(process.cwd(), 'cgs_samesimilar_final_v2.png');
        await page.screenshot({ path: finalScreenshot, fullPage: true });
        console.log("Final screenshot: " + finalScreenshot);

        const success = await page.evaluate(() => document.body.innerText.includes('MBI') || document.body.innerText.includes('Beneficiary'));
        if (success) {
            console.log("SUCCESS: Reached Same/Similar search page.");
        } else {
            console.log("Current page content: " + content.substring(0, 500));
        }

    } catch (e) {
        console.error("Fatal Error: " + e.message);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_ss_fatal_v2.png') });
    } finally {
        await browser.close();
    }
}

run();
