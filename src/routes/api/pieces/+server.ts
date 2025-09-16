import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { piece, packet, project, preset } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
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
				eq(project.userId, locals.session.user.id)
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
				eq(project.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!presetResult.length) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		const [newPiece] = await db.insert(piece).values({
			name: name.trim(),
			slug: slug.trim(),
			packetId,
			presetId
		}).returning()
		
		return json(newPiece)
	} catch (error) {
		console.error('Error creating piece:', error)
		return json({ error: 'Failed to create piece' }, { status: 500 })
	}
}