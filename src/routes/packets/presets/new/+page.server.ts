import { db } from '$lib/server/db'
import { project, packet } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent, cookies }) {
	const { user } = await parent()
	
	if (!user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get active project from cookie
	const activeProjectId = cookies.get('activeProjectId')
	
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
	
	return {
		packets: userPackets
	}
}