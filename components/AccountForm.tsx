'use client'
import { signOut, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function AccountForm({
	user,
}: {
	user: {
		id: string
		email: string
		username: string
	}
}) {
	const {
		register,
		handleSubmit,
		// formState: {
		// errors
		// },
	} = useForm({
		values: {
			username: user?.username ?? '',
			email: user?.email ?? '',
		},
	})
	const session = useSession()
	return (
		<form
			className='space-y-4'
			onSubmit={handleSubmit((data) => {
				console.log(data)

				fetch('/api/user', {
					method: 'PATCH',
					body: JSON.stringify({ ...data, id: user.id }),
				})
				session.update()
				// .then((res) => res.json())
				// .then((res) => {
				// 	console.log(res)
				// })
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

			<AlertDialog>
				<AlertDialogTrigger className='px-6 py-3 bg-red-500 mt-5 dark:text-zinc-200 rounded-md text-zinc-100 w-full font-medium'>
					Delete Account
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								fetch('/api/user', { method: 'DELETE' })
									.then((res) => res.json())
									.then((res) => {
										console.log(res)

										signOut({ redirect: true, callbackUrl: '/' })
									})
							}}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</form>
	)
}
