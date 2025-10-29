import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { page, project } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, projectId, plateId, primitives } = await request.json()

		if (!name?.trim()) {
			return json({ error: 'Page name is required' }, { status: 400 })
		}

		if (!slug?.trim()) {
			return json({ error: 'Page slug is required' }, { status: 400 })
		}

		if (!projectId) {
			return json({ error: 'Project is required' }, { status: 400 })
		}

		// Verify that the new project belongs to the user
		const projectRows = await db.select()
			.from(project)
			.where(
				and(
					eq(project.id, projectId),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)

		if (!projectRows.length) {
			return json({ error: 'Project not found or access denied' }, { status: 404 })
		}

		// Update the page with ownership verification through original project
		const [updatedPage] = await db.update(page)
			.set({
				name: name.trim(),
				slug: slug.trim(),
				projectId,
				plateId: plateId || null,
				primitives: primitives || null,
				updatedAt: new Date()
			})
			.from(project)
			.where(
				and(
					eq(page.id, params.id),
					eq(page.projectId, project.id),
					eq(project.userId, locals.user.id)
				)
			)
			.returning({
				id: page.id,
				name: page.name,
				slug: page.slug,
				projectId: page.projectId,
				createdAt: page.createdAt,
				updatedAt: page.updatedAt
			})
		
		if (!updatedPage) {
			return json({ error: 'Page not found' }, { status: 404 })
		}
		
		return json(updatedPage)
	} catch (error) {
		console.error('Error updating page:', error)
		return json({ error: 'Failed to update page' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// First verify ownership through project relationship
		const pageToDelete = await db.select({ id: page.id })
			.from(page)
			.innerJoin(project, eq(page.projectId, project.id))
			.where(
				and(
					eq(page.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!pageToDelete.length) {
			return json({ error: 'Page not found' }, { status: 404 })
		}
		
		// Delete the page
		const [deletedPage] = await db.delete(page)
			.where(eq(page.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting page:', error)
		return json({ error: 'Failed to delete page' }, { status: 500 })
	}
}