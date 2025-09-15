import { db } from '$lib/server/db'
import { partials } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's partials
	const userPartials = await db.select().from(partials).where(eq(partials.userId, session.user.id))
	
	return {
		partials: userPartials
	}
}