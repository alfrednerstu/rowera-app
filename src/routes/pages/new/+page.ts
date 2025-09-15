import { db } from '$lib/server/db'
import { products } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all user's products for the select field
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		products: userProducts
	}
}