import { db } from '$lib/server/db'
import { presets, projects, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the preset with ownership verification
	const preset = await db.select({
		id: presets.id,
		name: presets.name,
		projectId: presets.projectId,
		createdAt: presets.createdAt,
		updatedAt: presets.updatedAt
	})
	.from(presets)
	.innerJoin(projects, eq(presets.projectId, projects.id))
	.innerJoin(products, eq(projects.productId, products.id))
	.where(
		and(
			eq(presets.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!preset.length) {
		throw error(404, 'Preset not found')
	}
	
	// Get user's projects for the form
	const userProjects = await db.select({
		id: projects.id,
		name: projects.name,
		productName: products.name
	})
	.from(projects)
	.innerJoin(products, eq(projects.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	return {
		preset: preset[0],
		projects: userProjects
	}
}