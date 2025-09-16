import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const userPartials = await db
    .select()
    .from(partial)
    .where(eq(partial.userId, user.id))

  return {
    partials: userPartials
  }
}
