'use client'
import { SessionProvider as Provider } from 'next-auth/react'
import React from 'react'
export function SessionProvider({
	children,
}: {
	children: React.JSX.Element | React.JSX.Element[] | React.ReactNode
}) {
	return <Provider>{children}</Provider>
}
