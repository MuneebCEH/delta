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

        // Landing
        const loginBtn = await page.$('#btnLogin');
        if (loginBtn) {
            console.log("At landing page. Clicking log in...");
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        // Credentials
        content = await page.evaluate(() => document.body.innerText);
        if (content.includes('User ID') && content.includes('Password') && !content.includes('Security Code')) {
            console.log("At login page. Entering credentials...");
            await page.waitForSelector('input[type="text"]', { timeout: 10000 });
            await page.type('input[type="text"]', '1qs9jei');
            await page.type('input[type="password"]', 'Alrahman99!');
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 15000));
        }

        // MFA
        content = await page.evaluate(() => document.body.innerText);
        if (content.includes('Security Code') || content.includes('Multifactor Authentication')) {
            console.log("MFA requested. Checking for saved code...");
            const codePath = path.join(process.cwd(), 'mfa_code.txt');
            if (fs.existsSync(codePath)) {
                const mfaCode = fs.readFileSync(codePath, 'utf8').trim();
                console.log("Applying saved MFA code...");
                await page.keyboard.type(mfaCode);
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, 15000));
            } else {
                console.log("NO SAVED MFA CODE FOUND.");
            }
        }

        // At Terms/Jurisdiction
        content = await page.evaluate(() => document.body.innerText);
        if (content.includes('Terms and Conditions') || content.includes('acknowledge these terms')) {
            console.log("Handling Terms/Jurisdiction Selection...");
            // Click C
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, a, input'));
                const cBtn = btns.find(b => {
                    const t = (b.innerText || b.value || "").toUpperCase();
                    return t.includes('JURISDICTION C') || t.includes('ENTER JURISDICTION C');
                }) || document.getElementById('btnEnterJC');
                if (cBtn) cBtn.click();
            });
            await new Promise(r => setTimeout(r, 15000));
        }

        // Same/Similar
        console.log("Navigating to Same/Similar tool...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 10000));

        // Let's check for frames because Same/Similar often uses iframes
        const frames = page.frames();
        console.log("Frames found: " + frames.length);

        await page.screenshot({ path: path.join(process.cwd(), 'cgs_current_view.png'), fullPage: true });

        const isSS = await page.evaluate(() => document.body.innerText.includes('MBI') || document.body.innerText.includes('HCPCS'));
        if (isSS) {
            console.log("SUCCESS: Reached Same/Similar page.");
        } else {
            console.log("Final check failed. Screenshot saved as cgs_current_view.png");
            fs.writeFileSync('cgs_debug_content.txt', await page.evaluate(() => document.body.innerText));
        }

    } catch (e) {
        console.error("FATAL: " + e.message);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_nav_fatal.png') });
    } finally {
        await browser.close();
    }
}

run();
