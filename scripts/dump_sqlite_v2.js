const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tables = ['User', 'Workspace', 'WorkspaceMember', 'Project', 'Sheet', 'Column'];
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

tables.forEach(table => {
    try {
        console.log(`Dumping ${table}...`);
        const json = execSync(`sqlite3 -json "${dbPath}" "SELECT * FROM \\"${table}\\";"`).toString('utf8');
        fs.writeFileSync(path.join(__dirname, '..', 'tmp', `${table.toLowerCase()}_dump.json`), json);
    } catch (e) {
        console.error(`Error dumping ${table}:`, e.message);
    }
});

// Large Row table in chunks
try {
    console.log(`Dumping Row in chunks...`);
    let allRows = [];
    for (let i = 0; i < 2000; i += 500) {
        const chunk = execSync(`sqlite3 -json "${dbPath}" "SELECT * FROM \\"Row\\" LIMIT 500 OFFSET ${i};"`).toString('utf8');
        if (chunk && chunk.trim()) {
            allRows = allRows.concat(JSON.parse(chunk));
        }
    }
    fs.writeFileSync(path.join(__dirname, '..', 'tmp', `row_dump.json`), JSON.stringify(allRows));
    console.log(`Dumping Row Complete: ${allRows.length} rows.`);
} catch (e) {
    console.error(`Error dumping Row chunks:`, e.message);
}
