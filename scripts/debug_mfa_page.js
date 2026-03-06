const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugMfa() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--user-data-dir=' + sess
        ]
    });

    const page = await browser.newPage();
    try {
        await page.goto('https://mycgsportal.com/MyCGS/CGSAccount/Login', { waitUntil: 'networkidle2' });

        const isLoginPage = await page.evaluate(() => !!document.querySelector('#UserId'));
        if (isLoginPage) {
            await page.type('#UserId', '1qs9jei');
            await page.type('#Password', 'Alrahman99!');
            await page.click('input[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        await new Promise(r => setTimeout(r, 7000));
        const html = await page.content();
        fs.writeFileSync('cgs_mfa_page_debug.html', html);
        await page.screenshot({ path: 'cgs_mfa_page_debug.png' });

        console.log("HTML and screenshot saved.");
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

debugMfa();
