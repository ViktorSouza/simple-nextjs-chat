import { useEffect, useState } from 'react'

const useTheme = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		const storedTheme = localStorage.getItem('theme') as 'light' | 'dark'
		return storedTheme ? storedTheme : 'light' // Set a default theme if no theme is stored
	})

	useEffect(() => {
		localStorage.setItem('theme', theme)

		theme === 'dark'
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark')
	}, [theme])

	return [theme, setTheme] as const
}

export default useTheme
