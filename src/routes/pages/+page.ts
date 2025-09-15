import { db } from '$lib/server/db'
import { pages, products } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all pages that belong to the user's products with product information
	const userPages = await db.select({
		id: pages.id,
		name: pages.name,
		slug: pages.slug,
		productId: pages.productId,
		productName: products.name,
		createdAt: pages.createdAt,
		updatedAt: pages.updatedAt
	})
	.from(pages)
	.innerJoin(products, eq(pages.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all user's products for the create form
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		pages: userPages,
		products: userProducts
	}
}