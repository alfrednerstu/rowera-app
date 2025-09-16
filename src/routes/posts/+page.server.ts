import { db } from '$lib/server/db'
import { publication, post, preset, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's products with product information
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		slug: publication.slug,
		productId: publication.productId,
		productName: product.name,
		createdAt: publication.createdAt,
		updatedAt: publication.updatedAt
	})
	.from(publication)
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all posts with publication and product information
	const userPosts = await db.select({
		id: post.id,
		title: post.title,
		slug: post.slug,
		publicationId: post.publicationId,
		publicationName: publication.name,
		presetId: post.presetId,
		presetName: preset.name,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt
	})
	.from(post)
	.innerJoin(publication, eq(post.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.innerJoin(preset, eq(post.presetId, preset.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationId: preset.publicationId,
		publicationName: publication.name,
		createdAt: preset.createdAt,
		updatedAt: preset.updatedAt
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all user's products for forms
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		publications: userPublications,
		posts: userPosts,
		presets: userPresets,
		products: userProducts
	}
}