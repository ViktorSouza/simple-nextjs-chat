import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/db/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/lib/auth'
import { getSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'

const requestSchema = z.object({
	email: z.string().nonempty('Please provide an eamil').email('Invalid email'),
	username: z
		.string()
		.max(15, 'Username too big')
		.nonempty('Please, provide an username'),
	password: z.string().nonempty('Please, provide a password'),
})

export async function POST(req: Request) {
	const body = requestSchema.parse(await req.json())
	body.password = bcrypt.hashSync(body.password, 10)
	const user = await prisma.user.create({
		data: {
			...body,
		},
	})
	console.log(user)
	return new Response(JSON.stringify(user), { status: 201 })
}

export async function PATCH(req: Request) {
	const session = await getServerSession(authOptions)

	const body = requestSchema
		//TODO put email as well
		.extend({ id: z.string().nonempty('Invalid id') })
		.omit({ password: true })
		.parse(await req.json())

	if (session?.user.id !== body.id)
		return new Response(
			JSON.stringify({ message: 'You are not authorized to make this' }),
			{ status: 401 },
		)

	const candidateUser = await prisma.user.findUnique({
		where: {
			id: body.id,
		},
	})

	if (!candidateUser)
		return new Response(JSON.stringify({ message: 'User not found' }), {
			status: 404,
		})
	const user = await prisma.user.update({
		data: {
			email: body.email,
			username: body.username,
		},
		where: {
			id: body.id,
		},
	})

	return new Response(JSON.stringify(user), { status: 200 })
}

export async function DELETE(req: Request, res: Response) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return new Response(JSON.stringify({ message: 'You must be logged in' }))
	}
	const deletedUser = await prisma.user.delete({
		where: {
			id: session.user.id,
		},
	})

	return new Response(
		JSON.stringify({
			message: 'OK',
		}),
		{ status: 200 },
	)
}
