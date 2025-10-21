import { db } from '$lib/server/db'
import { packet, piece, pieceContent, publication, post, postContent, primitive, primitiveField, partial } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and, lte, isNotNull } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project } = await parent()

	// Try to find packet + piece first
	const packetData = await db
		.select()
		.from(packet)
		.where(
			and(
				eq(packet.slug, params.contentSlug),
				eq(packet.projectId, project.id)
			)
		)
		.limit(1)

	if (packetData.length > 0) {
		// Find piece by slug
		const now = new Date()
		const pieceData = await db
			.select()
			.from(piece)
			.where(
				and(
					eq(piece.slug, params.itemSlug),
					eq(piece.packetId, packetData[0].id),
					lte(piece.publishedAt, now)
				)
			)
			.limit(1)

		if (pieceData.length > 0) {
			// Load piece content with primitives
			const content = await db
				.select({
					id: pieceContent.id,
					order: pieceContent.order,
					content: pieceContent.content,
					primitiveId: pieceContent.primitiveId,
					primitiveName: primitive.name,
					primitiveDescription: primitive.description,
					sourcePartialId: pieceContent.sourcePartialId,
					partialName: partial.name
				})
				.from(pieceContent)
				.leftJoin(primitive, eq(pieceContent.primitiveId, primitive.id))
				.leftJoin(partial, eq(pieceContent.sourcePartialId, partial.id))
				.where(eq(pieceContent.pieceId, pieceData[0].id))
				.orderBy(pieceContent.order)

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
				type: 'piece' as const,
				project,
				packet: packetData[0],
				piece: pieceData[0],
				content: contentWithFields
			}
		}
	}

	// Try to find publication + post
	const publicationData = await db
		.select()
		.from(publication)
		.where(
			and(
				eq(publication.slug, params.contentSlug),
				eq(publication.projectId, project.id)
			)
		)
		.limit(1)

	if (publicationData.length > 0) {
		// Find post by slug
		const postData = await db
			.select()
			.from(post)
			.where(
				and(
					eq(post.slug, params.itemSlug),
					eq(post.publicationId, publicationData[0].id),
					isNotNull(post.publishedAt)
				)
			)
			.limit(1)

		if (postData.length > 0) {
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
				type: 'post' as const,
				project,
				publication: publicationData[0],
				post: postData[0],
				content: contentWithFields
			}
		}
	}

	throw error(404, 'Content not found')
}
