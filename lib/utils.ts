import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function bounce(cb: (...args: any) => unknown, delay = 1000) {
	let timeout: string | number | NodeJS.Timeout | undefined
	console.log('bounceInterval called')

	return (...any: any) => {
		console.log('called :D')
		clearInterval(timeout)
		timeout = setInterval(() => cb(...any), delay)
	}
}
export function throttle(cb: (...args: any) => unknown, delay = 1000) {
	let shouldWait = false
	return (...any: any) => {
		if (shouldWait) return

		cb(...any)
		shouldWait = true
		setTimeout(() => (shouldWait = false), delay)
	}
}
