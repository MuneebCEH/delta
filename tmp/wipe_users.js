const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    await client.query('DELETE FROM "WorkspaceMember" CASCADE');
    await client.query('DELETE FROM "User" CASCADE');
    console.log('Wiped User/Member tables.');
    client.end();
}).catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
