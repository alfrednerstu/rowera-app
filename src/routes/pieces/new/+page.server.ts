import { db } from '$lib/server/db'
import { project, packet, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's packets
	const userPackets = await db.select({
		id: packet.id,
		name: packet.name,
		packetName: packet.name
	})
	.from(packet)
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(eq(project.userId, locals.session.user.id))
	
	// Get user's presets (from their packets)
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		packetName: packet.name
	})
	.from(preset)
	.innerJoin(packet, eq(preset.packetId, packet.id))
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(eq(project.userId, locals.session.user.id))
	
	return {
		packets: userPackets,
		presets: userPresets
	}
}