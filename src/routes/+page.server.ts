import { db } from '$lib/server/db'
import { product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

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
}
