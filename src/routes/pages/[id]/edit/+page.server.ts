import { db } from '$lib/server/db'
import { page, product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the page with ownership verification through product
	const page = await db.select({
		id: page.id,
		name: page.name,
		slug: page.slug,
		productId: page.productId,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt
	})
	.from(page)
	.innerJoin(product, eq(page.productId, product.id))
	.where(
		and(
			eq(page.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!page.length) {
		throw error(404, 'Page not found')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		page: page[0],
		products: userProducts
	}
}