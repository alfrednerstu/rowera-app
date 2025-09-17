import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { piece, packet, project, preset } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, packetId, presetId } = await request.json()
		
		if (!name?.trim() || !slug?.trim() || !packetId || !presetId) {
			return json({ error: 'Name, slug, packet, and preset are required' }, { status: 400 })
		}
		
		// Verify the packet belongs to the user
		const packetResult = await db.select()
		.from(packet)
		.innerJoin(project, eq(packet.projectId, project.id))
		.where(
			and(
				eq(packet.id, packetId),
				eq(project.userId, locals.user.id)
			)
		)
		.limit(1)
		
		if (!packetResult.length) {
			return json({ error: 'Packet not found' }, { status: 404 })
		}
		
		// Verify the preset belongs to the user (through packet)
		const presetResult = await db.select()
		.from(preset)
		.innerJoin(packet, eq(preset.packetId, packet.id))
		.innerJoin(project, eq(packet.projectId, project.id))
		.where(
			and(
				eq(preset.id, presetId),
				eq(project.userId, locals.user.id)
			)
		)
		.limit(1)
		
		if (!presetResult.length) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		const [updatedPiece] = await db.update(piece)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				packetId,
				presetId,
				updatedAt: new Date()
			})
			.where(eq(piece.id, params.id))
			.returning()
		
		if (!updatedPiece) {
			return json({ error: 'Piece not found' }, { status: 404 })
		}
		
		return json(updatedPiece)
	} catch (error) {
		console.error('Error updating piece:', error)
		return json({ error: 'Failed to update piece' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [deletedPiece] = await db.delete(piece)
			.where(eq(piece.id, params.id))
			.returning()
		
		if (!deletedPiece) {
			return json({ error: 'Piece not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting piece:', error)
		return json({ error: 'Failed to delete piece' }, { status: 500 })
	}
}