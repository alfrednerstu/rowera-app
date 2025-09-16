import { db } from '$lib/server/db'
import { project, project, preset, publication } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's projects
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		projectName: project.name
	})
	.from(project)
	.innerJoin(project, eq(project.projectId, project.id))
	.where(eq(project.userId, locals.session.user.id))
	
	// Get user's presets (from their publications)
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationName: publication.name
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(eq(project.userId, locals.session.user.id))
	
	return {
		projects: userProjects,
		presets: userPresets
	}
}