import { db } from '$lib/server/db'
import { product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

<<<<<<< HEAD
export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const userProducts = await db
    .select()
    .from(product)
    .where(eq(product.userId, user.id))

  return {
    products: userProducts
  }
=======
export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		products: userProducts
	}
>>>>>>> 1ceced7b05726d8ca78737f91e87fa23576d51b3
}
