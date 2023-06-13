import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '../../../db/db'
import { authOptions } from '../auth/[...nextauth]/route'

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
	return new Response(JSON.stringify(message))
}

export async function GET() {
	const messages = await prisma.message.findMany({
		include: {
			User: {
				select: {
					id: true,
					username: true,
				},
			},
		},
	})
	return new Response(JSON.stringify({ messages }))
}
