import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post, publication, preset, product } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { title, slug, publicationId, presetId } = await request.json()
		
		if (!title?.trim()) {
			return json({ error: 'Post title is required' }, { status: 400 })
		}
		
		if (!publicationId) {
			return json({ error: 'Publication is required' }, { status: 400 })
		}
		
		if (!presetId) {
			return json({ error: 'Preset is required' }, { status: 400 })
		}
		
		// Verify that the publication belongs to the user
		const publication = await db.select()
			.from(publication)
			.innerJoin(product, eq(publication.productId, product.id))
			.where(
				and(
					eq(publication.id, publicationId),
					eq(product.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!publication.length) {
			return json({ error: 'Publication not found or access denied' }, { status: 404 })
		}
		
		// Verify that the preset belongs to the publication
		const preset = await db.select()
			.from(preset)
			.where(
				and(
					eq(preset.id, presetId),
					eq(preset.publicationId, publicationId)
				)
			)
			.limit(1)
		
		if (!preset.length) {
			return json({ error: 'Preset not found or not available for this publication' }, { status: 404 })
		}
		
		// Update the post with ownership verification through publication
		const [post] = await db.update(post)
			.set({ 
				title: title.trim(),
				slug: slug?.trim() || null,
				publicationId,
				presetId,
				updatedAt: new Date()
			})
			.from(publication, product)
			.where(
				and(
					eq(post.id, params.id),
					eq(post.publicationId, publication.id),
					eq(publication.productId, product.id),
					eq(product.userId, locals.session.user.id)
				)
			)
			.returning({
				id: post.id,
				title: post.title,
				slug: post.slug,
				content: post.content,
				publicationId: post.publicationId,
				presetId: post.presetId,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt
			})
		
		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 })
		}
		
		return json(post)
	} catch (error) {
		console.error('Error updating post:', error)
		return json({ error: 'Failed to update post' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// First verify ownership through publication relationship
		const postToDelete = await db.select({ id: post.id })
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
		
		if (!postToDelete.length) {
			return json({ error: 'Post not found' }, { status: 404 })
		}
		
		// Delete the post
		const [post] = await db.delete(post)
			.where(eq(post.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting post:', error)
		return json({ error: 'Failed to delete post' }, { status: 500 })
	}
}