import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { project, publication, packet } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const projects = await db.select().from(project).where(eq(project.userId, locals.user.id))
		
		return json({ projects })
	} catch (error) {
		console.error('Error fetching projects:', error)
		return json({ error: 'Failed to fetch projects' }, { status: 500 })
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Project name is required' }, { status: 400 })
		}
		
		const [newProject] = await db.insert(project).values({
			name: name.trim(),
			userId: locals.user.id
		}).returning()

		// Create default publication
		const [defaultPublication] = await db.insert(publication).values({
			name: 'Default publication',
			slug: 'default',
			projectId: newProject.id
		}).returning()

		// Create default packet
		const [defaultPacket] = await db.insert(packet).values({
			name: 'Default packet',
			slug: 'default',
			projectId: newProject.id
		}).returning()
		
		return json({ 
			project: newProject, 
			defaultPublication, 
			defaultPacket 
		})
	} catch (error) {
		console.error('Error creating project:', error)
		return json({ error: 'Failed to create project' }, { status: 500 })
	}
}