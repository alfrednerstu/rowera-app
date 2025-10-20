import { db } from '$lib/server/db'
import { preset, project, packet, primitive, primitiveField } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent, cookies }) {
	const { user } = await parent()

	if (!user?.id) {
		throw redirect(302, '/login')
	}

	// Get active project from cookie
	const activeProjectId = cookies.get('activeProjectId')

	// Get the preset with ownership verification
	const presetResult = await db.select({
		id: preset.id,
		name: preset.name,
		packetId: preset.packetId,
		primitives: preset.primitives,
		createdAt: preset.createdAt,
		updatedAt: preset.updatedAt
	})
	.from(preset)
	.innerJoin(packet, eq(preset.packetId, packet.id))
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(
		and(
			eq(preset.id, params.id),
			eq(project.userId, user.id)
		)
	)
	.limit(1)

	if (!presetResult.length) {
		throw error(404, 'Preset not found')
	}

	// Get packets for the active project only
	const userPackets = await db.select({
		id: packet.id,
		name: packet.name,
		projectName: project.name
	})
	.from(packet)
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(
		activeProjectId
			? eq(packet.projectId, activeProjectId)
			: eq(project.userId, user.id)
	)

	// Get all available primitives with their fields
	const allPrimitives = await db.select().from(primitive)

	// Get all primitive fields
	const allFields = await db.select().from(primitiveField)

	// Attach fields to each primitive
	const primitivesWithFields = allPrimitives.map(prim => ({
		...prim,
		fields: allFields.filter(f => f.primitiveId === prim.id).sort((a, b) => a.order - b.order)
	}))

	return {
		preset: presetResult[0],
		packets: userPackets,
		primitives: primitivesWithFields
	}
}