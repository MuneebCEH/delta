const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function login() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    console.log("Using session dir:", sess);

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--user-data-dir=' + sess
        ]
    });

    const page = await browser.newPage();
    const statusPath = path.join(process.cwd(), 'cgs_status.json');

    try {
        await page.setViewport({ width: 1280, height: 1024 });

        // 1. Force clear any existing concurrent sessions by going to Logout first OR just clearing cookies for the domain
        console.log("Navigating to Logout to clear any ghost sessions...");
        await page.goto('https://mycgsportal.com/MyCGS/CGSAccount/LogOut', { waitUntil: 'networkidle2' }).catch(() => { });
        await new Promise(r => setTimeout(r, 2000));

        console.log("Navigating to CGS Login...");
        await page.goto('https://mycgsportal.com/MyCGS/CGSAccount/Login', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        const isLoginPage = await page.evaluate(() => !!document.querySelector('#UserId'));

        if (isLoginPage) {
            console.log("Entering credentials...");
            await page.waitForSelector('#UserId', { timeout: 10000 });
            await page.type('#UserId', '1qs9jei');
            await page.type('#Password', 'Alrahman99!');
            await page.click('input[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
        }

        await new Promise(r => setTimeout(r, 5000));

        const pageText = await page.evaluate(() => document.body.innerText);
        if (pageText.includes('Multifactor Authentication') || !!(await page.$('#txtMFACode'))) {
            console.log("MFA Screen detected.");

            let code = '227524';
            const mfaFile = path.join(process.cwd(), 'mfa_code.txt');
            if (fs.existsSync(mfaFile)) {
                code = fs.readFileSync(mfaFile, 'utf8').trim();
                console.log("Read MFA code from mfa_code.txt:", code);
            }

            await page.waitForSelector('#txtMFACode', { timeout: 10000 });
            await page.type('#txtMFACode', code);

            const submitBtn = await page.$('#btnSubmitAuthenticationCode') || await page.$('#btnSubmitCode');
            if (submitBtn) {
                await submitBtn.click();
                console.log("MFA Submit button clicked.");
            }

            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
        }

        await new Promise(r => setTimeout(r, 8000));

        const needsJurisdiction = await page.evaluate(() => !!document.querySelector('#btnEnterJC'));
        if (needsJurisdiction) {
            console.log("Selecting Jurisdiction JC...");
            await page.click('#btnEnterJC');
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
        }

        const finalContent = await page.evaluate(() => document.body.innerText);
        const loggedIn = finalContent.includes('Log Out') ||
            finalContent.includes('Select a Jurisdiction') ||
            finalContent.includes('Jurisdiction B') ||
            !!(await page.$('#btnEnterJC')) ||
            !!(await page.$('#btnEnterJB'));

        console.log("Login result:", loggedIn);

        const result = {
            service: 'CGS',
            online: loggedIn,
            timestamp: new Date().toISOString(),
            lastUrl: page.url()
        };

        fs.writeFileSync(statusPath, JSON.stringify(result, null, 2));
        await page.screenshot({ path: 'cgs_login_final_verified.png' });
        console.log("Status updated to:", loggedIn ? "ONLINE" : "OFFLINE");

    } catch (e) {
        console.error("Error:", e.message);
        const result = {
            service: 'CGS',
            online: false,
            error: e.message,
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync(statusPath, JSON.stringify(result, null, 2));
    } finally {
        await browser.close();
    }
}

login();
