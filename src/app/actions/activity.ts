"use server"

import { prisma } from "@/lib/prisma"

export async function getLiveActivity(limit = 10) {
    try {
        const activities = await prisma.row.findMany({
            take: limit,
            orderBy: { updatedAt: 'desc' },
            include: {
                sheet: {
                    select: {
                        name: true,
                        project: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        return activities.map(row => {
            const data = row.data as Record<string, any> || {}
            const ptName = data['patientName'] || data['name'] || Object.values(data).find(v => typeof v === 'string' && v.length > 5) || "Unnamed Record"

            // Determine type/icon based on sheet name
            let type = 'update'
            if (row.sheet.name.includes('Patients')) type = 'patient'
            if (['CGM PTS', 'BRX PTs', 'CGM PST'].includes(row.sheet.name)) type = 'return'

            return {
                id: row.id,
                title: `${type === 'patient' ? 'Patient' : 'Record'} Updated`,
                description: `${ptName} in ${row.sheet.name} (${row.sheet.project.name})`,
                time: row.updatedAt.toISOString(),
                unread: new Date().getTime() - new Date(row.updatedAt).getTime() < 10 * 60 * 1000, // unread if less than 10 mins old
                type: type
            }
        })
    } catch (err) {
        console.error("Failed to fetch live activity:", err)
        return []
    }
}
