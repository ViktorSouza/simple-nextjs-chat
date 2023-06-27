import { prisma } from '@/db/db'
import { AdminUsers } from '../../components/AdminUsers'
export const revalidate = 1

export default async function Admin() {
	const totalMessages = await prisma.message.count()
	const bah = Date.now()
	const totalUsers = await prisma.user.count()
	const users = await prisma.user.findMany()
	const messages = await prisma.message.findMany()

	return (
		<div className='p-4'>
			{bah}
			<span className='text-red-500'>*STILL CREATING</span>
			<h1 className='text-3xl font-medium'>Admin</h1>
			<p>
				Total Messages: <span className='font-medium'>{totalMessages}</span>
			</p>
			<p>
				Total Users: <span className='font-medium'>{totalUsers}</span>
			</p>
			<div>
				<h2 className='text-2xl font-medium'>Users</h2>
				<AdminUsers
					users={users}
					messages={messages}
				/>
			</div>
		</div>
	)
}
