import { db } from '$lib/server/db'
import { project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent, cookies }) {
	const { user } = await parent()

	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get active project from cookie
	const activeProjectId = cookies.get('activeProjectId')
	
	// Get active project details
	let activeProject = null
	if (activeProjectId) {
		const result = await db.select()
			.from(project)
			.where(eq(project.id, activeProjectId))
			.limit(1)
		
		if (result.length > 0) {
			activeProject = result[0]
		}
	}
	
	return {
		activeProject
	}
}