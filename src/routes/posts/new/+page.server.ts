import { db } from '$lib/server/db'
import { publication, preset, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

<<<<<<< HEAD
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
=======
export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all publications that belong to the user's products
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		productId: publication.productId
	})
	.from(publication)
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationId: preset.publicationId
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		publications: userPublications,
		presets: userPresets
	}
}
>>>>>>> 1ceced7b05726d8ca78737f91e87fa23576d51b3
