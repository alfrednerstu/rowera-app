import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { preset, publication, packet, project } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, publicationId, packetId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Preset name is required' }, { status: 400 })
		}
		
		// Must belong to either a publication or a packet, but not both
		if (!publicationId && !packetId) {
			return json({ error: 'Either publication or packet is required' }, { status: 400 })
		}
		
		if (publicationId && packetId) {
			return json({ error: 'Preset cannot belong to both publication and packet' }, { status: 400 })
		}
		
		// If publicationId is provided, verify it belongs to the user
		if (publicationId) {
			const publication = await db.select()
				.from(publication)
				.innerJoin(project, eq(publication.projectId, project.id))
				.where(
					and(
						eq(publication.id, publicationId),
						eq(project.userId, locals.session.user.id)
					)
				)
				.limit(1)
			
			if (!publication.length) {
				return json({ error: 'Publication not found or access denied' }, { status: 404 })
			}
		}
		
		// If packetId is provided, verify it belongs to the user
		if (packetId) {
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
				return json({ error: 'Packet not found or access denied' }, { status: 404 })
			}
		}
		
		const [newPreset] = await db.insert(preset).values({
			name: name.trim(),
			publicationId: publicationId || null,
			packetId: packetId || null
		}).returning()
		
		return json(newPreset)
	} catch (error) {
		console.error('Error creating preset:', error)
		return json({ error: 'Failed to create preset' }, { status: 500 })
	}
}