'use client'

import { Session } from 'next-auth'
import { SessionContextValue } from 'next-auth/react'
import useTheme from '../hooks/useTheme'

export function MessageBox({
	message,
	session,
}: {
	message: {
		message: string
		id: string
		User: { username: string }
		createdAt: string
	}
	session: SessionContextValue
}) {
	const isUsernameMatching =
		message.User.username === session.data?.user.username
	// const [theme, setTheme] = useTheme()
	return (
		<div
			className={`w-3/4 lg:w-5/12 p-2 rounded-md bg-gray-200  dark:bg-zinc-900 mb-5 ${
				isUsernameMatching
					? 'self-end rounded-t-none !rounded-l-md text-zinc-100 !bg-zinc-900 dark:!bg-zinc-200 dark:text-zinc-800'
					: 'self-start rounded-t-none !rounded-r-md '
			}`}
			key={message.id}>
			<div className='flex justify-between mb-1'>
				<h2
					className='text-xs font-semibold'
					style={{
						color: `hsl(${message.User.username
							.split('')
							.reduce(
								(prev, curr, index) => prev + curr.charCodeAt(0) * 10,
								0,
							)},50%,50%)`,
					}}>
					{message.User.username}
				</h2>
				<span className='text-xs font-light'>
					{new Date(message.createdAt).toLocaleTimeString('en-US', {
						hour12: false,
						hour: '2-digit',
						minute: '2-digit',
					})}
				</span>
			</div>
			<p className='leading-5 break-words text-sm'>{message.message}</p>
		</div>
	)
}
