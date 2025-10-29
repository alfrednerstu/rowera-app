import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { plate, plateContent } from '$lib/server/db/schema'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, description, items } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Plate name is required' }, { status: 400 })
		}

		const [result] = await db.insert(plate).values({
			name: name.trim(),
			description: description?.trim() || null,
			userId: locals.user.id
		}).returning()

		// Insert plate content if provided
		if (items && Array.isArray(items) && items.length > 0) {
			await db.insert(plateContent).values(
				items.map((item) => ({
					plateId: result.id,
					order: item.order,
					partialId: item.partialId || null,
					isContentSlot: item.isContentSlot || false
				}))
			)
		}

		return json(result)
	} catch (error) {
		console.error('Error creating plate:', error)
		return json({ error: 'Failed to create plate' }, { status: 500 })
	}
}
