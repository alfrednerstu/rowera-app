import { db } from '$lib/server/db'
import { product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		products: userProducts
	}
}