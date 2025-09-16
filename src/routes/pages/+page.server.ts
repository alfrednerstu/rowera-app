import { db } from '$lib/server/db'
import { page, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const userPages = await db
    .select({
      id: page.id,
      name: page.title,
      slug: page.slug,
      productId: page.productId,
      productName: product.name,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    })
    .from(page)
    .innerJoin(product, eq(page.productId, product.id))
    .where(eq(product.userId, user.id))

  const userProducts = await db
    .select()
    .from(product)
    .where(eq(product.userId, user.id))

  return {
    pages: userPages,
    products: userProducts
  }
}
