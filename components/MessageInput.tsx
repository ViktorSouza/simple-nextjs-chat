'use client'
import React, { RefObject, useState } from 'react'

export function MessageInput({
	throttleMessageSending,
	textRef,
}: {
	throttleMessageSending: (...any: any) => any
	textRef: RefObject<HTMLDivElement>
}) {
	const [messageInput, setMessageInput] = useState<string>('')
	const sendMessage = () => {
		const message = textRef?.current?.innerText ?? ''
		if (message === '') return null
		textRef.current!.innerText = ''

		fetch('/api/messages', {
			method: 'POST',
			body: JSON.stringify({ message }),
		}).catch(console.log)
	}

	return (
		<section className='w-full  bg-white dark:bg-zinc-950 p-2'>
			<div className=' rounded-md w-full focus-within:ring-4 focus-within:outline-none ring-sky-500 bg-zinc-200 focus-within:bg-transparent dark:bg-zinc-900 flex items-end justify-between gap-1 py-2 px-3'>
				<div
					onInput={(e) => {
						setMessageInput(e.currentTarget.innerText)
						throttleMessageSending(e)
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && e.ctrlKey) sendMessage()
					}}
					aria-multiline
					contentEditable={true}
					role='textbox'
					ref={textRef}
					aria-placeholder='Type a text...'
					className='bg-transparent w-full  outline-0 resize-none break-words overflow-x-clip overflow-y-auto max-h-96'
				/>

				<button
					className='hover:scale-105 transition-color text-sky-500 duration-500 text-lg disabled:text-zinc-500 shrink-0'
					disabled={!messageInput}
					title='Send'
					onClick={sendMessage}>
					<i className='bi bi-send-fill'></i>
				</button>
			</div>
		</section>
	)
}
