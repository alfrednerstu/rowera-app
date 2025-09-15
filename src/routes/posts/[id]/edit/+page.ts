import { db } from '$lib/server/db'
import { posts, publications, presets, products } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the post with ownership verification through publication
	const post = await db.select({
		id: posts.id,
		title: posts.title,
		slug: posts.slug,
		content: posts.content,
		publicationId: posts.publicationId,
		presetId: posts.presetId,
		createdAt: posts.createdAt,
		updatedAt: posts.updatedAt
	})
	.from(posts)
	.innerJoin(publications, eq(posts.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.where(
		and(
			eq(posts.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!post.length) {
		throw error(404, 'Post not found')
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
		post: post[0],
		publications: userPublications,
		presets: userPresets
	}
}