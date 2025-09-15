import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitives } from '$lib/server/db/schema'
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
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can access the primitives admin interface
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const [primitive] = await db.select().from(primitives).where(eq(primitives.id, params.id)).limit(1)
		
		if (!primitive) {
			return json({ error: 'Primitive not found' }, { status: 404 })
		}
		
		return json(primitive)
	} catch (error) {
		console.error('Error fetching primitive:', error)
		return json({ error: 'Failed to fetch primitive' }, { status: 500 })
	}
}

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can update primitives
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const { name, tagName, attributes, defaultContent, cssStyles } = await request.json()
		
		if (!name?.trim() || !tagName?.trim()) {
			return json({ error: 'Name and tagName are required' }, { status: 400 })
		}
		
		const [primitive] = await db.update(primitives)
			.set({ 
				name: name.trim(),
				tagName: tagName.trim(),
				attributes: attributes || {},
				defaultContent: defaultContent?.trim() || null,
				cssStyles: cssStyles?.trim() || null,
				updatedAt: new Date()
			})
			.where(eq(primitives.id, params.id))
			.returning()
		
		if (!primitive) {
			return json({ error: 'Primitive not found' }, { status: 404 })
		}
		
		return json(primitive)
	} catch (error) {
		console.error('Error updating primitive:', error)
		return json({ error: 'Failed to update primitive' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can delete primitives
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const [primitive] = await db.delete(primitives)
			.where(eq(primitives.id, params.id))
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