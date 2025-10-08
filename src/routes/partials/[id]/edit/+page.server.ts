import { db } from '$lib/server/db'
import { partial, primitive } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {


	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	const partialResult = await db.select().from(partial).where(
		and(
			eq(partial.id, params.id),
			eq(partial.userId, locals.user.id)
		)
	).limit(1)

	if (!partialResult.length) {
		throw error(404, 'Partial not found')
	}

	// Get all available primitives
	const allPrimitives = await db.select().from(primitive)

	return {
		partial: partialResult[0],
		primitives: allPrimitives
	}
}