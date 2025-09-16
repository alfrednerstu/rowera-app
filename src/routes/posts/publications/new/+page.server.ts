import { db } from '$lib/server/db'
import { project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all user's projects for the select field
	const userProjects = await db.select().from(project).where(eq(project.userId, locals.session.user.id))
	
	return {
		projects: userProjects
	}
}