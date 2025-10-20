import { db } from '$lib/server/db'
import { publication, preset, project, primitive, partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  // Publications that belong to the user's projects
  const userPublications = await db
    .select({
      id: publication.id,
      name: publication.name,
      projectId: publication.projectId
    })
    .from(publication)
    .innerJoin(project, eq(publication.projectId, project.id))
    .where(eq(project.userId, user.id))

  // Presets that belong to user's publications with their primitives
  const userPresets = await db.query.preset.findMany({
    where: (preset, { inArray }) => inArray(
      preset.publicationId,
      userPublications.map(pub => pub.id)
    ),
    orderBy: (preset, { asc }) => [asc(preset.name)],
    with: {
      primitives: {
        orderBy: (pp, { asc }) => [asc(pp.order)],
        with: {
          primitive: {
            with: {
              fields: {
                orderBy: (fields, { asc }) => [asc(fields.order)]
              }
            }
          }
        }
      }
    }
  })

  // Get all primitives with their fields
  const allPrimitives = await db.query.primitive.findMany({
    orderBy: (primitive, { asc }) => [asc(primitive.name)],
    with: {
      fields: {
        orderBy: (fields, { asc }) => [asc(fields.order)]
      }
    }
  })

  // Get all partials with their primitives
  const allPartials = await db.query.partial.findMany({
    where: eq(partial.userId, user.id),
    orderBy: (partial, { asc }) => [asc(partial.name)],
    with: {
      primitives: {
        orderBy: (pp, { asc }) => [asc(pp.order)],
        with: {
          primitive: {
            with: {
              fields: {
                orderBy: (fields, { asc }) => [asc(fields.order)]
              }
            }
          }
        }
      }
    }
  })

  return {
    publications: userPublications,
    presets: userPresets,
    primitives: allPrimitives,
    partials: allPartials
  }
}
