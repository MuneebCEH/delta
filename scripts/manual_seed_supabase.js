const { Client } = require('pg');

async function seed() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected to Supabase.');

        // Get table info to see what we have
        const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables found:', tables.rows.map(t => t.table_name));

        if (tables.rows.length === 0) {
            console.log('NO TABLES FOUND! Build must have failed to push schema.');
            return;
        }

        // Clear existing data to avoid conflicts
        await client.query('DELETE FROM "WorkspaceMember"');
        await client.query('DELETE FROM "Project"');
        await client.query('DELETE FROM "Workspace"');
        await client.query('DELETE FROM "User" WHERE email = $1', ['admin@example.com']);

        const adminRes = await client.query('INSERT INTO "User" (id, email, password, role, name, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id',
            ['admin-id-' + Date.now(), 'admin@example.com', 'password123', 'ADMIN', 'Admin User']);
        const adminId = adminRes.rows[0].id;
        console.log('Admin created.');

        // Create Workspace
        const wsRes = await client.query('INSERT INTO "Workspace" (id, name, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING id',
            ['ws-id-' + Date.now(), 'Default Workspace']);
        const wsId = wsRes.rows[0].id;
        console.log('Workspace created.');

        // Create Member
        await client.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role) VALUES ($1, $2, $3, $4)',
            ['wm-id-' + Date.now(), adminId, wsId, 'OWNER']);
        console.log('Member linked.');

        // Create Project
        await client.query('INSERT INTO "Project" (id, name, "workspaceId", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
            ['proj-id-' + Date.now(), 'Medical Records', wsId]);
        console.log('Project created.');

        console.log('LOGIN SHOULD NOW WORK!');
    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        await client.end();
    }
}

seed();
