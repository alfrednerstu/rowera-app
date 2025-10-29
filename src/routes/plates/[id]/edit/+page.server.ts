import { db } from '$lib/server/db'
import { plate, plateContent, partial } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	const plateResult = await db.select().from(plate).where(
		and(
			eq(plate.id, params.id),
			eq(plate.userId, locals.user.id)
		)
	).limit(1)

	if (!plateResult.length) {
		throw error(404, 'Plate not found')
	}

	// Get plate content items
	const contentItems = await db
		.select()
		.from(plateContent)
		.where(eq(plateContent.plateId, params.id))
		.orderBy(plateContent.order)

	// Get all available partials for the user
	const userPartials = await db
		.select()
		.from(partial)
		.where(eq(partial.userId, locals.user.id))

	return {
		plate: plateResult[0],
		items: contentItems,
		partials: userPartials
	}
}
