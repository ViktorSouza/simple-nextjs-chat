'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	username: z.string().nonempty('Please provide a username').max(15),
})
export default function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{
		password: string
		email: string
		username: string
	}>({
		resolver: zodResolver(signUpSchema),
	})
	console.log(errors)
	return (
		<div className='lg:w-96 lg:mx-auto'>
			<form
				className='w-full'
				onSubmit={handleSubmit((data) => {
					fetch('/api/user', {
						method: 'POST',
						body: JSON.stringify({
							username: data.username,
							email: data.email,
							password: data.password,
						}),
					})
						.then((res) => res.json())
						.then((res) => {
							signIn('credentials', {
								callbackUrl: '/',
								redirect: true,
								...data,
							})
						})
						.catch(console.log)
				})}>
				<div className='flex flex-col gap-6 px-6 mt-16'>
					<div>
						<h1 className='text-3xl font-medium'>Sign Up</h1>
					</div>

					<div className='flex flex-col'>
						<label
							htmlFor='email'
							className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
							Username
						</label>
						<input
							type='text'
							// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
							// className='outline-none ring-zinc-800 focus:ring-2  dark:bg-zinc-900 rounded-md w-full px-3 py-3 bg-zinc-200  focus:bg-transparent'
							className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full px-3 py-3 bg-zinc-200 dark:bg-transparent'
							{...register('username', {
								required: true,
								maxLength: 15,
							})}
							placeholder='a_really_cool_username'
						/>
						{errors.username && <p>{errors.username.message}</p>}
					</div>

					<div className='flex flex-col'>
						<label
							htmlFor='email'
							className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
							Email
						</label>
						<input
							type='email'
							// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
							// className='outline-none ring-zinc-800 focus:ring-2  dark:bg-zinc-900 rounded-md w-full px-3 py-3 bg-zinc-200  focus:bg-transparent'
							className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full px-3 py-3 bg-zinc-200 dark:bg-transparent'
							{...register('email', {
								validate: (data) => {
									return data
								},
							})}
							placeholder='youremail@example.com'
						/>
						{errors.email && <p>{errors.email.message}</p>}
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='password'
							className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
							Password
						</label>
						<input
							type='password'
							// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
							// className='outline-none ring-zinc-800 focus:ring-2  dark:bg-zinc-900 rounded-md w-full px-3 py-3 bg-zinc-200  focus:bg-transparent'
							className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full px-3 py-3 bg-zinc-200 dark:bg-transparent'
							{...register('password')}
							placeholder='********'
						/>
						{errors.password && <p>{errors.password.message}</p>}
					</div>
					<button
						// className='px-6 py-2 bg-sky-500 rounded-full text-zinc-100 w-full'
						className='px-6 py-3 bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-800 rounded-md text-zinc-100 w-full font-medium'
						type='submit'>
						Sign Up
					</button>
					<span className='text-sm text-zinc-500 font-medium'>
						Already have an account?{' '}
						<Link
							className='text-zinc-800 dark:text-zinc-200'
							href={'/login'}>
							Sign In
						</Link>
					</span>
				</div>
			</form>
		</div>
	)
}
