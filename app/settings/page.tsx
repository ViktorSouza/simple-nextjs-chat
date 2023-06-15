'use client'
import { Options } from '../../../components/Options'
import useTheme from '../../../hooks/useTheme'
export default function Settings() {
	const [theme, setTheme] = useTheme()
	const themeOptions: { name: string; onClick: () => void }[] = [
		{
			name: 'Light',
			onClick() {
				setTheme('light')
			},
		},
		{
			name: 'Dark',
			onClick() {
				setTheme('dark')
			},
		},
	]
	return (
		<div className='px-4 py-2 '>
			<h1 className='text-3xl font-medium mb-3'>Settings</h1>
			<section>
				<h2 className='text-2xl ml-2 font-medium'>Personalization</h2>

				<div className='ml-4'>
					<span className='text-lg font-medium'>Theme</span>
					<Options
						btnClassName='w-32 !justify-between'
						title={theme}
						options={themeOptions}
					/>
				</div>
			</section>
		</div>
	)
}
