import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const partial = await db.select().from(partial).where(
		and(
			eq(partial.id, params.id),
			eq(partial.userId, locals.session.user.id)
		)
	).limit(1)
	
	if (!partial.length) {
		throw error(404, 'Partial not found')
	}
	
	return {
		partial: partial[0]
	}
}