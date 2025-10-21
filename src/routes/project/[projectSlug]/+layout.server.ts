import { db } from '$lib/server/db'
import { project, publication, packet } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ params }) => {
	// Find project by slug
	const projectData = await db
		.select()
		.from(project)
		.where(eq(project.id, params.projectSlug))
		.limit(1)

	if (!projectData || projectData.length === 0) {
		throw error(404, 'Project not found')
	}

	// Load all publications for this project
	const publications = await db
		.select()
		.from(publication)
		.where(eq(publication.projectId, projectData[0].id))

	// Load all packets for this project
	const packets = await db
		.select()
		.from(packet)
		.where(eq(packet.projectId, projectData[0].id))

	return {
		project: projectData[0],
		publications,
		packets
	}
}
