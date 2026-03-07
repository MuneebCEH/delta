import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')

    if (!channelId) return NextResponse.json({ error: 'Missing channelId' }, { status: 400 })

    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const messages = await prisma.chatMessage.findMany({
            where: { channelId },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: 100
        })

        return NextResponse.json(messages)
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { channelId, content } = await req.json()

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const message = await prisma.chatMessage.create({
            data: {
                content,
                channelId,
                userId: user.id
            },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            }
        })

        return NextResponse.json(message)
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
