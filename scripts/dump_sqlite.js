const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tables = ['User', 'Workspace', 'WorkspaceMember', 'Project', 'Sheet', 'Column', 'Row'];
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
