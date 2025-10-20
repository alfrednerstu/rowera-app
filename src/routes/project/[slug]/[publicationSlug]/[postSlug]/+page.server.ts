import { db } from '$lib/server/db'
import { publication, post, postContent, primitive, primitiveField, partial } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and, isNotNull } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project } = await parent()

	// Find publication by slug
	const publicationData = await db
		.select()
		.from(publication)
		.where(
			and(
				eq(publication.slug, params.publicationSlug),
				eq(publication.projectId, project.id)
			)
		)
		.limit(1)

	if (!publicationData || publicationData.length === 0) {
		throw error(404, 'Publication not found')
	}

	// Find post by slug (only published)
	const postData = await db
		.select()
		.from(post)
		.where(
			and(
				eq(post.slug, params.postSlug),
				eq(post.publicationId, publicationData[0].id),
				isNotNull(post.publishedAt)
			)
		)
		.limit(1)

	if (!postData || postData.length === 0) {
		throw error(404, 'Post not found')
	}

	// Load post content with primitives
	const content = await db
		.select({
			id: postContent.id,
			order: postContent.order,
			content: postContent.content,
			primitiveId: postContent.primitiveId,
			primitiveName: primitive.name,
			primitiveDescription: primitive.description,
			sourcePartialId: postContent.sourcePartialId,
			partialName: partial.name
		})
		.from(postContent)
		.leftJoin(primitive, eq(postContent.primitiveId, primitive.id))
		.leftJoin(partial, eq(postContent.sourcePartialId, partial.id))
		.where(eq(postContent.postId, postData[0].id))
		.orderBy(postContent.order)

	// Load primitive fields for each content item
	const contentWithFields = await Promise.all(
		content.map(async (item) => {
			if (!item.primitiveId) return item

			const fields = await db
				.select()
				.from(primitiveField)
				.where(eq(primitiveField.primitiveId, item.primitiveId))
				.orderBy(primitiveField.order)

			return {
				...item,
				fields
			}
		})
	)

	return {
		publication: publicationData[0],
		post: postData[0],
		content: contentWithFields
	}
}
