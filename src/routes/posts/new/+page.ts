import { db } from '$lib/server/db'
import { publications, presets, products } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's products
	const userPublications = await db.select({
		id: publications.id,
		name: publications.name,
		productId: publications.productId
	})
	.from(publications)
	.innerJoin(products, eq(publications.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: presets.id,
		name: presets.name,
		publicationId: presets.publicationId
	})
	.from(presets)
	.innerJoin(publications, eq(presets.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	return {
		publications: userPublications,
		presets: userPresets
	}
}