import { db } from '$lib/server/db'
import { project, product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const project = await db.select({
		id: project.id,
		name: project.name,
		slug: project.slug,
		productId: project.productId,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	})
	.from(project)
	.innerJoin(product, eq(project.productId, product.id))
	.where(
		and(
			eq(project.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!project.length) {
		throw error(404, 'Project not found')
	}
	
	// Get user's products for the form
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		project: project[0],
		products: userProducts
	}
}