import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's partial
	const userPartials = await db.select().from(partial).where(eq(partial.userId, locals.session.user.id))
	
	return {
		partial: userPartials
	}
}