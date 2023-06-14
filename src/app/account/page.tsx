// 'use client'
import { redirect } from 'next/navigation'
// import { useSession } from 'next-auth/react'
import { getCurrentUser } from '../../lib/session'
import { AccountForm } from '../../components/AccountForm'

export default async function Account() {
	const user = await getCurrentUser()
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
	await sleep(2000)
	// {
	// required: true,
	// onUnauthenticated: () => {
	// redirect('/')
	// },
	// }
	// if (session.status !== 'authenticated') {
	// 	return (
	// 		<div className='bi bi-dot pt-5 animate-spin animate-bounce mx-auto'></div>
	// 	)
	// }
	return (
		<section className='p-4'>
			<span className='text-red-500'>*STILL CREATING</span>
			<h1 className='text-3xl font-medium'>Account</h1>
			<AccountForm
				user={{
					id: user?.id ?? '',
					email: user?.email ?? '',
					username: user?.username ?? '',
				}}
			/>
			<button className='px-6 py-3 bg-red-500 mt-5 dark:text-zinc-200 rounded-md text-zinc-100 w-full font-medium'>
				Delete Account
			</button>
		</section>
	)
}
