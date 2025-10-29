import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	// Get all available partials for the user
	const userPartials = await db
		.select()
		.from(partial)
		.where(eq(partial.userId, locals.user.id))

	return {
		partials: userPartials
	}
}
