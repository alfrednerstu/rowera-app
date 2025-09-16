import { db } from '$lib/server/db'
import { publication, preset, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  // Publications that belong to the user's products
  const userPublications = await db
    .select({
      id: publication.id,
      name: publication.name,
      productId: publication.productId
    })
    .from(publication)
    .innerJoin(product, eq(publication.productId, product.id))
    .where(eq(product.userId, user.id))

  // Presets that belong to user's publications
  const userPresets = await db
    .select({
      id: preset.id,
      name: preset.name,
      publicationId: preset.publicationId
    })
    .from(preset)
    .innerJoin(publication, eq(preset.publicationId, publication.id))
    .innerJoin(product, eq(publication.productId, product.id))
    .where(eq(product.userId, user.id))

  return {
    publications: userPublications,
    presets: userPresets
  }
}
