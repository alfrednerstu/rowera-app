import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitive, primitiveField } from '$lib/server/db/schema'
import { auth } from '$lib/server/auth'
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

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can access the primitive admin interface
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const allPrimitives = await db.query.primitive.findMany({
			orderBy: (primitive, { asc }) => [asc(primitive.createdAt)],
			with: {
				fields: {
					orderBy: (fields, { asc }) => [asc(fields.order)]
				}
			}
		})
		return json(allPrimitives)
	} catch (error) {
		console.error('Error fetching primitive:', error)
		return json({ error: 'Failed to fetch primitive' }, { status: 500 })
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can create primitive
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const { name, description, tags, fields } = await request.json()

		if (!name?.trim() || !description?.trim() || !tags?.trim()) {
			return json({ error: 'Name, description, and tags are required' }, { status: 400 })
		}

		// Insert primitive
		const [newPrimitive] = await db.insert(primitive).values({
			name: name.trim(),
			description: description.trim(),
			tags: tags.trim()
		}).returning()

		// Insert fields if provided
		if (fields && Array.isArray(fields) && fields.length > 0) {
			await db.insert(primitiveField).values(
				fields.map((field: any, index: number) => ({
					primitiveId: newPrimitive.id,
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
			where: (p, { eq }) => eq(p.id, newPrimitive.id),
			with: {
				fields: {
					orderBy: (fields, { asc }) => [asc(fields.order)]
				}
			}
		})

		return json(result)
	} catch (error) {
		console.error('Error creating primitive:', error)
		return json({ error: 'Failed to create primitive' }, { status: 500 })
	}
}