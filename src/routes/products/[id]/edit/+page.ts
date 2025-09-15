import { db } from '$lib/server/db'
import { products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const product = await db.select().from(products).where(
		and(
			eq(products.id, params.id),
			eq(products.userId, session.user.id)
		)
	).limit(1)
	
	if (!product.length) {
		throw error(404, 'Product not found')
	}
	
	return {
		product: product[0]
	}
}