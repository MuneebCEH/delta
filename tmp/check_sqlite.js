const { PrismaClient } = require('@prisma/client');
const path = require('path');
const sqlite = new PrismaClient({
    datasources: {
        db: {
            url: 'file:' + path.join(__dirname, '..', 'prisma', 'dev.db')
        }
    }
});

async function check() {
    try {
        const count = await sqlite.row.count();
        console.log('SQLite Row Count:', count);

        const projects = await sqlite.project.findMany();
        console.log('SQLite Projects:', projects.map(p => ({ id: p.id, name: p.name })));
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await sqlite.$disconnect();
    }
}
check();
