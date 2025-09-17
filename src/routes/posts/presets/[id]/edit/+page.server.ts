import { db } from '$lib/server/db'
import { preset, publication, project } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the preset with ownership verification through publication
	const preset = await db.select({
		id: preset.id,
		name: preset.name,
		publicationId: preset.publicationId,
		createdAt: preset.createdAt,
		updatedAt: preset.updatedAt
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(
		and(
			eq(preset.id, params.id),
			eq(project.userId, user.id)
		)
	)
	.limit(1)
	
	if (!preset.length) {
		throw error(404, 'Preset not found')
	}
	
	// Get all publications that belong to the user's projects
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		projectId: publication.projectId
	})
	.from(publication)
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(eq(project.userId, user.id))
	
	return {
		preset: preset[0],
		publications: userPublications
	}
}