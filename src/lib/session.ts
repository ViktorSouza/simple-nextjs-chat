import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextAuthOptions } from 'next-auth'

export async function getCurrentUser() {
	const session = await getServerSession<
		NextAuthOptions,
		{
			user: {
				id: string
				email: string
				username: string
			}
		}
	>(authOptions)
	return session?.user
}
