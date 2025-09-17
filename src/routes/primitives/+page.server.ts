import { redirect, error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { primitive } from '$lib/server/db/schema'
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
	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Only admins can access the primitive admin interface
	const userIsAdmin = await isUserAdmin(locals.user.id)
	if (!userIsAdmin) {
		throw error(403, 'Admin access required')
	}
	
	try {
		const allPrimitives = await db.select().from(primitive).orderBy(primitive.createdAt)
		return {
			primitive: allPrimitives
		}
	} catch (err) {
		console.error('Error fetching primitive:', err)
		throw error(500, 'Failed to fetch primitive')
	}
}