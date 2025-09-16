import { db } from '$lib/server/db'
import { publication, product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the publication with ownership verification through product
	const publication = await db.select({
		id: publication.id,
		name: publication.name,
		slug: publication.slug,
		productId: publication.productId,
		createdAt: publication.createdAt,
		updatedAt: publication.updatedAt
	})
	.from(publication)
	.innerJoin(product, eq(publication.productId, product.id))
	.where(
		and(
			eq(publication.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!publication.length) {
		throw error(404, 'Publication not found')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		publication: publication[0],
		products: userProducts
	}
}