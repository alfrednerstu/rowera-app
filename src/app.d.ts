// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				id: string
				userId: string
				expiresAt: Date
				token: string
				ipAddress?: string
				userAgent?: string
				createdAt: Date
				updatedAt: Date
			}
			user?: {
				id: string
				email: string
				name: string
				username?: string
				displayUsername?: string
				avatar?: string
				image?: string
				emailVerified: boolean
				role: string
				banned: boolean
				banReason?: string
				banExpires?: Date
				createdAt: Date
				updatedAt: Date
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
