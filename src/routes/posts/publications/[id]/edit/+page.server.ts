import { db } from '$lib/server/db'
import { publication, project } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the publication with ownership verification through product
	const publicationResult = await db.select({
		id: publication.id,
		name: publication.name,
		slug: publication.slug,
		projectId: publication.projectId,
		createdAt: publication.createdAt,
		updatedAt: publication.updatedAt
	})
	.from(publication)
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(
		and(
			eq(publication.id, params.id),
			eq(project.userId, user.id)
		)
	)
	.limit(1)
	
	if (!publicationResult.length) {
		throw error(404, 'Publication not found')
	}
	
	// Get all user's projects for the select field
	const userProjects = await db.select().from(project).where(eq(project.userId, user.id))
	
	return {
		publication: publicationResult[0],
		projects: userProjects
	}
}