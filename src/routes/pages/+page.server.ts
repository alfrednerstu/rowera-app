import { db } from '$lib/server/db'
import { page, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all pages that belong to the user's products with product information
	const userPages = await db.select({
		id: page.id,
		name: page.name,
		slug: page.slug,
		productId: page.productId,
		productName: product.name,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt
	})
	.from(page)
	.innerJoin(product, eq(page.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all user's products for the create form
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		pages: userPages,
		products: userProducts
	}
}