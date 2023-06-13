'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function Account() {
	const router = useRouter()
	const session = useSession({
		required: true,
		onUnauthenticated: () => {
			router.push('/')
		},
	})
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		values: {
			username: session.data?.user.username,
			email: session.data?.user?.email,
		},
	})
	if (session.status !== 'authenticated') {
		return (
			<div className='bi bi-dot pt-5 animate-spin animate-bounce mx-auto'></div>
		)
	}
	return (
		<section className='p-4'>
			<span className='text-red-500'>*STILL CREATING</span>
			<h1 className='text-3xl font-medium'>Account</h1>
			<form
				className='space-y-4'
				onSubmit={handleSubmit((data) => {
					console.log(data)

					fetch('/api/user', {
						method: 'PATCH',
						body: JSON.stringify({ ...data, id: session?.data?.user?.id }),
					})
						.then((res) => res.json())
						.then((res) => {
							console.log(res)
							session.update()
						})
				})}>
				<div className='flex flex-col'>
					<label
						htmlFor='username'
						className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
						Username
					</label>
					<input
						type='username'
						className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent'
						// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
						{...register('username', { required: true })}
						// placeholder={session.data?.user.username || ''}
					/>
				</div>
				<div className='flex flex-col'>
					<label
						htmlFor='email'
						className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
						Email
					</label>
					<input
						type='email'
						className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent'
						{...register('email', {
							required: true,
						})}
					/>
				</div>
				<button className='px-6 py-3 bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-800 rounded-md text-zinc-100 w-full font-medium'>
					Apply Changes
				</button>
			</form>
			<button className='px-6 py-3 bg-red-500 mt-5 dark:text-zinc-200 rounded-md text-zinc-100 w-full font-medium'>
				Delete Account
			</button>
		</section>
	)
}
