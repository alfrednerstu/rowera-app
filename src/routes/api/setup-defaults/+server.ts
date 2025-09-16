import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { project, publication, packet } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	const userId = locals.user.id
	
	try {
		// Check if user already has projects
		const existingProjects = await db.select().from(project).where(eq(project.userId, userId)).limit(1)
		
		if (existingProjects.length > 0) {
			return json({ message: 'User already has default entities' })
		}

		// Create default project
		const [defaultProject] = await db.insert(project).values({
			name: 'Default',
			userId: userId
		}).returning()

		// Create default publication
		const [defaultPublication] = await db.insert(publication).values({
			name: 'Default publication',
			slug: 'default',
			projectId: defaultProject.id
		}).returning()

		// Create default packet
		const [defaultPacket] = await db.insert(packet).values({
			name: 'Default packet',
			slug: 'default',
			projectId: defaultProject.id
		}).returning()
		
		return json({ 
			project: defaultProject,
			publication: defaultPublication, 
			packet: defaultPacket
		})
	} catch (error) {
		console.error('Error setting up default entities:', error)
		return json({ error: 'Failed to setup default entities' }, { status: 500 })
	}
}