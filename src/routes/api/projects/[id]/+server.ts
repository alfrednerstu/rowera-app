import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { project, projectContent } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, primitives } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Project name is required' }, { status: 400 })
		}

		const [updatedProject] = await db.update(project)
			.set({
				name: name.trim(),
				updatedAt: new Date()
			})
			.where(
				and(
					eq(project.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.returning()

		if (!updatedProject) {
			return json({ error: 'Project not found' }, { status: 404 })
		}

		// Update project content if primitives are provided
		if (primitives) {
			// Delete existing content
			await db.delete(projectContent).where(eq(projectContent.projectId, params.id))

			// Insert new content
			if (primitives.length > 0) {
				await db.insert(projectContent).values(
					primitives.map((prim, index) => ({
						projectId: params.id,
						primitiveId: prim.primitiveId,
						order: index,
						content: {}
					}))
				)
			}
		}

		return json(updatedProject)
	} catch (error) {
		console.error('Error updating project:', error)
		return json({ error: 'Failed to update project' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [deletedProject] = await db.delete(project)
			.where(
				and(
					eq(project.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.returning()
		
		if (!deletedProject) {
			return json({ error: 'Project not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting project:', error)
		return json({ error: 'Failed to delete project' }, { status: 500 })
	}
}