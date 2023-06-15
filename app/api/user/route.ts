import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../db/db'

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
	const body = requestSchema
		//TODO add an user verification
		//TODO put email as well
		.extend({ id: z.string().nonempty('Invalid id') })
		.omit({ password: true })
		.parse(await req.json())
	const user = await prisma.user.update({
		data: {
			email: body.email,
			username: body.username,
		},
		where: {
			id: body.id,
		},
	})
	console.log(user)

	return new Response(JSON.stringify(user), { status: 200 })
}
