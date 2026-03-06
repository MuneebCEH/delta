
const puppeteer = require('puppeteer');
const path = require('path');

async function debug() {
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--user-data-dir=' + sess]
    });
    const page = (await browser.pages())[0];
    console.log('Navigating...');
    await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });
    console.log('Waiting for 10s...');
    await new Promise(r => setTimeout(r, 10000));
    await page.screenshot({ path: 'debug_tool_page_v2.png' });
    console.log('Screenshot saved to debug_tool_page_v2.png');

    const frames = page.frames();
    console.log('Frames found:', frames.length);
    const allData = [];
    for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        const inputs = await f.evaluate(() => {
            return Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
                id: el.id,
                name: el.name,
                type: el.type,
                value: el.value,
                text: el.innerText || el.textContent,
                placeholder: el.placeholder,
                isVisible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
            }));
        });
        allData.push({ frame: i, url: f.url(), count: inputs.length, inputs });
    }
    const fs = require('fs');
    fs.writeFileSync('scripts/form_debug.json', JSON.stringify(allData, null, 2));
    await browser.close();
}
debug();
