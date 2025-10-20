import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post, publication, preset, project, postContent } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { title, slug, publicationId, presetId, content } = await request.json()

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
		const publicationRows = await db.select()
			.from(publication)
			.innerJoin(project, eq(publication.projectId, project.id))
			.where(
				and(
					eq(publication.id, publicationId),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)

		if (!publicationRows.length) {
			return json({ error: 'Publication not found or access denied' }, { status: 404 })
		}

		// Verify that the preset belongs to the publication
		const presetRows = await db.select()
			.from(preset)
			.where(
				and(
					eq(preset.id, presetId),
					eq(preset.publicationId, publicationId)
				)
			)
			.limit(1)

		if (!presetRows.length) {
			return json({ error: 'Preset not found or not available for this publication' }, { status: 404 })
		}

		const [newPost] = await db.insert(post).values({
			title: title.trim(),
			slug: slug?.trim() || null,
			publicationId,
			presetId,
			userId: locals.user.id
		}).returning()

		// Insert post content if provided
		if (content && Array.isArray(content) && content.length > 0) {
			await db.insert(postContent).values(
				content.map((item) => ({
					postId: newPost.id,
					order: item.order,
					primitiveId: item.primitiveId || null,
					sourcePresetId: item.sourcePresetId || null,
					sourcePartialId: item.sourcePartialId || null,
					content: item.content
				}))
			)
		}

		return json(newPost)
	} catch (error) {
		console.error('Error creating post:', error)
		return json({ error: 'Failed to create post' }, { status: 500 })
	}
}