import { db } from '$lib/server/db'
import { packet, piece, pieceContent, primitive, primitiveField, partial } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project } = await parent()

	// Find packet by slug
	const packetData = await db
		.select()
		.from(packet)
		.where(
			and(
				eq(packet.slug, params.packetSlug),
				eq(packet.projectId, project.id)
			)
		)
		.limit(1)

	if (!packetData || packetData.length === 0) {
		throw error(404, 'Packet not found')
	}

	// Find piece by slug
	const pieceData = await db
		.select()
		.from(piece)
		.where(
			and(
				eq(piece.slug, params.pieceSlug),
				eq(piece.packetId, packetData[0].id)
			)
		)
		.limit(1)

	if (!pieceData || pieceData.length === 0) {
		throw error(404, 'Piece not found')
	}

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
		packet: packetData[0],
		piece: pieceData[0],
		content: contentWithFields
	}
}
