const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
    const mfaCode = '227524';
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

        // If at landing page
        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) {
            console.log("Found landing page login button. Clicking...");
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
            content = await page.evaluate(() => document.body.innerText);
        }

        // If at login page (Username/Password)
        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei', { delay: 50 });
            await page.type('input[type="password"]', 'Alrahman99!', { delay: 50 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
            content = await page.evaluate(() => document.body.innerText);
        }

        // If at MFA page
        if (content.includes('Security Code') || content.includes('Multifactor Authentication')) {
            console.log("At MFA screen. Entering code " + mfaCode + "...");

            await page.evaluate((code) => {
                // Find the MFA input specifically
                const inputs = Array.from(document.querySelectorAll('input'));
                // Often MFA is the only text input on this screen or has a specific id
                const mfaInput = inputs.find(i => i.type === 'text' && !i.value);
                if (mfaInput) {
                    mfaInput.focus();
                    mfaInput.value = code;
                    // Trigger events
                    mfaInput.dispatchEvent(new Event('input', { bubbles: true }));
                    mfaInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, mfaCode);

            // Also try keyboard typing just in case
            await page.keyboard.type(mfaCode, { delay: 100 });
            await page.keyboard.press('Enter');

            // Look for Submit button
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
                const submitBtn = btns.find(b => (b.innerText || b.value || "").toUpperCase().includes('SUBMIT'));
                if (submitBtn) submitBtn.click();
            });

            console.log("Waiting for results/dashboard...");
            await new Promise(r => setTimeout(r, 15000));

            await page.screenshot({ path: path.join(process.cwd(), 'cgs_final_post_mfa.png'), fullPage: true });

            const finalContent = await page.evaluate(() => document.body.innerText);
            if (finalContent.includes('Log Out') || finalContent.includes('Select a Jurisdiction')) {
                console.log("SUCCESS: Logged in successfully.");
                fs.writeFileSync(path.join(process.cwd(), 'mfa_code.txt'), mfaCode);
            } else {
                console.log("Login may have failed or still at MFA. Screen captured.");
            }
        } else {
            console.log("Neither login nor MFA screen detected. Unexpected state.");
            await page.screenshot({ path: path.join(process.cwd(), 'cgs_unexpected_state.png'), fullPage: true });
        }

    } catch (e) {
        console.error(e);
        await page.screenshot({ path: path.join(process.cwd(), 'mfa_submit_final_error.png') });
    } finally {
        await browser.close();
    }
}

run();
