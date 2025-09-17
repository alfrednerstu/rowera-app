import { db } from '$lib/server/db'
import { piece, packet, project, preset } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	const pieceQuery = await db.select({
		id: piece.id,
		name: piece.name,
		slug: piece.slug,
		packetId: piece.packetId,
		presetId: piece.presetId,
		createdAt: piece.createdAt,
		updatedAt: piece.updatedAt
	})
	.from(piece)
	.innerJoin(packet, eq(piece.packetId, packet.id))
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(
		and(
			eq(piece.id, params.id),
			eq(project.userId, user.id)
		)
	)
	.limit(1)
	
	if (!pieceQuery.length) {
		throw error(404, 'Piece not found')
	}
	
	// Get user's packets for the form
	const userPackets = await db.select({
		id: packet.id,
		name: packet.name,
		projectName: project.name
	})
	.from(packet)
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(eq(project.userId, user.id))
	
	// Get user's presets (from packets)
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		packetName: packet.name
	})
	.from(preset)
	.innerJoin(packet, eq(preset.packetId, packet.id))
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(eq(project.userId, user.id))
	
	return {
		piece: pieceQuery[0],
		packets: userPackets,
		presets: userPresets
	}
}