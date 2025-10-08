import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const primitives = await db.query.primitive.findMany({
		orderBy: (primitive, { asc }) => [asc(primitive.name)],
		with: {
			fields: {
				orderBy: (fields, { asc }) => [asc(fields.order)]
			}
		}
	})

	return {
		primitives
	}
}
