const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'WorkspaceMember'");
    console.log('Columns:', res.rows.map(r => r.column_name));
    client.end();
}).catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
