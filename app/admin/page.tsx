import { prisma } from '@/db/db'

export const revalidate = 1
export default async function Admin() {
	const totalMessages = await prisma.message.count()
	const totalUsers = await prisma.user.count()
	const users = await prisma.user.findMany()
	return (
		<div className='p-4'>
			<span className='text-red-500'>*STILL CREATING</span>
			<h1 className='text-3xl font-medium'>Admin</h1>
			<h2 className='text-2xl font-medium'>Total Messages</h2>
			<div>{totalMessages}</div>
			<div>{totalUsers}</div>
			<div>
				<h2 className='text-2xl font-medium'>Users</h2>
				<div className='flex gap-3 flex-wrap'>
					{users.map((user) => {
						return (
							<div
								key={user.id}
								className='bg-zinc-100'>
								<h1>{user.username}</h1>
								<h1>{user.email}</h1>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
