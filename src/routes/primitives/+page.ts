import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/primitives')
		
		if (response.status === 403) {
			throw redirect(302, '/')
		}
		
		if (response.status === 401) {
			throw redirect(302, '/login')
		}
		
		const primitives = response.ok ? await response.json() : []
		
		return {
			primitives
		}
	} catch (error) {
		if (error instanceof Response) throw error
		console.error('Error loading primitives:', error)
		return {
			primitives: []
		}
	}
}