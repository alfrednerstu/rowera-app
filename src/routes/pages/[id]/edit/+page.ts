import { db } from '$lib/server/db'
import { pages, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the page with ownership verification through product
	const page = await db.select({
		id: pages.id,
		name: pages.name,
		slug: pages.slug,
		productId: pages.productId,
		createdAt: pages.createdAt,
		updatedAt: pages.updatedAt
	})
	.from(pages)
	.innerJoin(products, eq(pages.productId, products.id))
	.where(
		and(
			eq(pages.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!page.length) {
		throw error(404, 'Page not found')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		page: page[0],
		products: userProducts
	}
}