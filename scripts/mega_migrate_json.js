const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();
        console.log('Connected to Supabase PostgreSQL.');

        async function insertBatch(table, dataArray) {
            if (!dataArray || dataArray.length === 0) return;
            console.log(`  Migrating ${dataArray.length} items to ${table}...`);

            let success = 0;
            let failed = 0;

            for (const item of dataArray) {
                try {
                    const keys = Object.keys(item);
                    const values = keys.map(k => {
                        let v = item[k];
                        if (v === null) return null;
                        if (['createdAt', 'updatedAt', 'expires', 'deliveredDate', 'dos', 'DOS'].includes(k) || k.toLowerCase().includes('date')) {
                            if (typeof v === 'number') return new Date(v).toISOString();
                        }
                        if (['order', 'width', 'expires_at'].includes(k)) return parseInt(v) || 0;
                        if (['data', 'options', 'config'].includes(k)) {
                            if (typeof v === 'string') {
                                try { return JSON.parse(v); } catch (e) { return v; }
                            }
                        }
                        return v;
                    });

                    const query = `INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(',')}) 
                                   VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) 
                                   ON CONFLICT (id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(',')} `;

                    await pg.query(query, values);
                    success++;
                } catch (e) {
                    failed++;
                    if (failed < 5) console.error(`  Error in ${table}:`, e.message);
                }
            }
            console.log(`    Result: ${success} success, ${failed} failed.`);
        }

        const tables = [
            { name: 'User', file: 'user_dump.json' },
            { name: 'Workspace', file: 'workspace_dump.json' },
            { name: 'WorkspaceMember', file: 'member_dump.json' },
            { name: 'Project', file: 'project_dump.json' },
            { name: 'Sheet', file: 'sheet_dump.json' },
            { name: 'Column', file: 'column_dump.json' },
            { name: 'Row', file: 'row_dump.json' }
        ];

        for (const t of tables) {
            const filePath = path.join(__dirname, '..', 'tmp', t.file);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                await insertBatch(t.name, data);
            }
        }

        console.log('*** MEGA MIGRATION COMPLETE! ***');

    } catch (e) {
        console.error('Migration Failed:', e);
    } finally {
        await pg.end();
    }
}

migrate();
