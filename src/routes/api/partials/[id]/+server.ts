import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, primitives } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Partial name is required' }, { status: 400 })
		}

		const [updatedPartial] = await db.update(partial)
			.set({
				name: name.trim(),
				primitives: primitives || null,
				updatedAt: new Date()
			})
			.where(
				and(
					eq(partial.id, params.id),
					eq(partial.userId, locals.user.id)
				)
			)
			.returning()
		
		if (!updatedPartial) {
			return json({ error: 'Partial not found' }, { status: 404 })
		}

		return json(updatedPartial)
	} catch (error) {
		console.error('Error updating partial:', error)
		return json({ error: 'Failed to update partial' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [partial] = await db.delete(partial)
			.where(
				and(
					eq(partial.id, params.id),
					eq(partial.userId, locals.user.id)
				)
			)
			.returning()
		
		if (!partial) {
			return json({ error: 'Partial not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting partial:', error)
		return json({ error: 'Failed to delete partial' }, { status: 500 })
	}
}