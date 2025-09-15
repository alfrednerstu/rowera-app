import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { presets, publications, products, projects } from '$lib/server/db/schema'
import { eq, and, or, isNull } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, publicationId, projectId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Preset name is required' }, { status: 400 })
		}
		
		// Must belong to either a publication or a project, but not both
		if (!publicationId && !projectId) {
			return json({ error: 'Either publication or project is required' }, { status: 400 })
		}
		
		if (publicationId && projectId) {
			return json({ error: 'Preset cannot belong to both publication and project' }, { status: 400 })
		}
		
		// First, verify the existing preset belongs to the user
		const existingPreset = await db.select({ 
			id: presets.id,
			publicationId: presets.publicationId,
			projectId: presets.projectId
		})
		.from(presets)
		.leftJoin(publications, eq(presets.publicationId, publications.id))
		.leftJoin(products, or(
			eq(publications.productId, products.id),
			eq(presets.projectId, projects.id)
		))
		.leftJoin(projects, eq(presets.projectId, projects.id))
		.where(
			and(
				eq(presets.id, params.id),
				eq(products.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!existingPreset.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
		}
		
		// If publicationId is provided, verify it belongs to the user
		if (publicationId) {
			const publication = await db.select()
				.from(publications)
				.innerJoin(products, eq(publications.productId, products.id))
				.where(
					and(
						eq(publications.id, publicationId),
						eq(products.userId, locals.session.user.id)
					)
				)
				.limit(1)
			
			if (!publication.length) {
				return json({ error: 'Publication not found or access denied' }, { status: 404 })
			}
		}
		
		// If projectId is provided, verify it belongs to the user
		if (projectId) {
			const project = await db.select()
				.from(projects)
				.innerJoin(products, eq(projects.productId, products.id))
				.where(
					and(
						eq(projects.id, projectId),
						eq(products.userId, locals.session.user.id)
					)
				)
				.limit(1)
			
			if (!project.length) {
				return json({ error: 'Project not found or access denied' }, { status: 404 })
			}
		}
		
		// Update the preset
		const [preset] = await db.update(presets)
			.set({ 
				name: name.trim(),
				publicationId: publicationId || null,
				projectId: projectId || null,
				updatedAt: new Date()
			})
			.where(eq(presets.id, params.id))
			.returning()
		
		if (!preset) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		return json(preset)
	} catch (error) {
		console.error('Error updating preset:', error)
		return json({ error: 'Failed to update preset' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// Verify ownership through either publication or project relationship
		const presetToDelete = await db.select({ id: presets.id })
			.from(presets)
			.leftJoin(publications, eq(presets.publicationId, publications.id))
			.leftJoin(projects, eq(presets.projectId, projects.id))
			.innerJoin(products, or(
				eq(publications.productId, products.id),
				eq(projects.productId, products.id)
			))
			.where(
				and(
					eq(presets.id, params.id),
					eq(products.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!presetToDelete.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
		}
		
		// Delete the preset
		const [preset] = await db.delete(presets)
			.where(eq(presets.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting preset:', error)
		return json({ error: 'Failed to delete preset' }, { status: 500 })
	}
}