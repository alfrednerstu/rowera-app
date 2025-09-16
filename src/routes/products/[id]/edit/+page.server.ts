import { db } from '$lib/server/db'
import { product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const product = await db.select().from(product).where(
		and(
			eq(product.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	).limit(1)
	
	if (!product.length) {
		throw error(404, 'Product not found')
	}
	
	return {
		product: product[0]
	}
}