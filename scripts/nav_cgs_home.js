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

        let content = await page.evaluate(() => document.body.innerText);

        // 1. Initial Login/MFA checks (if session timed out)
        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) {
            console.log("Found landing page login button. Clicking...");
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
            content = await page.evaluate(() => document.body.innerText);
        }

        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Re-entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei', { delay: 50 });
            await page.type('input[type="password"]', 'Alrahman99!', { delay: 50 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));

            // Check for MFA if it comes up again
            content = await page.evaluate(() => document.body.innerText);
            if (content.includes('Security Code')) {
                const mfaCode = fs.readFileSync(path.join(process.cwd(), 'mfa_code.txt'), 'utf8').trim();
                console.log("MFA requested again. Using saved code...");
                await page.keyboard.type(mfaCode);
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, 10000));
            }
        }

        // 2. Click Jurisdiction C
        console.log("Selecting Jurisdiction C...");
        const jcClicked = await page.evaluate(() => {
            // Find Jurisdiction C specific button
            const btns = Array.from(document.querySelectorAll('button, a, input[type="button"]'));
            const jcBtn = btns.find(b => {
                const t = (b.innerText || b.value || "").toUpperCase();
                return t.includes('JURISDICTION C') || (t.includes('ENTER') && t.includes(' C'));
            }) || document.getElementById('btnEnterJC');

            if (jcBtn) {
                jcBtn.click();
                return true;
            }
            return false;
        });

        if (jcClicked) {
            console.log("Jurisdiction C clicked. Waiting for load...");
            await new Promise(r => setTimeout(r, 12000));
        }

        // 3. Navigate to Home Page from Menu
        console.log("Navigating to Home...");
        const homeClicked = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button, li'));
            const home = links.find(l => (l.innerText || "").trim().toUpperCase() === 'HOME');
            if (home) {
                home.click();
                return true;
            }
            return false;
        });

        if (!homeClicked) {
            console.log("'Home' button not found via click, using direct URL...");
            await page.goto('https://mycgsportal.com/MyCGS/Home', { waitUntil: 'networkidle2' }).catch(() => { });
        }

        await new Promise(r => setTimeout(r, 5000));
        const finalScreenshot = path.join(process.cwd(), 'cgs_final_home.png');
        await page.screenshot({ path: finalScreenshot, fullPage: true });
        console.log("Final screenshot: " + finalScreenshot);

    } catch (e) {
        console.error(e);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_nav_error.png') });
    } finally {
        await browser.close();
    }
}

run();
