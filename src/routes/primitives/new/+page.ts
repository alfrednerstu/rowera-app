import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ fetch }) => {
	// Check admin access by testing create endpoint
	try {
		const response = await fetch('/api/primitives', { method: 'POST', body: '{}' })
		if (response.status === 403) {
			throw redirect(302, '/')
		}
		if (response.status === 401) {
			throw redirect(302, '/login')
		}
	} catch (error) {
		if (error instanceof Response) throw error
		// Network error or similar - allow through for now
	}
	
	return {}
}