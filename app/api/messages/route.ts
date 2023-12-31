import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/db/db'
import { authOptions } from '@/lib/auth'

import Pusher from 'pusher'
import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

const pusher = new Pusher({
	appId: '1619167',
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: 'sa1',
	useTLS: true,
})
export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		return new Response(
			JSON.stringify({
				error: 'Unauthenticated',
			}),
			{ status: 401 },
		)
	}
	const bodySchema = z.object({
		message: z
			.string()
			.max(1500, 'Too much text')
			.nonempty('No message provided'),
	})
	const body = bodySchema.parse(await req.json())
	const message = await prisma.message.create({
		data: {
			message: body.message,
			userId: session?.user.id,
		},
		include: {
			User: {
				select: {
					id: true,
					username: true,
				},
			},
		},
	})
	await pusher.trigger('chat', 'text-new', {
		message,
	})
	return new Response(JSON.stringify(message))
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const page = Number(searchParams.get('page')) || 0
	console.log(page, searchParams.get('page'))
	const messages = await prisma.message.findMany({
		include: {
			User: {
				select: {
					id: true,
					username: true,
				},
			},
		},
		skip: page * 30,
		take: -30,
		// orderBy: {
		// 	createdAt: 'desc',
		// },
	})
	return new Response(JSON.stringify({ messages }))
}
