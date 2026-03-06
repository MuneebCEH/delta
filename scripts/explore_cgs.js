const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
    const timestamp = Date.now();
    console.log(`CGS Final Extraction Attempt (${timestamp}) using MFA 792186...`);

    // TRULY fresh session folder to ensure no local tab pollution
    const sess = path.join(process.cwd(), `cgs_final_retry_${timestamp}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--user-data-dir=${sess}`,
            '--window-size=1600,1200'
        ]
    });

    // Explicitly use the only page created
    const [page] = await browser.pages();
    await page.setViewport({ width: 1600, height: 1200 });

    try {
        console.log("1. Entering Portal...");
        await page.goto('https://mycgsportal.com/MyCGS', { waitUntil: 'networkidle2' });

        await page.evaluate(() => {
            const btn = document.querySelector('.btn-login') || document.getElementById('btnLogin');
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 8000));

        console.log("2. Credentials...");
        await page.type('input[type="text"]', '1qs9jei', { delay: 50 });
        await page.type('input[type="password"]', 'Alrahman99!', { delay: 50 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 12000));

        console.log("3. Checking for MFA...");
        await page.screenshot({ path: `mfa_check_${timestamp}.png` });
        const bodyContent = await page.evaluate(() => document.body.innerText);
        if (bodyContent.includes('MFA') || bodyContent.includes('Multi-Factor Authentication') || bodyContent.includes('code')) {
            console.log("MFA Required. Please check the screenshot mfa_check_" + timestamp + ".png and provide the code.");
            // For now, we wait for a bit to see if we can proceed, or we just stop here if we don't have the code.
            // In a real scenario, we might want to wait for a file to appear with the code.
            const mfaFile = path.join(process.cwd(), 'mfa_code.txt');
            if (fs.existsSync(mfaFile)) {
                const code = fs.readFileSync(mfaFile, 'utf8').trim();
                console.log(`Applying MFA code from file: ${code}`);
                await page.keyboard.type(code, { delay: 100 });
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, 20000));
            } else {
                console.log("No mfa_code.txt found. Stopping for now.");
                await browser.close();
                return;
            }
        }

        // Diagnostic screenshot
        await page.screenshot({ path: `retry_post_mfa_${timestamp}.png` });

        console.log("4. Handling Jurisdiction...");
        const jurExists = await page.evaluate(() => !!document.getElementById('btnEnterJC'));
        if (jurExists) {
            console.log("Clicking #btnEnterJC...");
            await page.evaluate(() => document.getElementById('btnEnterJC').click());
            await new Promise(r => setTimeout(r, 12000));
        }

        console.log("5. Navigating to Same/Similar Request...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 12000));
        await page.screenshot({ path: `retry_tool_page_${timestamp}.png` });

        if (await page.evaluate(() => document.body.innerText.includes('MBI'))) {
            console.log("SUCCESS: Reached Tool. Filling Form...");

            await page.evaluate(() => {
                const fill = (id, val) => {
                    const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`) || document.querySelector(`[placeholder*="${id}"]`);
                    if (el) {
                        el.value = val;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                        el.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                };
                fill('Mbi', '3V52W11AL76');
                fill('BeneficiaryDob', '12/12/1954');
                fill('BeneficiaryLastName', 'Patterson');
                fill('HcpcsCode', 'A4253');
                fill('DateOfService', '02/13/2026');

                const allRadio = Array.from(document.querySelectorAll('input[type="radio"]')).find(r => r.value === 'ALL');
                if (allRadio) allRadio.click();
            });

            await new Promise(r => setTimeout(r, 3000));

            await page.evaluate(() => {
                const sel = document.querySelector('select[name*="Category"]');
                if (sel) {
                    const opt = Array.from(sel.options).find(o => o.text.includes('DIABETES'));
                    if (opt) {
                        sel.value = opt.value;
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });

            await page.screenshot({ path: `retry_filled_${timestamp}.png`, fullPage: true });

            console.log("6. Submitting Inquiry...");
            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('input[type="submit"], button')).find(x => x.value === 'Submit' || x.innerText.includes('Submit'));
                if (btn) btn.click();
            });

            await new Promise(r => setTimeout(r, 35000));
            await page.screenshot({ path: `retry_results_${timestamp}.png`, fullPage: true });

            const results = await page.evaluate(() => document.body.innerText);
            fs.writeFileSync(`retry_final_output_${timestamp}.txt`, results);
            console.log("FINISH. Results saved.");
        } else {
            console.log("FAILED to reach tool. Multiple tabs error likely still present.");
            await page.screenshot({ path: `retry_fail_state_${timestamp}.png` });
        }

    } catch (err) {
        console.error("FATAL ERROR:", err.message);
    } finally {
        await browser.close();
    }
}

run();
