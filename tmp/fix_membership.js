const { Client } = require('pg');

async function fixMembership() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();

        // 1. Get the admin user
        const userRes = await pg.query('SELECT id FROM "User" WHERE email = $1', ['admin@example.com']);
        const userId = userRes.rows[0]?.id;

        // 2. Get the workspace
        const wsRes = await pg.query('SELECT id FROM "Workspace" LIMIT 1');
        const workspaceId = wsRes.rows[0]?.id;

        if (userId && workspaceId) {
            console.log(`Linking Admin (${userId}) to Workspace (${workspaceId})`);
            await pg.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                ['wm-link-' + Date.now(), userId, workspaceId, 'OWNER']);
            console.log('Membership restored.');
        } else {
            console.error('User or Workspace not found. Creating them...');
            // In case they are missing
            const uId = 'admin-id-' + Date.now();
            await pg.query('INSERT INTO "User" (id, email, password, role, name, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT DO NOTHING',
                [uId, 'admin@example.com', 'password123', 'ADMIN', 'Admin User']);

            const wId = 'ws-id-' + Date.now();
            await pg.query('INSERT INTO "Workspace" (id, name, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) ON CONFLICT DO NOTHING',
                [wId, 'Default Workspace']);

            await pg.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                ['wm-link-' + Date.now(), uId, wId, 'OWNER']);
        }

    } catch (e) {
        console.error('Fix Failed:', e);
    } finally {
        await pg.end();
    }
}
fixMembership();
