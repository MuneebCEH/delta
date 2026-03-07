const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const projects = await client.query('SELECT name, "workspaceId" FROM "Project"');
    console.log('Projects in DB:', projects.rows);
    const members = await client.query('SELECT "userId", "workspaceId" FROM "WorkspaceMember"');
    console.log('Members in DB:', members.rows);
    client.end();
});
