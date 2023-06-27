'use client'
import { useSession } from 'next-auth/react'
import Pusher from 'pusher-js'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MessageBox } from '@/components/Message'
import { Session } from 'next-auth'
import { bounce, throttle } from '../lib/utils'
import { MessageInput } from '../components/MessageInput'
import { SomeoneIsTyping } from '../components/SomeoneIsTyping'

const pusher = new Pusher('733ce18d8e5e8379a6ca', {
	cluster: 'sa1',
})

const channel = pusher.subscribe('chat')
export default function Home() {
	const session = useSession({
		required: true,
	})
	const [lastTypingActivity, setLastTypingActivity] = useState<Date>(
		new Date(0),
	)
	const [peopleTyping, setPeopleTyping] = useState<Session['user'][]>([])
	const typingDebounce = useMemo(() => bounce(() => getTypers(), 10000), [])
	function getTypers() {
		fetch('/api/messages/typing')
			.then((res) => res.json())
			.then((res) => {
				setPeopleTyping(res.peopleTyping)
			})
	}

	const textRef = useRef<HTMLDivElement>(null)

	type IMessage = {
		message: string
		id: string
		User: {
			username: string
			id: string
		}
		createdAt: string
	}

	const [messages, setMessages] = useState<IMessage[]>([])

	const messagesRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		channel.bind('text-new', (data: { message: IMessage }) => {
			setMessages((curr) => [...curr, data.message])
			setPeopleTyping((prev) =>
				prev.filter((value) => value.id !== data.message.User.id),
			)
		})
		channel.bind('start-typing', async (data: Session['user']) => {
			const usersTyping = await (await fetch('/api/messages/typing')).json()
			setPeopleTyping(usersTyping.peopleTyping)
			typingDebounce()
		})

		channel.bind('stop-typing', async (data: Session['user']) => {
			const usersTyping = await (await fetch('/api/messages/typing')).json()
			setPeopleTyping(usersTyping.peopleTyping)
			typingDebounce()
		})
		typingDebounce()
		getTypers()
	}, [])

	useEffect(() => {
		messagesRef.current?.scrollTo({
			behavior: 'smooth',
			top: messagesRef.current.scrollHeight - 1,
		})
	}, [messages, peopleTyping])

	useEffect(() => {
		if (session.status === 'authenticated') {
			fetch('/api/messages')
				.then((e) => e.json())
				.then((data) => {
					setMessages(data.messages)
				})
				.catch(console.log)
		}
	}, [session])

	const throttleMessageSending = throttle(
		(e: React.FormEvent<HTMLDivElement>) => {
			typingDebounce()
			if (
				e.currentTarget.innerText &&
				lastTypingActivity < new Date(Date.now() - 1000) //If the last typing activity is longer than 1 second
			) {
				fetch('/api/messages/typing', {
					method: 'POST',
					body: JSON.stringify({ action: 'start' }),
				})
				setLastTypingActivity(new Date(Date.now()))
			}
			if (!e.currentTarget.innerText) {
				fetch('/api/messages/typing', {
					method: 'POST',
					body: JSON.stringify({ action: 'stop' }),
				})
			}
		},
		500,
	)

	return (
		<>
			<section
				className='w-full overflow-auto flex-grow  bg-white dark:bg-zinc-950 px-4 py-2'
				ref={messagesRef}>
				<div className=' flex flex-col shrink-[3] full'>
					{messages.map((message) => (
						<MessageBox
							key={message.id}
							message={message}
							session={session}
						/>
					))}
					{!!peopleTyping.length && (
						<SomeoneIsTyping peopleTyping={peopleTyping} />
					)}
				</div>
			</section>
			<MessageInput
				textRef={textRef}
				throttleMessageSending={throttleMessageSending}
			/>
		</>
	)
}
