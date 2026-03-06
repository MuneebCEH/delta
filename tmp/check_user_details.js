const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const res = await client.query('SELECT * FROM "User"');
    console.log('User details:', JSON.stringify(res.rows[0], null, 2));
    client.end();
}).catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
