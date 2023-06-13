declare module 'next-auth' {
	interface User {
		id: string // Or string
		email: string
		username: string
	}
	interface Session {
		user: {
			id: string
			email: string
			username: string
		}
	}
}

export {}
