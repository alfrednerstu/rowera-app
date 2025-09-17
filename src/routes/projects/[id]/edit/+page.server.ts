import { db } from '$lib/server/db'
import { project } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, parent }) => {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	const projectRows = await db.select().from(project).where(
		and(
			eq(project.id, params.id),
			eq(project.userId, user.id)
		)
	).limit(1)
	
	if (!projectRows.length) {
		throw error(404, 'Project not found')
	}
	
	return {
		project: projectRows[0]
	}
}