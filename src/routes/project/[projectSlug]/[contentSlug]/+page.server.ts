import { db } from '$lib/server/db'
import { packet, piece, page, pageContent, publication, post, primitive, primitiveField, partial } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and, lte, isNotNull } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project } = await parent()

	// Try to find a packet first
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
		// Load all published pieces for this packet
		const now = new Date()
		const pieces = await db
			.select({
				id: piece.id,
				name: piece.name,
				slug: piece.slug,
				publishedAt: piece.publishedAt,
				createdAt: piece.createdAt,
				updatedAt: piece.updatedAt
			})
			.from(piece)
			.where(
				and(
					eq(piece.packetId, packetData[0].id),
					lte(piece.publishedAt, now)
				)
			)
			.orderBy(piece.publishedAt)

		return {
			type: 'packet' as const,
			project,
			packet: packetData[0],
			pieces
		}
	}

	// Try to find a page
	const pageData = await db
		.select()
		.from(page)
		.where(
			and(
				eq(page.slug, params.contentSlug),
				eq(page.projectId, project.id),
				isNotNull(page.publishedAt)
			)
		)
		.limit(1)

	if (pageData.length > 0) {
		// Load page content with primitives
		const content = await db
			.select({
				id: pageContent.id,
				order: pageContent.order,
				content: pageContent.content,
				primitiveId: pageContent.primitiveId,
				primitiveName: primitive.name,
				primitiveDescription: primitive.description,
				sourcePartialId: pageContent.sourcePartialId,
				partialName: partial.name
			})
			.from(pageContent)
			.leftJoin(primitive, eq(pageContent.primitiveId, primitive.id))
			.leftJoin(partial, eq(pageContent.sourcePartialId, partial.id))
			.where(eq(pageContent.pageId, pageData[0].id))
			.orderBy(pageContent.order)

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
			type: 'page' as const,
			project,
			page: pageData[0],
			content: contentWithFields
		}
	}

	// Try to find a publication
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
		// Load all published posts for this publication
		const posts = await db
			.select({
				id: post.id,
				title: post.title,
				slug: post.slug,
				publishedAt: post.publishedAt,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt
			})
			.from(post)
			.where(
				and(
					eq(post.publicationId, publicationData[0].id),
					isNotNull(post.publishedAt)
				)
			)
			.orderBy(post.publishedAt)

		return {
			type: 'publication' as const,
			project,
			publication: publicationData[0],
			posts
		}
	}

	throw error(404, 'Content not found')
}
