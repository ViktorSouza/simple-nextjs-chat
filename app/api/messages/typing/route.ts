import { Session, getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import Pusher from 'pusher'
import { z } from 'zod'
import { prisma } from '../../../../db/db'

// let peopleTyping: Session['user'][] = []

const pusher = new Pusher({
	appId: '1619167',
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: 'sa1',
	useTLS: true,
})
export async function GET(req: Request, res: Response) {
	const usersTyping = await prisma.user.findMany({
		where: {
			isTyping: true,
			lastTypingActivity: {
				gt: new Date(Date.now() - 10 * 1000), // 10 seconds ago
			},
		},
		select: {
			email: true,
			username: true,
			isTyping: true,
			id: true,
		},
	})

	return new Response(JSON.stringify({ peopleTyping: usersTyping }))
}

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions)
	const actionSchema = z.object({ action: z.enum(['start', 'stop']) })
	const { action } = actionSchema.parse(await req.json())
	if (!session) {
		return new Response(
			JSON.stringify({ message: 'You must log in to use this route' }),
			{ status: 401 },
		)
	}
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
	})
	const isUserTyping =
		user?.isTyping &&
		user?.lastTypingActivity > new Date(Date.now() - 10 * 1000) //Check if the last activity has less than 10 seconds

	if (action === 'start') {
		await prisma.user.update({
			where: { id: session.user.id },
			data: {
				isTyping: true,
				lastTypingActivity: new Date(Date.now()),
			},
		})
		await pusher.trigger('chat', `start-typing`, session.user)
	}
	if (action === 'stop' && isUserTyping) {
		await prisma.user.update({
			where: { id: session.user.id },
			data: {
				isTyping: false,
				// lastTypingActivity: new Date(Date.now()),
			},
		})
		await pusher.trigger('chat', `stop-typing`, session.user)
	}
	return new Response('OK')
}
