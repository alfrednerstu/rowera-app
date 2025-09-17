import { db } from '$lib/server/db'
import { project, packet } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
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
	
	return {
		packets: userPackets
	}
}