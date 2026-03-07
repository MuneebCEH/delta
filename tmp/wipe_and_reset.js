const { Client } = require('pg');

async function wipe() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();
        console.log('Connected to Supabase.');

        const tables = ['RowHistory', 'Comment', 'Row', 'View', 'Column', 'Sheet', 'Project'];
        for (const table of tables) {
            console.log(`Wiping table: ${table}`);
            await pg.query(`DELETE FROM "${table}"`);
        }

        const wsRes = await pg.query('SELECT id FROM "Workspace" LIMIT 1');
        const workspaceId = wsRes.rows[0]?.id;

        if (workspaceId) {
            console.log('Creating fresh structure with CGM PTS and BRX PTs formats...');
            const projId = 'proj-' + Date.now();
            await pg.query('INSERT INTO "Project" (id, name, description, "workspaceId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
                [projId, 'Medical Records', 'Fresh start', workspaceId]);

            const sheets = [
                "Patients", "MED-B - Call Log", "CGM PTS", "BRX PTs", "Audits Records Request",
                "EOBs", "EOB Denial", "Overpayment", "Complaint Log",
                "CGM-Upcoming Orders", "CGM - Call Log", "Questions Pending Answers"
            ];

            // Define Columns for Patients
            const patientCols = [
                { name: "Patient Name", type: "TEXT" }, { name: "DOS", type: "DATE" }, { name: "Returned", type: "CHECKBOX" },
                { name: "Complete", type: "CHECKBOX" }, { name: "Packing Slip", type: "CHECKBOX" }, { name: "Has Voice Record", type: "CHECKBOX" },
                { name: "RX", type: "CHECKBOX" }, { name: "Clinical Notes", type: "CHECKBOX" }, { name: "Same/Similar", type: "CHECKBOX" },
                { name: "POD", type: "CHECKBOX" }, { name: "Attachments", type: "FILE" }, { name: "Tracking", type: "TEXT" },
                { name: "Tracking Status", type: "SELECT" }, { name: "Delivered Date", type: "DATE" }, { name: "Notes", type: "LONG_TEXT" },
                { name: "Address", type: "TEXT" }, { name: "City", type: "TEXT" }, { name: "State", type: "TEXT" },
                { name: "Zip", type: "TEXT" }, { name: "DOB", type: "DATE" }, { name: "Patient ID", type: "TEXT" },
                { name: "Item", type: "TEXT" }, { name: "Product Type", type: "TEXT" }, { name: "Product", type: "SELECT" },
                { name: "Billed", type: "CHECKBOX" }, { name: "Paid", type: "CURRENCY" }, { name: "Amount", type: "CURRENCY" },
                { name: "Secondary Pay", type: "CURRENCY" }, { name: "Deductible", type: "CURRENCY" }, { name: "Billing Notes", type: "LONG_TEXT" }
            ];

            // Define Columns for CGM/BRX
            const logCols = [
                { name: "Name", type: "TEXT" }, { name: "Date in Dropbox", type: "DATE" }, { name: "Completed", type: "CHECKBOX" },
                { name: "Voice Record", type: "CHECKBOX" }, { name: "Clinical Notes", type: "CHECKBOX" }, { name: "RX", type: "CHECKBOX" },
                { name: "No Match", type: "CHECKBOX" }, { name: "Packing Slip", type: "CHECKBOX" }, { name: "POD", type: "CHECKBOX" },
                { name: "Notes", type: "LONG_TEXT" }, { name: "Tracking Number", type: "TEXT" },
                { name: "Delivery Status", type: "SELECT", options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
                { name: "Delivered Date", type: "DATE" }, { name: "Refill Due", type: "DATE" }, { name: "Attachments", type: "FILE" },
                { name: "Returned", type: "CHECKBOX" }, { name: "Medicare ID", type: "TEXT" }, { name: "DOB", type: "DATE" },
                { name: "Address", type: "TEXT" }, { name: "City", type: "TEXT" }, { name: "State", type: "TEXT" }, { name: "Zip Code", type: "TEXT" }
            ];

            for (const [si, name] of sheets.entries()) {
                const sheetId = 'sheet-' + si + '-' + Date.now();
                await pg.query('INSERT INTO "Sheet" (id, name, "projectId", "order", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
                    [sheetId, name, projId, si]);

                let targetCols = [];
                if (name === "Patients") targetCols = patientCols;
                else if (name === "CGM PTS" || name === "BRX PTs") targetCols = logCols;

                for (const [ci, c] of targetCols.entries()) {
                    await pg.query('INSERT INTO "Column" (id, "sheetId", name, type, "order", width, options) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        ['col-' + si + '-' + ci + '-' + Date.now(), sheetId, c.name, c.type, ci, 150, c.options ? JSON.stringify(c.options) : null]);
                }
            }
            console.log('Reset Complete.');
        }
    } catch (e) {
        console.error('Failed:', e);
    } finally {
        await pg.end();
    }
}
wipe();
