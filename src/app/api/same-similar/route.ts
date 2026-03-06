import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mbi, dob, lastName, firstName, hcpcs, category, dateOfService } = body;

        if (!mbi || !dob || !lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create a script to run the automation with these parameters
        const scriptPath = path.join(process.cwd(), 'scripts', 'run_samesimilar.js');
        const timestamp = Date.now();
        // Automation script content
        const automationScript = `
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    const timestamp = '${timestamp}';
    const sess = path.join(process.cwd(), 'cgs_persistent_app_session_v9');
    
    // Log function
    const log = (msg) => {
        const entry = '[' + new Date().toISOString() + '] ' + msg + '\\n';
        fs.appendFileSync('cgs_tracking_' + timestamp + '.txt', entry);
        // console.log(msg); // Silence console logs for performance
    };

    let browser;
    let page;

    try {
        log("Launching headless browser...");
        browser = await puppeteer.launch({
            headless: "new", // Run in background (invisible)
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-features=site-per-process',
                '--user-data-dir=' + sess,
                '--window-size=1920,1080'
            ],
            defaultViewport: null
        });

        const pages = await browser.pages();
        page = pages[0];
        
        // Anti-detection
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        const targetUrl = 'https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest';

        // 1. Navigation - Try to go straight to target
        log("Navigating to Same/Similar tool...");
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });

        // 2. Login Check
        const currentUrl = page.url();
        if (currentUrl.includes('Login') || currentUrl.includes('home') || (await page.$('#btnLogin'))) {
            log("Login required...");
            
            // Check for landing page specific "Log In" button
            const landingBtn = await page.$('#btnLogin');
            if (landingBtn) {
                await landingBtn.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
            }

            // Wait for username field
            const usernameSelector = 'input[type="text"]';
            try {
                await page.waitForSelector(usernameSelector, { timeout: 5000 });
                const uField = await page.$(usernameSelector);
                if (uField) {
                     // Check if empty
                     const val = await page.evaluate(el => el.value, uField);
                     if (!val) {
                        log(" Entering credentials...");
                        await page.type(usernameSelector, '1qs9jei', { delay: 50 });
                        await page.type('input[type="password"]', 'Alrahman99!', { delay: 50 });
                        
                        const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
                        if (submitBtn) {
                            await submitBtn.click();
                            await page.waitForNavigation({ waitUntil: 'networkidle2' });
                        }
                     }
                }
            } catch (e) {
                log("Login field not found or already logged in.");
            }
            
            // MFA Handling
            const mfaHeader = await page.evaluate(() => document.body.innerText.includes('Multi-Factor Authentication'));
            if (mfaHeader) {
                log("MFA Detected. waiting for code...");
                const mfaFile = path.join(process.cwd(), 'mfa_code.txt');
                if (fs.existsSync(mfaFile)) {
                    const code = fs.readFileSync(mfaFile, 'utf8').trim();
                    log("Entering code...");
                    await page.evaluate(() => {
                        const i = document.querySelector('input');
                        if (i) i.focus();
                    });
                    await page.keyboard.type(code, { delay: 100 });
                    await page.keyboard.press('Enter');
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });
                }
            }
        }

        // Navigate again to ensure we are on the right page if redirected
        if (!page.url().includes('SameSimilarRequest')) {
             log("Redirecting to Same/Similar search page...");
             await page.goto(targetUrl, { waitUntil: 'networkidle2' });
        }

        // Check login status
        let loggedIn = await page.evaluate(() => 
            document.body.innerText.includes('Log Out') || 
            !!document.getElementById('btnEnterJC') || 
            document.body.innerText.includes('Select a Jurisdiction') ||
            document.body.innerText.includes('NPI:') ||
            document.body.innerText.includes('Medicare ID')
        );
        
        if (!loggedIn) {
            log("Not logged in. Finding login endpoint...");
            const loginBtn = await page.waitForSelector('.btn-login, #btnLogin, [value*="Log In"]', { timeout: 15000 }).catch(() => null);
            if (loginBtn) {
                await loginBtn.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
            }

            await fixErrors();

            log("Checking for username field...");
            const hasUserField = await page.waitForSelector('input[type="text"]', { timeout: 35000 }).catch(() => null);
            if (!hasUserField) {
                log("Username field not found. Trying one more reload...");
                await page.reload({ waitUntil: 'networkidle2' });
                await fixErrors();
            }

            log("Typing credentials...");
            await page.focus('input[type="text"]');
            await page.keyboard.type('1qs9jei', { delay: 100 });
            await page.focus('input[type="password"]');
            await page.keyboard.type('Alrahman99!', { delay: 100 });
            await page.keyboard.press('Enter');
            
            log("Login payload sent. Waiting for MFA/Dashboard...");
            await new Promise(r => setTimeout(r, 20000));
            await fixErrors();

            const content = await page.evaluate(() => document.body.innerText);
            if (content.includes('MFA') || content.includes('Verification') || content.includes('Security Code') || content.includes('One-Time')) {
                log("MFA requested.");
                const mfaFile = path.join(process.cwd(), 'mfa_code.txt');
                if (fs.existsSync(mfaFile)) {
                    const code = fs.readFileSync(mfaFile, 'utf8').trim();
                    log("Entering code: " + code);
                    await page.evaluate(() => {
                        const i = document.querySelector('input');
                        if (i) i.focus();
                    });
                    await page.keyboard.type(code, { delay: 150 });
                    await page.keyboard.press('Enter');
                    await new Promise(r => setTimeout(r, 20000));
                }
            }
        } else {
            log("Session confirmed.");
        }

        await fixErrors();

        log("Handling post-login screens...");
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, input[type="submit"], a.btn'));
            const btn = btns.find(b => {
                const t = (b.innerText || b.value || "").toLowerCase();
                return t.includes('accept') || t.includes('agree') || t.includes('enter') || t.includes('consent');
            });
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 8000));

        const jc = await page.waitForSelector('#btnEnterJC, #btnEnterJB, #btnEnterJA', { timeout: 15000 }).catch(() => null);
        if (jc) {
            log("Selecting Jurisdiction...");
            await jc.click();
            await new Promise(r => setTimeout(r, 12000));
        }

        log("Fetching Same/Similar tool...");
        await page.goto('https://mycgsportal.com/MyCGS/SameSimilar/SameSimilarRequest', { waitUntil: 'networkidle2' });
        
        let toolFrame = page;
        const frames = page.frames();
        for (const f of frames) {
            if (await f.$('#Mbi').catch(() => null)) {
                toolFrame = f;
                log("Tool found in frame: " + f.url());
                break;
            }
        }

        await new Promise(r => setTimeout(r, 5000));
        log("Filling form fields for: ${lastName}...");
        
        // Use keyboard typing for better reliability with masked fields
        const typeField = async (sel, value) => {
            if (!value) return;
            const element = await toolFrame.waitForSelector('#' + sel + ', [name*="' + sel + '"]', { timeout: 10000 }).catch(() => null);
            if (element) {
                await element.click({ clickCount: 3 }); // Select all text
                await element.press('Backspace');
                await element.type(value, { delay: 50 });
                log("Typed " + sel + ": " + value);
            } else {
                log("Field not found: " + sel);
            }
        };

        await typeField('Mbi', '${mbi}');
        await typeField('BeneficiaryDob', '${dob}');
        await typeField('BeneficiaryLastName', '${lastName}');
        await typeField('BeneficiaryFirstName', '${firstName}');
        await typeField('DateOfService', '${dateOfService}' || '02/15/2026');

        // Select "Both JB and JC" for maximum results
        await toolFrame.evaluate(() => {
            const rads = Array.from(document.querySelectorAll('input[type="radio"]'));
            const both = rads.find(r => r.value?.toLowerCase().includes('both') || r.id?.toLowerCase().includes('both') || r.parentElement?.innerText.toLowerCase().includes('both'));
            if (both) both.click();
        });

        // Radio buttons for Category or HCPCS
        if ('${category}') {
            await toolFrame.evaluate(() => {
                const r = Array.from(document.querySelectorAll('input[type="radio"]')).find(x => x.value === 'ProductCategory' || x.id?.includes('ProductCategory'));
                if (r) r.click();
            });
            await new Promise(r => setTimeout(r, 2000));
            await toolFrame.evaluate((cat) => {
                const sel = document.getElementById('ProductCategory') || document.querySelector('select[name*="Category"]');
                if (sel) {
                    const opt = Array.from(sel.options).find(o => o.text.includes(cat) || o.value.includes(cat));
                    if (opt) {
                        sel.value = opt.value;
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }, '${category}');
        } else if ('${hcpcs}') {
            await toolFrame.evaluate(() => {
                const r = Array.from(document.querySelectorAll('input[type="radio"]')).find(x => x.value === 'HCPCS' || x.id?.includes('HCPCS'));
                if (r) r.click();
            });
            await new Promise(r => setTimeout(r, 2000));
            await typeField('HcpcsCode', '${hcpcs}');
        }

        log("Submitting search...");
        await toolFrame.evaluate(() => {
            const b = Array.from(document.querySelectorAll('input[type="submit"], button')).find(x => x.value === 'Submit' || x.innerText.includes('Submit'));
            if (b) b.click();
        });

        log("Waiting for results page (up to 60s)...");
        // Wait for something that indicates results or "no results"
        await toolFrame.waitForFunction(() => 
            document.body.innerText.includes('Claim History Summary') || 
            document.body.innerText.includes('CMN Summary') || 
            document.body.innerText.includes('NO MATCHING CLAIM RECORDS FOUND') ||
            document.body.innerText.includes('Transaction ID'),
            { timeout: 60000 }
        ).catch(() => log("Timeout waiting for result indicator, Proceeding anyway..."));

        await new Promise(r => setTimeout(r, 5000));
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_final_capture_' + timestamp + '.png'), fullPage: true });

        const results = await toolFrame.evaluate(() => {
            const tables = Array.from(document.querySelectorAll('table'));
            const logs = [];
            
            // Helper to find table by headers
            const findTable = (headers) => {
                return tables.find(t => headers.every(h => t.innerText.toLowerCase().includes(h.toLowerCase())));
            };

            // 1. Claim History Summary (all 10 columns)
            const claimTable = findTable(['From Date', 'HCPCS']) || findTable(['From DOS', 'HCPCS']);
            let claims = [];
            if (claimTable) {
                const rows = Array.from(claimTable.querySelectorAll('tr')).slice(1);
                claims = rows.map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
                    if (cells.length >= 8) {
                        return {
                            jurisdiction: cells[0],
                            fromDate: cells[1], 
                            toDate: cells[2], 
                            hcpcs: cells[3],
                            units: cells[4], 
                            diagCodes: cells[5], 
                            supplier: cells[6],
                            phone: cells[7], 
                            status: cells[8], 
                            orderingNpi: cells[9] || ''
                        };
                    }
                    return null;
                }).filter(x => x !== null);
            }

            // 2. CMN Summary
            const cmnTable = findTable(['Initial Date', 'Type', 'Status']);
            let cmns = [];
            if (cmnTable) {
                const rows = Array.from(cmnTable.querySelectorAll('tr')).slice(1);
                cmns = rows.map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
                    if (cells.length >= 7) {
                        return {
                            jurisdiction: cells[0], 
                            hcpcs: cells[1], 
                            type: cells[2], 
                            length: cells[3],
                            initialDate: cells[4], 
                            revisedDate: cells[5], 
                            supplier: cells[6], 
                            status: cells[7], 
                            description: cells[8] || ''
                        };
                    }
                    return null;
                }).filter(x => x !== null);
            }

            // 3. Denied CMNs
            const dTable = findTable(['Denied', 'Initial Date']) || findTable(['Denied', 'Supplier']);
            let deniedCmns = [];
            if (dTable) {
                const rows = Array.from(dTable.querySelectorAll('tr')).slice(1);
                deniedCmns = rows.map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
                    if (cells.length >= 7) {
                        return {
                            jurisdiction: cells[0], 
                            hcpcs: cells[1], 
                            type: cells[2], 
                            length: cells[3],
                            initialDate: cells[4], 
                            revisedDate: cells[5], 
                            supplier: cells[6], 
                            status: cells[7], 
                            description: cells[8] || ''
                        };
                    }
                    return null;
                }).filter(x => x !== null);
            }

            return {
                timestamp: Date.now(),
                claims: claims,
                cmns: cmns,
                deniedCmns: deniedCmns,
                portalMetadata: {
                    npi: document.body.innerText.match(/NPI:?\\s*(\\d+)/i)?.[1] || '',
                    ptan: document.body.innerText.match(/PTAN:?\\s*(\\d+)/i)?.[1] || '',
                    medicareId: document.body.innerText.match(/Medicare ID.*?(\\w{4,})/i)?.[1] || '',
                    beneficiaryName: document.body.innerText.match(/Beneficiary Name:?\\s*([^\\n]+)/i)?.[1] || '',
                    dob: document.body.innerText.match(/Date of Birth:?\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/i)?.[1] || '',
                    dos: document.body.innerText.match(/Date Of Service:?\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/i)?.[1] || '',
                    category: document.body.innerText.match(/Product Category:?\\s*([^\\n]+)/i)?.[1] || '',
                }; // End portalMetadata
            }; // End return object
        });

        const OutputFile = path.join(process.cwd(), 'cgs_result_' + timestamp + '.json');
        fs.writeFileSync(OutputFile, JSON.stringify(results, null, 2));
        log("Results saved to: " + OutputFile);
        log("SUCCESS: Processed " + (claims?.length || 0) + " claims, " + (cmns?.length || 0) + " CMNs.");

    } catch (error: any) {
        log("FATAL: " + error.message);
        console.error(error);
        await page.screenshot({ path: path.join(process.cwd(), 'cgs_fatal_error_' + timestamp + '.png') }).catch(() => {});
        fs.writeFileSync('cgs_error_' + timestamp + '.txt', error.stack || error.message);

        // Important: Write an error result so the API knows it failed
        const errFile = path.join(process.cwd(), 'cgs_result_' + timestamp + '.json');
        if (!fs.existsSync(errFile)) {
             fs.writeFileSync(errFile, JSON.stringify({ error: error.message }));
        }
        // process.exit(1); // Do not exit process here, let the API handle it
    } finally {
        if (browser) {
            await browser.close();
        }
        log("Pipeline complete.");
    }
}

run();
`;

        fs.writeFileSync(scriptPath, automationScript);

        // 2. Run the script and wait for output
        return new Promise<NextResponse>((resolve) => {
            exec(`node ${scriptPath}`, (error, stdout, stderr) => {
                const resultFile = path.join(process.cwd(), `cgs_result_${timestamp}.json`);
                if (fs.existsSync(resultFile)) {
                    const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
                    resolve(NextResponse.json(data));
                } else {
                    const errorFile = path.join(process.cwd(), `cgs_error_${timestamp}.txt`);
                    const trackingFile = path.join(process.cwd(), `cgs_tracking_${timestamp}.txt`);
                    let errorMsg = stderr || 'Automation failed to produce results';

                    if (fs.existsSync(errorFile)) {
                        errorMsg = fs.readFileSync(errorFile, 'utf8');
                    } else if (fs.existsSync(trackingFile)) {
                        const tracking = fs.readFileSync(trackingFile, 'utf8');
                        const lines = tracking.split('\\n').filter(l => l.trim());
                        errorMsg = "Automation stopped unexpectedly. Last logs:\\n" + lines.slice(-10).join('\\n') + (stderr ? "\\nSTDERR: " + stderr : "");
                    }
                    resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
                }
            });
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
