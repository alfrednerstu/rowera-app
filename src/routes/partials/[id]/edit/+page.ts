import { db } from '$lib/server/db'
import { partials } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const partial = await db.select().from(partials).where(
		and(
			eq(partials.id, params.id),
			eq(partials.userId, session.user.id)
		)
	).limit(1)
	
	if (!partial.length) {
		throw error(404, 'Partial not found')
	}
	
	return {
		partial: partial[0]
	}
}