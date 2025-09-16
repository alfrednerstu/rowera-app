import { db } from '$lib/server/db'
import { partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

<<<<<<< HEAD
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
=======
export const load = async ({ locals }) => {
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's partial
	const userPartials = await db.select().from(partial).where(eq(partial.userId, locals.session.user.id))
	
	return {
		partial: userPartials
	}
}
>>>>>>> 1ceced7b05726d8ca78737f91e87fa23576d51b3
