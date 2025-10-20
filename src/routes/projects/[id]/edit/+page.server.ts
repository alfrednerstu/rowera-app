import { db } from '$lib/server/db'
import { project, projectContent, primitive } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and, asc } from 'drizzle-orm'

export const load = async ({ params, locals }) => {


	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	const projectRows = await db.select().from(project).where(
		and(
			eq(project.id, params.id),
			eq(project.userId, locals.user.id)
		)
	).limit(1)

	if (!projectRows.length) {
		throw error(404, 'Project not found')
	}

	// Get project content (layout primitives)
	const content = await db.select()
		.from(projectContent)
		.where(eq(projectContent.projectId, params.id))
		.orderBy(asc(projectContent.order))

	// Get all available primitives
	const allPrimitives = await db.select().from(primitive)

	return {
		project: {
			...projectRows[0],
			content
		},
		primitives: allPrimitives
	}
}