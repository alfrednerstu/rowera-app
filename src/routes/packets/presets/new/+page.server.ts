import { db } from '$lib/server/db'
import { project, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's projects for the form
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		projectName: project.name
	})
	.from(project)
	.innerJoin(project, eq(project.projectId, project.id))
	.where(eq(project.userId, user.id))
	
	return {
		projects: userProjects
	}
}