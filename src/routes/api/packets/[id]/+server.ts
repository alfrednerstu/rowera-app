import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { packet, project, packetContent } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, slug, projectId, primitives } = await request.json()

		if (!name?.trim() || !slug?.trim() || !projectId) {
			return json({ error: 'Name, slug, and project are required' }, { status: 400 })
		}

		// Verify the project belongs to the user
		const projectResult = await db.select().from(project).where(
			and(
				eq(project.id, projectId),
				eq(project.userId, locals.user.id)
			)
		).limit(1)

		if (!projectResult.length) {
			return json({ error: 'Project not found' }, { status: 404 })
		}

		const [updatedPacket] = await db.update(packet)
			.set({
				name: name.trim(),
				slug: slug.trim(),
				projectId,
				updatedAt: new Date()
			})
			.where(eq(packet.id, params.id))
			.returning()

		if (!updatedPacket) {
			return json({ error: 'Packet not found' }, { status: 404 })
		}

		// Update packet content if primitives are provided
		if (primitives) {
			// Delete existing content
			await db.delete(packetContent).where(eq(packetContent.packetId, params.id))

			// Insert new content
			if (primitives.length > 0) {
				await db.insert(packetContent).values(
					primitives.map((prim, index) => ({
						packetId: params.id,
						primitiveId: prim.primitiveId,
						order: index,
						content: {}
					}))
				)
			}
		}

		return json(updatedPacket)
	} catch (error) {
		console.error('Error updating packet:', error)
		return json({ error: 'Failed to update packet' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [deletedPacket] = await db.delete(packet)
			.where(eq(packet.id, params.id))
			.returning()
		
		if (!deletedPacket) {
			return json({ error: 'Packet not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting packet:', error)
		return json({ error: 'Failed to delete packet' }, { status: 500 })
	}
}