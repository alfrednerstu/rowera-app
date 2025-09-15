import { db } from '$lib/server/db'
import { projects, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const project = await db.select({
		id: projects.id,
		name: projects.name,
		slug: projects.slug,
		productId: projects.productId,
		createdAt: projects.createdAt,
		updatedAt: projects.updatedAt
	})
	.from(projects)
	.innerJoin(products, eq(projects.productId, products.id))
	.where(
		and(
			eq(projects.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!project.length) {
		throw error(404, 'Project not found')
	}
	
	// Get user's products for the form
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		project: project[0],
		products: userProducts
	}
}