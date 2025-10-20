import { db } from '$lib/server/db'
import { packet, piece } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and, lte } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project, publications } = await parent()

	// Check if this slug matches a publication first
	const isPublication = publications.some(p => p.slug === params.packetSlug)
	if (isPublication) {
		// This is handled by the publication route
		return
	}

	// Find packet by slug within this project
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

	// Load all published pieces for this packet (publishedAt is now or in the past)
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
		packet: packetData[0],
		pieces
	}
}
