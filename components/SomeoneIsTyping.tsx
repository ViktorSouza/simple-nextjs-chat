'use client'
import React from 'react'
import { Session } from 'next-auth'

export function SomeoneIsTyping({
	peopleTyping,
}: {
	peopleTyping: Session['user'][]
}) {
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

	return (
		<div className='text-zinc-500 font-medium self-center flex'>
			{showWhoIsTyping(peopleTyping)}
			<div className='flex -space-x-2'>
				<i className='bi bi-dot  animate-[bounce_1s_0s_ease-in-out_infinite]'></i>
				<i className='bi bi-dot  animate-[bounce_1s_150ms_ease-in-out_infinite]'></i>
				<i className='bi bi-dot  animate-[bounce_1s_300ms_ease-in-out_infinite]'></i>
			</div>
		</div>
	)
}
