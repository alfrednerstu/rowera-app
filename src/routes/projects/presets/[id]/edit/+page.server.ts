import { db } from '$lib/server/db'
import { preset, project, product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the preset with ownership verification
	const preset = await db.select({
		id: preset.id,
		name: preset.name,
		projectId: preset.projectId,
		createdAt: preset.createdAt,
		updatedAt: preset.updatedAt
	})
	.from(preset)
	.innerJoin(project, eq(preset.projectId, project.id))
	.innerJoin(product, eq(project.productId, product.id))
	.where(
		and(
			eq(preset.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!preset.length) {
		throw error(404, 'Preset not found')
	}
	
	// Get user's projects for the form
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		productName: product.name
	})
	.from(project)
	.innerJoin(product, eq(project.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		preset: preset[0],
		projects: userProjects
	}
}