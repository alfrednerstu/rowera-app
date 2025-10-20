import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { packet, project, packetContent, primitive } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, slug, projectId } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Packet name is required' }, { status: 400 })
		}

		if (!slug?.trim()) {
			return json({ error: 'Packet slug is required' }, { status: 400 })
		}

		if (!projectId) {
			return json({ error: 'Project is required' }, { status: 400 })
		}

		// Verify that the project belongs to the user
		const projectResult = await db.select()
			.from(project)
			.where(
				and(
					eq(project.id, projectId),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)

		if (!projectResult.length) {
			return json({ error: 'Project not found or access denied' }, { status: 404 })
		}

		const [newPacket] = await db.insert(packet).values({
			name: name.trim(),
			slug: slug.trim(),
			projectId
		}).returning()

		// Automatically add "Piece List" primitive to the new packet
		const pieceListPrimitive = await db.select()
			.from(primitive)
			.where(eq(primitive.name, 'Piece List'))
			.limit(1)

		if (pieceListPrimitive.length > 0) {
			await db.insert(packetContent).values({
				packetId: newPacket.id,
				primitiveId: pieceListPrimitive[0].id,
				order: 0,
				content: {}
			})
		}

		return json(newPacket)
	} catch (error) {
		console.error('Error creating packet:', error)
		return json({ error: 'Failed to create packet' }, { status: 500 })
	}
}