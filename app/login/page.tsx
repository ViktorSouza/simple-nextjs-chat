'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})
export default function Login() {
	const {
		register,
		handleSubmit,
		// watch,
		setError,
		formState: { errors },
	} = useForm<{ password: string; email: string }>({
		resolver: zodResolver(loginSchema),
	})
	const router = useRouter()
	const session = useSession()
	useEffect(() => {
		if (session.status === 'authenticated') {
			router.push('/')
		}
	})
	return (
		<div className='sm:w-96 sm:mx-auto'>
			<form
				className='w-full'
				onSubmit={handleSubmit(async (data) => {
					signIn('credentials', { redirect: false, ...data }).then((res) => {
						if (res?.error) {
							setError('root', {
								message: 'Wrong email or password',
								type: 'pattern',
							})
							console.log(res.error)
							return
						}
						console.log('OK')

						router.push('/')
						//redirect to '/'
					})
				})}>
				<div className='flex flex-col gap-6 px-6 mt-16'>
					<h1 className='text-3xl font-medium'>Login</h1>

					{errors.root && <p className='text-red-500'>{errors.root.message}</p>}
					<div className='flex flex-col'>
						<label
							htmlFor='email'
							className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
							Email
						</label>
						<input
							type='email'
							// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
							className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent'
							{...register('email', {
								required: true,
							})}
							placeholder='youremail@example.com'
						/>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='password'
							className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
							Password
						</label>
						<input
							type='password'
							className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent'
							// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
							{...register('password', {
								required: true,
							})}
							placeholder='********'
						/>
					</div>
					<Link
						href={'still-creating'}
						className='text-right  font-medium text-sm'>
						Forget password?
					</Link>
					<div className='w-full flex items-center gap-3'>
						<Link
							className='px-6 py-3 outline-2 rounded-md  w-full text-center [box-shadow:_inset_0px_0px_0px_2px_#27272a;] font-medium'
							href={'/sign-up'}>
							Sign Up
						</Link>
						<button
							className='px-6 py-3 bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-800 rounded-md text-zinc-100 w-full font-medium'
							type='submit'>
							Login
						</button>
						{/* <p className='text-center text-zinc-500 '>or</p>
						<Link
							href={'/sign-up'}
							className=' underline underline-offset-2 w-full block text-center'>
							Create Account
						</Link> */}
					</div>
				</div>
			</form>
		</div>
	)
}
