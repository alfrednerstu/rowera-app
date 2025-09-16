import { db } from '$lib/server/db'
import { publication, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's projects
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		projectId: publication.projectId
	})
	.from(publication)
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(eq(project.userId, locals.session.user.id))
	
	return {
		publications: userPublications
	}
}