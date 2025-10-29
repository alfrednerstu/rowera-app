import { db } from '$lib/server/db'
import { page, project, primitive, primitiveField, plate } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {


	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}

	// Get the page with ownership verification through project
	const pageResult = await db.select({
		id: page.id,
		title: page.title,
		slug: page.slug,
		projectId: page.projectId,
		plateId: page.plateId,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt
	})
	.from(page)
	.innerJoin(project, eq(page.projectId, project.id))
	.where(
		and(
			eq(page.slug, params.slug),
			eq(project.userId, locals.user.id)
		)
	)
	.limit(1)

	if (!pageResult.length) {
		throw error(404, 'Page not found')
	}

	// Get all user's projects for the select field
	const userProjects = await db.select().from(project).where(eq(project.userId, locals.user.id))

	// Get all user's plates for the select field
	const userPlates = await db.select().from(plate).where(eq(plate.userId, locals.user.id))

	// Get all available primitives with their fields
	const allPrimitives = await db.select().from(primitive)

	// Get all primitive fields
	const allFields = await db.select().from(primitiveField)

	// Attach fields to each primitive
	const primitivesWithFields = allPrimitives.map(prim => ({
		...prim,
		fields: allFields.filter(f => f.primitiveId === prim.id).sort((a, b) => a.order - b.order)
	}))

	return {
		page: pageResult[0],
		projects: userProjects,
		plates: userPlates,
		primitives: primitivesWithFields
	}
}