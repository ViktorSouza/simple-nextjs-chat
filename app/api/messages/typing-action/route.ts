import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import Pusher from 'pusher'
import { z } from 'zod'
const pusher = new Pusher({
	appId: '1619167',
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: 'sa1',
	useTLS: true,
})
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
	await pusher.trigger('chat', `${action}-typing`, session.user)
	return new Response('OK')
}
