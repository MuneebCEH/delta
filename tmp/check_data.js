const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const totalProjects = await prisma.project.count();
        const totalSheets = await prisma.sheet.count();
        const totalRows = await prisma.row.count();

        console.log(`Total Projects: ${totalProjects}`);
        console.log(`Total Sheets: ${totalSheets}`);
        console.log(`Total Rows: ${totalRows}`);

        const patientSheets = await prisma.sheet.findMany({
            where: { name: { contains: 'Patient', mode: 'insensitive' } },
            include: {
                _count: { select: { rows: true } },
                columns: true
            }
        });

        console.log('\nPatient Sheets:');
        patientSheets.forEach(s => {
            console.log(`- ${s.name} (ID: ${s.id}): ${s._count.rows} rows`);
        });

        const rows = await prisma.row.findMany({ take: 20 });
        console.log('\nSample Row Data Structure:', JSON.stringify(rows[0]?.data, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
