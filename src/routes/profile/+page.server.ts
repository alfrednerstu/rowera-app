import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  return {
    user
  }
}
