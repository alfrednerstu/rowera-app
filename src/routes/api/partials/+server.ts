import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { partial, partialPrimitive } from '$lib/server/db/schema'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, items } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Partial name is required' }, { status: 400 })
		}

		const [result] = await db.insert(partial).values({
			name: name.trim(),
			userId: locals.user.id
		}).returning()

		// Insert partial primitives if provided
		if (items && Array.isArray(items) && items.length > 0) {
			const primitiveItems = items.filter(item => item.type === 'primitive')
			if (primitiveItems.length > 0) {
				await db.insert(partialPrimitive).values(
					primitiveItems.map((item) => ({
						partialId: result.id,
						primitiveId: item.id,
						order: item.order
					}))
				)
			}
		}

		return json(result)
	} catch (error) {
		console.error('Error creating partial:', error)
		return json({ error: 'Failed to create partial' }, { status: 500 })
	}
}
