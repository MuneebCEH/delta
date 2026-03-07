import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const channels = await prisma.chatChannel.findMany({
            orderBy: { name: 'asc' }
        })

        // Seed a default channel if none exist
        if (channels.length === 0) {
            const defaultChannel = await prisma.chatChannel.create({
                data: {
                    name: 'General Chat',
                    description: 'Main room for team communication'
                }
            })
            return NextResponse.json([defaultChannel])
        }

        return NextResponse.json(channels)
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { name, description } = await req.json()
        const channel = await prisma.chatChannel.create({
            data: { name, description }
        })

        return NextResponse.json(channel)
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
