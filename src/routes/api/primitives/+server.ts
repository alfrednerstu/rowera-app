import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitives } from '$lib/server/db/schema'
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
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can access the primitives admin interface
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const allPrimitives = await db.select().from(primitives).orderBy(primitives.createdAt)
		return json(allPrimitives)
	} catch (error) {
		console.error('Error fetching primitives:', error)
		return json({ error: 'Failed to fetch primitives' }, { status: 500 })
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	// Only admins can create primitives
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		return json({ error: 'Admin access required' }, { status: 403 })
	}
	
	try {
		const { name, tagName, attributes, defaultContent, cssStyles } = await request.json()
		
		if (!name?.trim() || !tagName?.trim()) {
			return json({ error: 'Name and tagName are required' }, { status: 400 })
		}
		
		const [primitive] = await db.insert(primitives).values({
			name: name.trim(),
			tagName: tagName.trim(),
			attributes: attributes || {},
			defaultContent: defaultContent?.trim() || null,
			cssStyles: cssStyles?.trim() || null
		}).returning()
		
		return json(primitive)
	} catch (error) {
		console.error('Error creating primitive:', error)
		return json({ error: 'Failed to create primitive' }, { status: 500 })
	}
}