import { db } from '$lib/server/db'
import { publications, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the publication with ownership verification through product
	const publication = await db.select({
		id: publications.id,
		name: publications.name,
		slug: publications.slug,
		productId: publications.productId,
		createdAt: publications.createdAt,
		updatedAt: publications.updatedAt
	})
	.from(publications)
	.innerJoin(products, eq(publications.productId, products.id))
	.where(
		and(
			eq(publications.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!publication.length) {
		throw error(404, 'Publication not found')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		publication: publication[0],
		products: userProducts
	}
}