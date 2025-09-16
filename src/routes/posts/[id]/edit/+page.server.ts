import { db } from '$lib/server/db'
import { post, publication, preset, product } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the post with ownership verification through publication
	const post = await db.select({
		id: post.id,
		title: post.title,
		slug: post.slug,
		content: post.content,
		publicationId: post.publicationId,
		presetId: post.presetId,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt
	})
	.from(post)
	.innerJoin(publication, eq(post.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.where(
		and(
			eq(post.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!post.length) {
		throw error(404, 'Post not found')
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
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationId: preset.publicationId
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		post: post[0],
		publications: userPublications,
		presets: userPresets
	}
}