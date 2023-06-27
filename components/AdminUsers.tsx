'use client'
import dayjs from 'dayjs'
import { Message, User } from '@prisma/client'
import { Session } from 'next-auth'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'
const pusher = new Pusher('733ce18d8e5e8379a6ca', {
	cluster: 'sa1',
})

const channel = pusher.subscribe('chat')

export function AdminUsers({
	users,
	messages,
}: {
	users: User[]
	messages: Message[]
}) {
	const [peopleTyping, setPeopleTyping] = useState<Session['user'][]>([])
	useEffect(() => {
		channel.bind('start-typing', async (data: Session['user']) => {
			const usersTyping = await (await fetch('/api/messages/typing')).json()
			setPeopleTyping(usersTyping.peopleTyping)
		})

		channel.bind('stop-typing', async (data: Session['user']) => {
			const usersTyping = await (await fetch('/api/messages/typing')).json()
			setPeopleTyping(usersTyping.peopleTyping)
		})
	}, [])

	return (
		<div className='flex gap-3 flex-wrap'>
			{users.map((user) => {
				return (
					<div
						key={user.id}
						className='bg-zinc-100 dark:bg-zinc-900 p-2 rounded-md'>
						<h1 className='text-md font-medium'>{user.username}</h1>
						<h2>{user.email}</h2>
						<p>
							Is typing?{' '}
							{peopleTyping.some((personTyping) => personTyping.id == user.id) +
								''}
						</p>
						<p>
							The user has sent{' '}
							{messages.filter((msg) => msg.userId == user.id).length} messages
						</p>
					</div>
				)
			})}
		</div>
	)
}
