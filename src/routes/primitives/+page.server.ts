import { redirect, error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitives } from '$lib/server/db/schema'
import { auth } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

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

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Only admins can access the primitives admin interface
	const userIsAdmin = await isUserAdmin(locals.session.user.id)
	if (!userIsAdmin) {
		throw error(403, 'Admin access required')
	}
	
	try {
		const allPrimitives = await db.select().from(primitives).orderBy(primitives.createdAt)
		return {
			primitives: allPrimitives
		}
	} catch (err) {
		console.error('Error fetching primitives:', err)
		throw error(500, 'Failed to fetch primitives')
	}
}