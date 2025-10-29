import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { plate, plateContent } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, description, items } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Plate name is required' }, { status: 400 })
		}

		const [updatedPlate] = await db.update(plate)
			.set({
				name: name.trim(),
				description: description?.trim() || null,
				updatedAt: new Date()
			})
			.where(
				and(
					eq(plate.id, params.id),
					eq(plate.userId, locals.user.id)
				)
			)
			.returning()

		if (!updatedPlate) {
			return json({ error: 'Plate not found' }, { status: 404 })
		}

		// Update plate content
		if (items && Array.isArray(items)) {
			// Delete existing content
			await db.delete(plateContent)
				.where(eq(plateContent.plateId, params.id))

			// Insert new content
			if (items.length > 0) {
				await db.insert(plateContent).values(
					items.map((item) => ({
						plateId: params.id,
						order: item.order,
						partialId: item.partialId || null,
						isContentSlot: item.isContentSlot || false
					}))
				)
			}
		}

		return json(updatedPlate)
	} catch (error) {
		console.error('Error updating plate:', error)
		return json({ error: 'Failed to update plate' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const [deletedPlate] = await db.delete(plate)
			.where(
				and(
					eq(plate.id, params.id),
					eq(plate.userId, locals.user.id)
				)
			)
			.returning()

		if (!deletedPlate) {
			return json({ error: 'Plate not found' }, { status: 404 })
		}

		return json({ success: true })
	} catch (error) {
		console.error('Error deleting plate:', error)
		return json({ error: 'Failed to delete plate' }, { status: 500 })
	}
}
