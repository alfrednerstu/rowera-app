import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitive, primitiveField } from '$lib/server/db/schema'
import { auth } from '$lib/server/auth'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

// Helper function to check admin status
async function isUserAdmin(userId: string): Promise<boolean> {
	try {
		const adminUsers = await auth.api.listAdminUsers({
			query: { userId }
		})
		return adminUsers && adminUsers.length > 0
	} catch {
		return false
	}
}

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can access the primitive admin interface
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const foundPrimitive = await db.query.primitive.findFirst({
			where: (p, { eq }) => eq(p.id, params.id),
			with: {
				fields: {
					orderBy: (fields, { asc }) => [asc(fields.order)]
				}
			}
		})

		if (!foundPrimitive) {
			return json({ error: 'Primitive not found' }, { status: 404 })
		}

		return json(foundPrimitive)
	} catch (error) {
		console.error('Error fetching primitive:', error)
		return json({ error: 'Failed to fetch primitive' }, { status: 500 })
	}
}

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can update primitive
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const { name, description, tags, fields } = await request.json()

		if (!name?.trim() || !description?.trim() || !tags?.trim()) {
			return json({ error: 'Name, description, and tags are required' }, { status: 400 })
		}

		// Update primitive
		const [updatedPrimitive] = await db.update(primitive)
			.set({
				name: name.trim(),
				description: description.trim(),
				tags: tags.trim(),
				updatedAt: new Date()
			})
			.where(eq(primitive.id, params.id))
			.returning()

		if (!updatedPrimitive) {
			return json({ error: 'Primitive not found' }, { status: 404 })
		}

		// Delete existing fields and insert new ones
		await db.delete(primitiveField).where(eq(primitiveField.primitiveId, params.id))

		if (fields && Array.isArray(fields) && fields.length > 0) {
			await db.insert(primitiveField).values(
				fields.map((field: any, index: number) => ({
					primitiveId: params.id,
					name: field.name.trim(),
					label: field.label.trim(),
					type: field.type.trim(),
					description: field.description?.trim() || null,
					placeholder: field.placeholder?.trim() || null,
					optional: field.optional || false,
					order: field.order ?? index
				}))
			)
		}

		// Return primitive with fields
		const result = await db.query.primitive.findFirst({
			where: (p, { eq }) => eq(p.id, params.id),
			with: {
				fields: {
					orderBy: (fields, { asc }) => [asc(fields.order)]
				}
			}
		})

		return json(result)
	} catch (error) {
		console.error('Error updating primitive:', error)
		return json({ error: 'Failed to update primitive' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can delete primitive
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const [primitive] = await db.delete(primitive)
			.where(eq(primitive.id, params.id))
			.returning()
		
		if (!primitive) {
			return json({ error: 'Primitive not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting primitive:', error)
		return json({ error: 'Failed to delete primitive' }, { status: 500 })
	}
}