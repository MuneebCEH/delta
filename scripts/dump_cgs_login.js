const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function dump() {
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
        const html = await page.content();
        fs.writeFileSync('cgs_login_page.html', html);
        await page.screenshot({ path: 'cgs_login_page.png' });
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

dump();
