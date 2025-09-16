import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post, publication, preset, product } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
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
		
		const [post] = await db.insert(post).values({
			title: title.trim(),
			slug: slug?.trim() || null,
			publicationId,
			presetId
		}).returning()
		
		return json(post)
	} catch (error) {
		console.error('Error creating post:', error)
		return json({ error: 'Failed to create post' }, { status: 500 })
	}
}