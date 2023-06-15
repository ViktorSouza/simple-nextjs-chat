'use client'
import React, { useState } from 'react'

export function Options({
	options = [],
	title = '',
	btnClassName = '',
}: {
	options: { name: string; onClick: () => void }[]
	title: string
	btnClassName?: string
}) {
	const [isOpened, setIsOpened] = useState(true)
	const [selected, setSelected] = useState<string | null | undefined>(undefined)
	return (
		<div className='relative w-min group'>
			<button
				className={` px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-900 flex justify-center gap-1 items-baseline peer whitespace-nowrap ${btnClassName}`}
				onClick={() => {
					setIsOpened(!isOpened)
				}}>
				{selected || title}
				{/* <i className={`bi bi-chevron-${isOpened ? 'up' : 'down'}`}></i> */}
				<i className={`bi bi-chevron-up hidden group-focus-within:inline`}></i>
				<i className={`bi bi-chevron-down  group-focus-within:hidden`}></i>
			</button>

			<div className='peer-focus:flex focus:flex hover:flex hidden absolute z-10 dark:bg-zinc-900 dark:shadow-none shadow-lg bg-white w-16 right-0 mt-1 rounded-md overflow-y-auto max-h-56 min-w-max  flex-col'>
				{options.map((option) => (
					<button
						key={option.name}
						onClick={() => {
							setSelected(option.name)
							option.onClick()
							setIsOpened(false)
						}}
						className='dark:hover:bg-zinc-800 rounded outline-none  hover:bg-zinc-100 transition-all py-1 px-4 '>
						{option.name}
					</button>
				))}
			</div>
		</div>
	)
}
