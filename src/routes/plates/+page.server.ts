import { db } from '$lib/server/db'
import { plate } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const userPlates = await db
    .select()
    .from(plate)
    .where(eq(plate.userId, user.id))

  return {
    plates: userPlates
  }
}
