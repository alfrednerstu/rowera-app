import { db } from '$lib/server/db'
import { publication, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's products
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		productId: publication.productId
	})
	.from(publication)
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		publications: userPublications
	}
}