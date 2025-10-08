import { db } from '$lib/server/db'
import { page, project, primitive } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {


	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	// Get the page with ownership verification through product
	const pageResult = await db.select({
		id: page.id,
		name: page.name,
		slug: page.slug,
		projectId: page.projectId,
		primitives: page.primitives,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt
	})
	.from(page)
	.innerJoin(project, eq(page.projectId, project.id))
	.where(
		and(
			eq(page.id, params.id),
			eq(project.userId, locals.user.id)
		)
	)
	.limit(1)

	if (!pageResult.length) {
		throw error(404, 'Page not found')
	}

	// Get all user's projects for the select field
	const userProjects = await db.select().from(project).where(eq(project.userId, locals.user.id))

	// Get all available primitives
	const allPrimitives = await db.select().from(primitive)

	return {
		page: pageResult[0],
		projects: userProjects,
		primitives: allPrimitives
	}
}