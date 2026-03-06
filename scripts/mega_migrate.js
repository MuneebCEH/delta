const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
const path = require('path');

async function migrate() {
    // 1. Setup Connections
    // Standard Supabase Direct URL
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

    // Using a separate Prisma instance for SQLite
    // Note: We'll use the pg client for insertion to be faster and more direct
    const sqlite = new PrismaClient({
        datasources: {
            db: { url: 'file:' + path.join(__dirname, '..', 'prisma', 'dev.db') }
        }
    });

    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();
        console.log('Connected to Supabase PostgreSQL.');

        async function insertDynamic(table, data) {
            const keys = Object.keys(data).filter(k => !['lastModifiedBy', 'lastModifiedBy_id', 'comments', 'history', 'sheets', 'columns', 'rows', 'workspace', 'projects', 'members'].includes(k));

            // Map camelCase to snake_case if necessary? 
            // Our schema in both is camelCase for now.
            const values = keys.map(k => {
                const val = data[k];
                if (val instanceof Date) return val.toISOString();
                if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                return val;
            });

            const query = `INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(',')} `;

            await pg.query(query, values);
        }

        // --- MIGRATION PHASES ---

        console.log('--- Phase 1: Workspaces ---');
        const workspaces = await sqlite.workspace.findMany();
        for (const w of workspaces) {
            console.log(`  Migrating Workspace: ${w.name}`);
            await insertDynamic('Workspace', w);
        }

        console.log('--- Phase 2: Users ---');
        const users = await sqlite.user.findMany();
        for (const u of users) {
            console.log(`  Migrating User: ${u.email}`);
            await insertDynamic('User', u);
        }

        console.log('--- Phase 3: Workspace Members ---');
        const members = await sqlite.workspaceMember.findMany();
        for (const m of members) {
            await insertDynamic('WorkspaceMember', m);
        }

        console.log('--- Phase 4: Projects ---');
        const projects = await sqlite.project.findMany();
        for (const p of projects) {
            console.log(`  Migrating Project: ${p.name}`);
            await insertDynamic('Project', p);
        }

        console.log('--- Phase 5: Sheets ---');
        const sheets = await sqlite.sheet.findMany();
        for (const s of sheets) {
            console.log(`  Migrating Sheet: ${s.name} in project ${s.projectId}`);
            await insertDynamic('Sheet', s);
        }

        console.log('--- Phase 6: Columns ---');
        const columns = await sqlite.column.findMany();
        for (const c of columns) {
            await insertDynamic('Column', c);
        }

        console.log('--- Phase 7: Rows (The Big One) ---');
        const rowsCount = await sqlite.row.count();
        console.log(`  Rows to migrate: ${rowsCount}`);

        // Chunked row migration for performance
        const batchSize = 100;
        for (let i = 0; i < rowsCount; i += batchSize) {
            const rows = await sqlite.row.findMany({
                skip: i,
                take: batchSize
            });
            for (const r of rows) {
                await insertDynamic('Row', r);
            }
            if (i % 500 === 0) console.log(`    ... ${i} rows processed.`);
        }

        console.log('--- Phase 8: Cleaning Admin Link ---');
        // Ensure admin@example.com is in the workspace
        // This is a safety check for the user to be able to login
        const admin = await sqlite.user.findFirst({ where: { email: 'admin@example.com' } });
        if (admin && workspaces[0]) {
            await pg.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                ['link-' + Date.now(), admin.id, workspaces[0].id, 'OWNER']);
        }

        console.log('*** MEGA MIGRATION COMPLETE! ***');
        console.log('Your Vercel app should now show real data.');

    } catch (e) {
        console.error('Migration Failed:', e);
    } finally {
        await pg.end();
        await sqlite.$disconnect();
    }
}

migrate();
