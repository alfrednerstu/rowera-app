import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { partials } from '$lib/server/db/schema'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Partial name is required' }, { status: 400 })
		}
		
		const [partial] = await db.insert(partials).values({
			name: name.trim(),
			userId: locals.session.user.id
		}).returning()
		
		return json(partial)
	} catch (error) {
		console.error('Error creating partial:', error)
		return json({ error: 'Failed to create partial' }, { status: 500 })
	}
}