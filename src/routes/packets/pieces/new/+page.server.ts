import { db } from '$lib/server/db'
import { project, packet, preset, primitive, partial } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { user } = await parent()

	if (!user?.id) {
		throw redirect(302, '/login')
	}

	// Get user's packets
	const userPackets = await db.select({
		id: packet.id,
		name: packet.name,
		projectName: project.name
	})
	.from(packet)
	.innerJoin(project, eq(packet.projectId, project.id))
	.where(eq(project.userId, user.id))

	// Get user's presets (from their packets) with primitives
	const userPresets = await db.query.preset.findMany({
		where: (preset, { inArray }) => inArray(
			preset.packetId,
			userPackets.map(p => p.id)
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
		orderBy: (partial, { asc}) => [asc(partial.name)],
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
		packets: userPackets,
		presets: userPresets,
		primitives: allPrimitives,
		partials: allPartials
	}
}