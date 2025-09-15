import { db } from '$lib/server/db'
import { publications, posts, presets, products } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's products with product information
	const userPublications = await db.select({
		id: publications.id,
		name: publications.name,
		slug: publications.slug,
		productId: publications.productId,
		productName: products.name,
		createdAt: publications.createdAt,
		updatedAt: publications.updatedAt
	})
	.from(publications)
	.innerJoin(products, eq(publications.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all posts with publication and product information
	const userPosts = await db.select({
		id: posts.id,
		title: posts.title,
		slug: posts.slug,
		publicationId: posts.publicationId,
		publicationName: publications.name,
		presetId: posts.presetId,
		presetName: presets.name,
		createdAt: posts.createdAt,
		updatedAt: posts.updatedAt
	})
	.from(posts)
	.innerJoin(publications, eq(posts.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.innerJoin(presets, eq(posts.presetId, presets.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: presets.id,
		name: presets.name,
		publicationId: presets.publicationId,
		publicationName: publications.name,
		createdAt: presets.createdAt,
		updatedAt: presets.updatedAt
	})
	.from(presets)
	.innerJoin(publications, eq(presets.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all user's products for forms
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		publications: userPublications,
		posts: userPosts,
		presets: userPresets,
		products: userProducts
	}
}