export default function Loading() {
	return (
		<section className='p-4 animate-pulse'>
			<span className='text-red-500'>*STILL CREATING</span>
			<h1 className='text-3xl font-medium'>Account</h1>
			<div className='space-y-4'>
				<div className='flex flex-col'>
					<label
						htmlFor='username'
						className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
						Username
					</label>
					<input
						type='username'
						className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent'
						// className='border-b bg-transparent w-full border-zinc-300 px-1 py-2 '
					/>
				</div>
				<div className='flex flex-col'>
					<label
						htmlFor='email'
						className='text-zinc-500 font-medium text-sm mb-2 ml-1'>
						Email
					</label>
					<input
						type='email'
						className='outline-none ring-zinc-800 dark:ring-2   rounded-md w-full p-3 bg-zinc-200 dark:bg-transparent '
					/>
				</div>
				<button
					className='px-6 py-3 bg-zinc-900 cursor-not-allowed opacity-50 dark:bg-zinc-200 dark:text-zinc-800 rounded-md text-zinc-100 w-full font-medium'
					disabled>
					Apply Changes
				</button>
			</div>
			<button className='px-6 py-3 bg-red-500 mt-5 dark:text-zinc-200 rounded-md text-zinc-100 cursor-not-allowed opacity-50 w-full font-medium'>
				Delete Account
			</button>
		</section>
	)
}
