import type { PageLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ fetch, params }) => {
	// Check admin access by testing update endpoint
	try {
		const testResponse = await fetch('/api/primitives', { method: 'POST', body: '{}' })
		if (testResponse.status === 403) {
			throw redirect(302, '/')
		}
		if (testResponse.status === 401) {
			throw redirect(302, '/login')
		}
	} catch (err) {
		if (err instanceof Response) throw err
		// Network error or similar - continue
	}
	
	// Fetch the primitive to edit
	try {
		const response = await fetch(`/api/primitives/${params.id}`)
		
		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Primitive not found')
			}
			throw error(500, 'Failed to load primitive')
		}
		
		const primitive = await response.json()
		
		return {
			primitive
		}
	} catch (err) {
		if (err instanceof Response) throw err
		throw error(500, 'Failed to load primitive')
	}
}