import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../../db/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	pages: {
		signIn: '/login',
		newUser: '/sign-up',
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user, session, trigger }) {
			if (trigger === 'update') {
				// Note, that `session` can be any arbitrary object, remember to validate it!
				if (!token.email) {
					return token
				}
				const user = await prisma.user.findUnique({
					where: { email: token.email },
				})
				token.email = user?.email
				token.name = user?.username
				return token
			}
			if (user) {
				token.id = user.id
			}
			return token
		},
		session: async ({ session, token }) => {
			if (session?.user && token.id && token.name) {
				session.user.id = token.id as string
				session.user.username = token.name
				delete (session.user as unknown as { name?: string }).name
			}

			return { ...session }
		},
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: 'email', type: 'text', placeholder: '' },
				password: { label: 'password', type: 'password' },
			},

			name: 'Credentials',
			async authorize(credentials, req) {
				if (credentials === null) return null

				const user = await prisma.user.findUnique({
					where: {
						email: credentials!.email,
					},
				})
				if (!user) return null
				if (!bcrypt.compareSync(credentials!.password, user.password))
					return null
				const responseObject = {
					email: user.email,
					id: user.id,
					username: user.username,
					name: user.username,
				} as any
				return responseObject as User
			},
		}),

		// ...add more providers here
	],
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
