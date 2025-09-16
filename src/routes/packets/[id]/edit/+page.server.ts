import { db } from '$lib/server/db'
import { packet, project } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.userId) {
		throw redirect(302, '/login')
	}
	
	const packetQuery = await db.select({
		id: packet.id,
		name: packet.name,
		slug: packet.slug,
		projectId: packet.projectId,
		createdAt: packet.createdAt,
		updatedAt: packet.updatedAt
	})
	.from(packet)
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(
		and(
			eq(packet.id, params.id),
			eq(project.userId, locals.session.userId)
		)
	)
	.limit(1)
	
	if (!packetQuery.length) {
		throw error(404, 'Packet not found')
	}
	
	// Get user's projects for the form
	const userProjects = await db.select().from(project).where(eq(project.userId, locals.session.userId))
	
	return {
		packet: packetQuery[0],
		projects: userProjects
	}
}