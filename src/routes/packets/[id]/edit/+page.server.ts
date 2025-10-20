import { db } from '$lib/server/db'
import { packet, project, packetContent, primitive } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and, asc } from 'drizzle-orm'

export const load = async ({ params, locals }) => {


	if (!locals.user?.id) {
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
			eq(project.userId, locals.user.id)
		)
	)
	.limit(1)

	if (!packetQuery.length) {
		throw error(404, 'Packet not found')
	}

	// Get packet content (layout primitives)
	const content = await db.select()
		.from(packetContent)
		.where(eq(packetContent.packetId, params.id))
		.orderBy(asc(packetContent.order))

	// Get user's projects for the form
	const userProjects = await db.select().from(project).where(eq(project.userId, locals.user.id))

	// Get all available primitives
	const allPrimitives = await db.select().from(primitive)

	return {
		packet: {
			...packetQuery[0],
			content
		},
		projects: userProjects,
		primitives: allPrimitives
	}
}