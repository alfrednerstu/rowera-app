import { db } from '$lib/server/db'
import { presets, publications, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the preset with ownership verification through publication
	const preset = await db.select({
		id: presets.id,
		name: presets.name,
		publicationId: presets.publicationId,
		createdAt: presets.createdAt,
		updatedAt: presets.updatedAt
	})
	.from(presets)
	.innerJoin(publications, eq(presets.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.where(
		and(
			eq(presets.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!preset.length) {
		throw error(404, 'Preset not found')
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
	
	return {
		preset: preset[0],
		publications: userPublications
	}
}