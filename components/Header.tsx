'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import useTheme from '../hooks/useTheme'

export const Header = () => {
	const session = useSession()
	const [theme, setTheme] = useTheme()
	return (
		<header className='p-4 border-b border-zinc-200/50 bg-white/50 dark:bg-zinc-950/50 dark:border-zinc-800/50 backdrop-blur-sm flex justify-between items-center'>
			<ul className='flex gap-3 items-center'>
				<li>
					<Link
						href={'/'}
						className='flex items-center gap-2'>
						<i className='bi bi-chat-dots text-3xl'></i>
						<h1 className='font-semibold text-xl'>Chat</h1>
					</Link>
				</li>
				{session.status === 'unauthenticated' && (
					<li>
						<Link href={'/login'}>Login</Link>
					</li>
				)}
			</ul>
			<div className='relative'>
				<button className='peer'>
					<i className='bi bi-three-dots-vertical '></i>
				</button>
				<ul
					role='menu'
					className='peer-focus-within:block focus:block  focus-within:block hover:block peer-focus:block hidden absolute shadow-lg bg-zinc-50 dark:bg-zinc-900 overflow-hidden right-0 rounded-md'>
					{session.status === 'authenticated' && (
						<li
							role='menuitem'
							className='hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors px-6 py-2'>
							<Link
								href={'/account'}
								className='flex items-center gap-2'>
								<i className='bi bi-person-circle'></i> Account
							</Link>
						</li>
					)}
					<li
						role='menuitem'
						className='hover:bg-zinc-200 px-6 py-2 dark:hover:bg-zinc-800 rounded-md transition-colors'>
						<Link
							className='flex items-center gap-2'
							href={'/settings'}>
							<i className='bi bi-gear'></i>
							Settings
						</Link>
					</li>
					<hr className='dark:border-zinc-800' />
					<li
						role='menuitem'
						className='hover:bg-zinc-200 px-6 py-2 dark:hover:bg-zinc-800 rounded-md transition-colors'>
						<button
							className='flex items-center gap-2'
							onClick={() => {
								signOut({
									redirect: true,
									callbackUrl: '/login',
								})
							}}>
							<i className='bi bi-box-arrow-left'></i>
							Logout
						</button>
					</li>
				</ul>
			</div>
		</header>
	)
}
