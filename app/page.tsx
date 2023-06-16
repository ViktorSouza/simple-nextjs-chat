'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import Image from 'next/image'
import Pusher from 'pusher-js'
import { useEffect, useRef, useState } from 'react'
import { Message } from '@/components/Message'
import { User } from '@prisma/client'
import { Session } from 'next-auth'

const pusher = new Pusher('733ce18d8e5e8379a6ca', {
	cluster: 'sa1',
})

const channel = pusher.subscribe('chat')
export default function Home() {
	const session = useSession({
		required: true,
	})
	const [isCurrentUserTyping, setIsCurrentUserTyping] = useState(false)
	console.log(session)
	const [peopleTyping, setPeopleTyping] = useState<Session['user'][]>([])

	const textRef = useRef<HTMLInputElement>(null)
	type IMessage = {
		message: string
		id: string
		User: {
			username: string
		}
		createdAt: string
	}

	const [messages, setMessages] = useState<IMessage[]>([])
	const messagesRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		//PUSHER
		channel.bind('text-new', (data: { message: IMessage }) => {
			console.log(data)
			setMessages((curr) => [...curr, data.message])
		})
		channel.bind('start-typing', (data: Session['user']) => {
			console.log(data.username + ' started to type :D')

			//If the user already exists in peopleTypin
			if (peopleTyping.findIndex((value) => value.id === data.id) !== -1) return

			setPeopleTyping((prev) => [...prev, data])
		})
		channel.bind('stop-typing', (data: Session['user']) => {
			console.log(data.username + ' stopped typing :(')
			setPeopleTyping((prev) => prev.filter((value) => value.id !== data.id))
		})
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

	return (
		<>
			<section
				className='w-full overflow-auto flex-grow  bg-white dark:bg-zinc-950 px-4 py-2 mb-20'
				ref={messagesRef}>
				<div className=' flex flex-col shrink-[3] full'>
					{messages.map((message) => (
						<Message
							key={message.id}
							message={message}
							session={session}
						/>
					))}
					{!!peopleTyping.length && (
						<div className='text-zinc-500 font-medium self-center flex'>
							{showWhoIsTyping(peopleTyping)}
							<div className='flex -space-x-2'>
								<i className='bi bi-dot  animate-[bounce_1s_0s_ease-in-out_infinite]'></i>
								<i className='bi bi-dot  animate-[bounce_1s_150ms_ease-in-out_infinite]'></i>
								<i className='bi bi-dot  animate-[bounce_1s_300ms_ease-in-out_infinite]'></i>
							</div>
						</div>
					)}
				</div>
			</section>
			<section className='w-full h-20 fixed bottom-0  flex justify-between items-center px-4 gap-2 shrink-0 bg-white dark:bg-zinc-950'>
				<div className='rounded-full bg-zinc-100 dark:bg-zinc-900 w-full'>
					<input
						type='text'
						onChange={(e) => {
							if (e.currentTarget.value && !isCurrentUserTyping) {
								fetch('/api/messages/typing-action', {
									method: 'POST',
									body: JSON.stringify({ action: 'start' }),
								})
								setIsCurrentUserTyping(true)
							}
							if (!e.currentTarget.value) {
								fetch('/api/messages/typing-action', {
									method: 'POST',
									body: JSON.stringify({ action: 'stop' }),
								})
								setIsCurrentUserTyping(false)
							}
						}}
						ref={textRef}
						placeholder='Type a text...'
						className='bg-transparent px-4 py-2  w-full outline-0'
					/>
				</div>
				<button
					className='bg-zinc-900 dark:bg-zinc-200 px-3 py-2 rounded-full hover:scale-105'
					onClick={() => {
						const message = textRef?.current?.value ?? ''
						if (message === '') return null
						textRef.current!.value = ''
						fetch('/api/messages', {
							method: 'POST',
							body: JSON.stringify({ message }),
						}).catch(console.log)
					}}>
					<i className='bi bi-send  text-zinc-200 dark:!text-zinc-800 '></i>
				</button>
			</section>
		</>
	)
}

function showWhoIsTyping(peopleTyping: Session['user'][]) {
	if (peopleTyping.length === 1) {
		return `${peopleTyping[0].username} is typing`
	} else {
		return `${
			peopleTyping
				.map((person, index) => person.username)
				.slice(0, -1)
				.join(', ') +
			' and ' +
			peopleTyping.at(-1)?.username
		} are typing`
	}
}
